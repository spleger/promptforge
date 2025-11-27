'use client';

import { useState, useMemo } from 'react';
import { useCompletion } from 'ai/react';
import { Navigation } from '@/components/navigation';
import { PromptInput } from '@/components/prompt-input';
import { PromptOutput } from '@/components/prompt-output';
import { EnhancementOptionsComponent } from '@/components/enhancement-options';
import { EnhancementResult, EnhancementOptions } from '@/lib/types';
import { parseJsonSafely } from '@/lib/utils';

export default function Home() {
  const [options, setOptions] = useState<EnhancementOptions>({
    targetModel: 'claude-sonnet-4-5-20250929', // Default to Sonnet 4.5
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PromptForge
          </h1>
          <p className="text-slate-300 text-2xl mb-4">
            Transform casual descriptions into optimized AI prompts
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-2">
            Turn your rough ideas into professionally structured prompts using advanced prompt engineering techniques.
          </p>
          <p className="text-slate-500 text-sm">
            Powered by Claude Sonnet 4.5
          </p>
        </div>

        {/* Prompt Enhancer - At the top for easy access */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700 shadow-2xl">
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Enhanced Result</h2>
            <PromptOutput
              result={parsedResult}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200 mb-8">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error.message}</p>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 mb-12 border border-slate-700">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">1. Describe Your Need</h3>
              <p className="text-slate-400">
                Write what you want in plain language. No need to be formal or specific.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">2. AI Enhancement</h3>
              <p className="text-slate-400">
                Our system analyzes and applies proven prompt engineering techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">3. Copy & Use</h3>
              <p className="text-slate-400">
                Get a structured, optimized prompt ready to use with any AI model.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 mb-12 border border-slate-700">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Smart Intent Detection</h3>
                <p className="text-slate-400">Understands what you're trying to accomplish</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Real-time Streaming</h3>
                <p className="text-slate-400">See results as they generate</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">🎨</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">3 Enhancement Levels</h3>
                <p className="text-slate-400">Light, Standard, or Comprehensive</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">🤖</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Model-Specific Optimization</h3>
                <p className="text-slate-400">Tailored for Claude Opus, Sonnet, or Haiku</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Detailed Analysis</h3>
                <p className="text-slate-400">See complexity, techniques, and suggestions</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">One-Click Copy</h3>
                <p className="text-slate-400">Instantly copy to use anywhere</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-8 mb-12 border border-blue-500/30">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Try These Examples</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"help me write professional emails"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"review my code for bugs"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"create a study plan for learning Python"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"summarize this article"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"write better social media posts"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"brainstorm product ideas"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"debug my JavaScript function"</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 hover:bg-slate-700/50 transition-colors">
              <span className="text-sm">"translate and improve this text"</span>
            </div>
          </div>
        </div>

        {/* Testimonials - Gratje Edition */}
        <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-xl p-8 mb-12 border border-orange-500/30">
          <h2 className="text-3xl font-semibold text-white mb-2 text-center">Was Gratje sagt</h2>
          <p className="text-slate-400 text-center mb-8">Vertraut von dem legendärsten Hund in Maaskantje</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-3xl mr-3">
                  🐕
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Schnell schnell! Das ist doch nicht zu glauben! Meine Prompts sind jetzt so gut, dass sogar Richard sie versteht. Total geil!"
              </p>
            </div>

            {/* nicht_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-orange-700 rounded-full flex items-center justify-center text-3xl mr-3">
                  🦮
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">nicht_gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Jesus Christus! Ich habe noch nie so schöne Prompts gesehen. Besser als ein Frikandel-Brötchen, und das will schon was heißen!"
              </p>
            </div>

            {/* auch_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-orange-800 rounded-full flex items-center justify-center text-3xl mr-3">
                  🐶
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">auch_gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Ich bin total fertig von diesem Tool! Jetzt kann ich endlich gute Prompts machen, ohne dass Barrie alles versaut. Junge junge junge!"
              </p>
            </div>

            {/* mega_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-orange-900 rounded-full flex items-center justify-center text-3xl mr-3">
                  🐕‍🦺
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">mega_gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Das ist doch unglaublich! Sogar besser als damals, als wir den Roller geklaut haben. Total abgefahren!"
              </p>
            </div>

            {/* super_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-yellow-700 rounded-full flex items-center justify-center text-3xl mr-3">
                  🦴
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">super_gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Junge! Für diese Prompts würde ich sogar meine Bredase Kaolo eintauschen. Und das bedeutet echt viel!"
              </p>
            </div>

            {/* ultra_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-5 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-yellow-600 rounded-full flex items-center justify-center text-3xl mr-3">
                  🌭
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">ultra_gratje</h3>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Was für ein geiles Ding! Jetzt mache ich bessere Prompts als Gerrie bessere Würste macht. Und das will echt was heißen, Junge!"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>
            Built with Next.js, TypeScript, and Anthropic's Claude API
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/sven-stack/promptforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on GitHub
            </a>
          </p>
          <p className="mt-4 text-slate-600 text-xs">
            Made with love by developers who love good prompts (and Gratje)
          </p>
        </footer>
      </main>
    </div>
  );
}
