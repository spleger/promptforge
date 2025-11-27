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

        {/* Features */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">✨ Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-white font-semibold">Smart Intent Detection</h3>
                <p className="text-slate-400 text-sm">Understands what you're trying to accomplish</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-white font-semibold">Real-time Streaming</h3>
                <p className="text-slate-400 text-sm">See results as they generate</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="text-white font-semibold">3 Enhancement Levels</h3>
                <p className="text-slate-400 text-sm">Light, Standard, or Comprehensive</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-white font-semibold">Model-Specific Optimization</h3>
                <p className="text-slate-400 text-sm">Tailored for Claude, GPT-4, or general use</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="text-white font-semibold">Detailed Analysis</h3>
                <p className="text-slate-400 text-sm">See complexity, techniques, and suggestions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-white font-semibold">One-Click Copy</h3>
                <p className="text-slate-400 text-sm">Instantly copy to use anywhere</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-xl font-semibold text-white mb-3">💡 Try These Examples</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "help me write professional emails"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "review my code for bugs"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "create a study plan for learning Python"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "summarize this article"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "write better social media posts"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "brainstorm product ideas"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "debug my JavaScript function"
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300 text-sm hover:bg-slate-700/50 transition-colors cursor-pointer">
              "translate and improve this text"
            </div>
          </div>
        </div>

        {/* Testimonials - Gratje Edition */}
        <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-orange-500/30">
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">🐕 What Gratje Says</h2>
          <p className="text-slate-400 text-center text-sm mb-6">Trusted by the most legendary dog in Maaskantje</p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-2xl mr-3">
                  🐕
                </div>
                <div>
                  <h3 className="text-white font-bold">Gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Gauw gauw! Dit is toch niet te geloven! Mijn prompts zijn nu zo goed dat zelfs Richard ze begrijpt. Helemaal vet!"
              </p>
            </div>

            {/* nicht_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center text-2xl mr-3">
                  🦮
                </div>
                <div>
                  <h3 className="text-white font-bold">nicht_gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Jezus Christus! Ik heb nog nooit zulke mooie prompts gezien. Beter dan een frikandel broodje, en dat wil wat zeggen!"
              </p>
            </div>

            {/* auch_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-orange-800 rounded-full flex items-center justify-center text-2xl mr-3">
                  🐶
                </div>
                <div>
                  <h3 className="text-white font-bold">auch_gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Ik ben helemaal kapot van deze tool! Nu kan ik eindelijk goede prompts maken zonder dat Barrie alles verpest. Jonge jonge jonge!"
              </p>
            </div>

            {/* mega_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-orange-900 rounded-full flex items-center justify-center text-2xl mr-3">
                  🐕‍🦺
                </div>
                <div>
                  <h3 className="text-white font-bold">mega_gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Dit is toch wel ongelofelijk dit! Zelfs beter dan die keer dat we die scooter jatten. Helemaal te gek!"
              </p>
            </div>

            {/* super_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-yellow-700 rounded-full flex items-center justify-center text-2xl mr-3">
                  🦴
                </div>
                <div>
                  <h3 className="text-white font-bold">super_gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Jonguh! Voor deze prompts zou ik zelfs mijnBredase kaolo ruilen. En dat betekent echt heel veel!"
              </p>
            </div>

            {/* ultra_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-2xl mr-3">
                  🌭
                </div>
                <div>
                  <h3 className="text-white font-bold">ultra_gratje</h3>
                  <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm italic">
                "Wat een gaaf ding! Nu maak ik betere prompts dan Gerrie betere worsten maakt. En dat wil echt wat zeggen, jonge!"
              </p>
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

        {/* FAQ Section */}
        {!parsedResult && !isLoading && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">❓ Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">What is PromptForge?</h3>
                <p className="text-slate-400 text-sm">
                  PromptForge is an AI-powered tool that transforms your casual descriptions into professionally optimized prompts.
                  It uses advanced prompt engineering techniques to help you get better results from AI models like ChatGPT and Claude.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">How does it work?</h3>
                <p className="text-slate-400 text-sm">
                  Simply describe what you want in plain language, select your enhancement level, and click "Enhance Prompt".
                  Our AI analyzes your input, detects your intent, and restructures it using proven prompt engineering patterns
                  like chain-of-thought, few-shot learning, and role assignment.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">What are the enhancement levels?</h3>
                <p className="text-slate-400 text-sm">
                  <strong className="text-white">Light:</strong> Quick fixes for clarity and basic structure.<br/>
                  <strong className="text-white">Standard:</strong> Balanced enhancement with good structure and formatting.<br/>
                  <strong className="text-white">Comprehensive:</strong> Maximum enhancement with examples, edge cases, and detailed guidance.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Is it free?</h3>
                <p className="text-slate-400 text-sm">
                  Yes! PromptForge is completely free to use. We're powered by Claude Sonnet 4.5 and hosted on Vercel.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">What AI models can I use the enhanced prompts with?</h3>
                <p className="text-slate-400 text-sm">
                  The enhanced prompts work with any AI model including ChatGPT, Claude, Gemini, and others.
                  You can even optimize specifically for Claude or GPT-4 using the "Target Model" option.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Why does Gratje recommend this?</h3>
                <p className="text-slate-400 text-sm">
                  Because Gratje knows quality when he sees it! Even from Maaskantje, Gratje understands that good prompts
                  are the key to getting the best AI responses. Helemaal vet!
                </p>
              </div>
            </div>
          </div>
        )}

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
            Made with ❤️ by developers who love good prompts (and Gratje)
          </p>
        </footer>
      </div>
    </main>
  );
}
