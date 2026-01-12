import { anthropic } from '@ai-sdk/anthropic';
import { streamText, StreamData } from 'ai';
import { z } from 'zod';
import { META_PROMPT, ENHANCEMENT_LEVELS } from '@/lib/prompts/meta-prompt';

const RequestSchema = z.object({
  prompt: z.string().min(3, 'Input must be at least 3 characters').max(2000, 'Input must not exceed 2000 characters').optional(),
  input: z.string().min(3, 'Input must be at least 3 characters').max(2000, 'Input must not exceed 2000 characters').optional(),
  targetModel: z.string().default('claude-sonnet-4-5-20250929'), // Full Claude model ID
  enhancementLevel: z.enum(['light', 'standard', 'comprehensive']).default('standard'),
}).refine(data => data.prompt || data.input, {
  message: 'Either prompt or input is required',
  path: ['input'],
});

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs'; // Prisma requires Node.js runtime
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const validationResult = RequestSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const { prompt: userPrompt, input, targetModel, enhancementLevel } = validationResult.data;

    // Use prompt field if available, otherwise fall back to input
    const userInput = userPrompt || input || '';

    // Map deprecated Claude 3 models to current Claude 4 models (as of 2026)
    // Claude 4 models (claude-sonnet-4-5-20250929, claude-opus-4-5-20251101, etc.) are the current valid models
    // Claude 3 models are deprecated/retired
    const MODEL_MAPPING: Record<string, string> = {
      // Map any old Claude 3 references to Claude 4 equivalents
      'claude-3-opus-20240229': 'claude-opus-4-5-20251101',
      'claude-3-sonnet-20240229': 'claude-sonnet-4-5-20250929',
      'claude-3-5-sonnet-20240620': 'claude-sonnet-4-5-20250929',
      'claude-3-5-sonnet-20241022': 'claude-sonnet-4-5-20250929',
      'claude-3-haiku-20240307': 'claude-haiku-4-5-20251001',
      'claude-3-5-haiku-20241022': 'claude-haiku-4-5-20251001',
    };

    // Use the mapped model if it exists, otherwise use the requested model
    const actualModel = MODEL_MAPPING[targetModel] || targetModel;

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return Response.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Replace placeholders in the meta-prompt
    const prompt = META_PROMPT
      .replace('{{USER_INPUT}}', userInput)
      .replace('{{TARGET_MODEL}}', targetModel) // Keep user's target model name in prompt for context
      .replace('{{ENHANCEMENT_LEVEL}}', ENHANCEMENT_LEVELS[enhancementLevel]);

    // Create a StreamData object to send additional data
    const data = new StreamData();

    // Use the model ID directly
    const result = await streamText({
      model: anthropic(actualModel),
      prompt,
      maxTokens: 2500,
      temperature: 0.7,
      onFinish: async (completion) => {
        if (userId) {
          try {
            // Extract the JSON content from the completion for storage
            const enhancedOutput = completion.text;

            const savedPrompt = await prisma.prompt.create({
              data: {
                userId,
                originalInput: userInput,
                enhancedOutput: enhancedOutput, // Stores the full JSON string response
                modelUsed: targetModel,
                enhancement: JSON.stringify({ level: enhancementLevel }), // Store metadata
              }
            });

            // Append the prompt ID to the stream data
            data.append({ promptId: savedPrompt.id });
          } catch (dbError) {
            console.error('Failed to save prompt to DB:', dbError);
          } finally {
            await data.close();
          }
        } else {
          await data.close();
        }
      }
    });

    return result.toDataStreamResponse({ data });
  } catch (error) {
    console.error('Enhancement error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return Response.json(
          { error: 'Authentication failed. Please check your API key.' },
          { status: 401 }
        );
      }

      if (error.message.includes('model')) {
        return Response.json(
          { error: 'Invalid model specified', message: error.message },
          { status: 400 }
        );
      }

      return Response.json(
        { error: 'Enhancement failed', message: error.message },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
