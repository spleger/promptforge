'use client';

import { useState, useMemo } from 'react';
import { useCompletion } from 'ai/react';
import { PromptInput } from '@/components/prompt-input';
import { PromptOutput } from '@/components/prompt-output';
import { EnhancementOptionsComponent } from '@/components/enhancement-options';
import { Navigation } from '@/components/navigation';
import { EnhancementResult, EnhancementOptions } from '@/lib/types';
import { parseJsonSafely } from '@/lib/utils';

export default function ForgePage() {
  const [options, setOptions] = useState<EnhancementOptions>({
    targetModel: 'general',
    enhancementLevel: 'standard',
  });

  const { completion, input, handleInputChange, handleSubmit, isLoading, error } = useCompletion({
    api: '/api/enhance',
    body: options,
  });

  // Parse the streamed JSON response
  const parsedResult = useMemo(() => {
    if (!completion) return null;

    try {
      const jsonMatch = completion.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return parseJsonSafely<EnhancementResult>(jsonMatch[0]);
      }
      return null;
    } catch {
      return null;
    }
  }, [completion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Prompt Forge
          </h1>
          <p className="text-slate-400 text-xl mb-3">
            Transform casual descriptions into optimized AI prompts
          </p>
          <p className="text-slate-500 text-base max-w-3xl mx-auto">
            Turn your rough ideas into professionally structured prompts using advanced prompt engineering techniques.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Your Prompt</h2>
          <PromptInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <EnhancementOptionsComponent
            options={options}
            onChange={setOptions}
          />
        </div>

        {/* Output Section */}
        {(parsedResult || isLoading) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Enhanced Result</h2>
            <PromptOutput
              result={parsedResult}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200 mb-6">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error.message}</p>
          </div>
        )}
      </main>
    </div>
  );
}
