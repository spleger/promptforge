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
      .replace('{{TARGET_MODEL}}', targetModel)
      .replace('{{ENHANCEMENT_LEVEL}}', ENHANCEMENT_LEVELS[enhancementLevel]);

    // Create a StreamData object to send additional data
    const data = new StreamData();

    // Use the model ID directly
    const result = await streamText({
      model: anthropic(targetModel),
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
    console.error('Enhancement error:', error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Authentication failed. Please check your API key.' },
          { status: 401 }
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
