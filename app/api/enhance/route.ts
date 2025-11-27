import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { z } from 'zod';
import { META_PROMPT, ENHANCEMENT_LEVELS } from '@/lib/prompts/meta-prompt';

const RequestSchema = z.object({
  prompt: z.string().min(3, 'Input must be at least 3 characters').max(2000, 'Input must not exceed 2000 characters').optional(),
  input: z.string().min(3, 'Input must be at least 3 characters').max(2000, 'Input must not exceed 2000 characters').optional(),
  targetModel: z.enum(['claude', 'gpt4', 'general']).default('general'),
  enhancementLevel: z.enum(['light', 'standard', 'comprehensive']).default('standard'),
}).refine(data => data.prompt || data.input, {
  message: 'Either prompt or input is required',
  path: ['input'],
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
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

    const result = await streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt,
      maxTokens: 2500,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
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
