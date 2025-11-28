import Image from 'next/image';
import { Navigation } from '@/components/navigation';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-base sm:text-xl px-2">
            Everything you need to know about PromptForge
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-700">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">What is PromptForge?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                PromptForge is an AI-powered tool that transforms your casual descriptions into professionally optimized prompts.
                It uses advanced prompt engineering techniques to help you get better results from AI models like ChatGPT and Claude.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">How does it work?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Simply describe what you want in plain language, select your enhancement level, and click "Enhance Prompt".
                Our AI analyzes your input, detects your intent, and restructures it using proven prompt engineering patterns
                like chain-of-thought, few-shot learning, and role assignment.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">What are the enhancement levels?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                <strong className="text-white">Light:</strong> Quick fixes for clarity and basic structure.<br/>
                <strong className="text-white">Standard:</strong> Balanced enhancement with good structure and formatting.<br/>
                <strong className="text-white">Comprehensive:</strong> Maximum enhancement with examples, edge cases, and detailed guidance.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">Is it free?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Yes! PromptForge is completely free to use. We're powered by Claude Sonnet 4.5 and hosted on Vercel.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">What AI models can I use the enhanced prompts with?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                The enhanced prompts work with any AI model including ChatGPT, Claude, Gemini, and others.
                You can even optimize specifically for Claude or GPT-4 using the "Target Model" option.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">Why does Gratje recommend this?</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Because Gratje knows quality when he sees it! Even from Maaskantje, Gratje understands that good prompts
                are the key to getting the best AI responses. Helemaal vet!
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials - Gratje Edition */}
        <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-orange-500/30">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 text-center">What Gratje Says</h2>
          <p className="text-slate-400 text-center text-xs sm:text-sm mb-4 sm:mb-6">Trusted by the most legendary dog in Maaskantje</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-1.gif"
                    alt="Gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">Gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Schnell schnell! Das ist doch nicht zu glauben! Meine Prompts sind jetzt so gut, dass sogar Richard sie versteht. Total geil!"
              </p>
            </div>

            {/* nicht_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-2.gif"
                    alt="nicht_gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">nicht_gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Jesus Christus! Ich habe noch nie so schöne Prompts gesehen. Besser als ein Frikandel-Brötchen, und das will schon was heißen!"
              </p>
            </div>

            {/* auch_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-3.gif"
                    alt="auch_gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">auch_gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Ich bin total fertig von diesem Tool! Jetzt kann ich endlich gute Prompts machen, ohne dass Barrie alles versaut. Junge junge junge!"
              </p>
            </div>

            {/* mega_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-4.gif"
                    alt="mega_gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">mega_gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Das ist doch unglaublich! Sogar besser als damals, als wir den Roller geklaut haben. Total abgefahren!"
              </p>
            </div>

            {/* super_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-5.gif"
                    alt="super_gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">super_gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Junge! Für diese Prompts würde ich sogar meine Bredase Kaolo eintauschen. Und das bedeutet echt viel!"
              </p>
            </div>

            {/* ultra_gratje */}
            <div className="bg-slate-800/70 rounded-lg p-3 sm:p-4 border border-orange-500/20">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <Image
                    src="/images/gratje/gratje-6.gif"
                    alt="ultra_gratje"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">ultra_gratje</h3>
                  <div className="text-yellow-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm italic">
                "Was für ein geiles Ding! Jetzt mache ich bessere Prompts als Gerrie bessere Würste macht. Und das will echt was heißen, Junge!"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
