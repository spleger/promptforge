import { Navigation } from '@/components/navigation';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-xl">
            Everything you need to know about PromptForge
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">What is PromptForge?</h3>
              <p className="text-slate-400">
                PromptForge is an AI-powered tool that transforms your casual descriptions into professionally optimized prompts.
                It uses advanced prompt engineering techniques to help you get better results from AI models like ChatGPT and Claude.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">How does it work?</h3>
              <p className="text-slate-400">
                Simply describe what you want in plain language, select your enhancement level, and click "Enhance Prompt".
                Our AI analyzes your input, detects your intent, and restructures it using proven prompt engineering patterns
                like chain-of-thought, few-shot learning, and role assignment.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">What are the enhancement levels?</h3>
              <p className="text-slate-400">
                <strong className="text-white">Light:</strong> Quick fixes for clarity and basic structure.<br/>
                <strong className="text-white">Standard:</strong> Balanced enhancement with good structure and formatting.<br/>
                <strong className="text-white">Comprehensive:</strong> Maximum enhancement with examples, edge cases, and detailed guidance.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Is it free?</h3>
              <p className="text-slate-400">
                Yes! PromptForge is completely free to use. We're powered by Claude Sonnet 4.5 and hosted on Vercel.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">What AI models can I use the enhanced prompts with?</h3>
              <p className="text-slate-400">
                The enhanced prompts work with any AI model including ChatGPT, Claude, Gemini, and others.
                You can even optimize specifically for Claude or GPT-4 using the "Target Model" option.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Why does Gratje recommend this?</h3>
              <p className="text-slate-400">
                Because Gratje knows quality when he sees it! Even from Maaskantje, Gratje understands that good prompts
                are the key to getting the best AI responses. Helemaal vet!
              </p>
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
      </main>
    </div>
  );
}
