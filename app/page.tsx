'use client';

import { useState, useMemo } from 'react';
import { useCompletion } from 'ai/react';
import { PromptInput } from '@/components/prompt-input';
import { PromptOutput } from '@/components/prompt-output';
import { EnhancementOptionsComponent } from '@/components/enhancement-options';
import { EnhancementResult, EnhancementOptions } from '@/lib/types';
import { parseJsonSafely } from '@/lib/utils';

export default function Home() {
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

    // Try to parse JSON from the completion
    // The API streams text, so we need to handle partial JSON
    try {
      // Look for JSON object in the completion
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
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PromptForge
          </h1>
          <p className="text-slate-400 text-xl mb-3">
            Transform casual descriptions into optimized AI prompts
          </p>
          <p className="text-slate-500 text-base max-w-3xl mx-auto mb-4">
            Turn your rough ideas into professionally structured prompts using advanced prompt engineering techniques.
            Get better results from ChatGPT, Claude, and other AI models.
          </p>
          <p className="text-slate-600 text-sm">
            Powered by Claude Sonnet 4.5
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-white font-semibold mb-2">1. Describe Your Need</h3>
              <p className="text-slate-400 text-sm">
                Write what you want in plain language. No need to be formal or specific.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-white font-semibold mb-2">2. AI Enhancement</h3>
              <p className="text-slate-400 text-sm">
                Our system analyzes and applies proven prompt engineering techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-white font-semibold mb-2">3. Copy & Use</h3>
              <p className="text-slate-400 text-sm">
                Get a structured, optimized prompt ready to use with any AI model.
              </p>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-xl font-semibold text-white mb-3">💡 Try These Examples</h2>
          <div className="space-y-2">
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "help me write professional emails"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "review my code for bugs and security issues"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "create a study plan for learning Python"
            </div>
          </div>
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

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>
            Built with Next.js, TypeScript, and Anthropic's Claude API
          </p>
          <p className="mt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
