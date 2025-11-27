import { Navigation } from '@/components/navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PromptForge
          </h1>
          <p className="text-slate-300 text-2xl mb-4">
            Transform casual descriptions into optimized AI prompts
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-8">
            Turn your rough ideas into professionally structured prompts using advanced prompt engineering techniques.
            Get better results from ChatGPT, Claude, and other AI models.
          </p>
          <Link
            href="/forge"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Forging Prompts →
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            Powered by Claude Sonnet 4.5
          </p>
        </div>

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
          <h2 className="text-3xl font-semibold text-white mb-2 text-center">What Gratje Says</h2>
          <p className="text-slate-400 text-center mb-8">Trusted by the most legendary dog in Maaskantje</p>

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
                "Gauw gauw! Dit is toch niet te geloven! Mijn prompts zijn nu zo goed dat zelfs Richard ze begrijpt. Helemaal vet!"
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
                "Jezus Christus! Ik heb nog nooit zulke mooie prompts gezien. Beter dan een frikandel broodje, en dat wil wat zeggen!"
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
                "Ik ben helemaal kapot van deze tool! Nu kan ik eindelijk goede prompts maken zonder dat Barrie alles verpest. Jonge jonge jonge!"
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
                "Dit is toch wel ongelofelijk dit! Zelfs beter dan die keer dat we die scooter jatten. Helemaal te gek!"
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
                "Jonguh! Voor deze prompts zou ik zelfs mijnBredase kaolo ruilen. En dat betekent echt heel veel!"
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
                "Wat een gaaf ding! Nu maak ik betere prompts dan Gerrie betere worsten maakt. En dat wil echt wat zeggen, jonge!"
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-12 border border-blue-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to create better prompts?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Start transforming your ideas into professional AI prompts in seconds
          </p>
          <Link
            href="/forge"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-10 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            Try PromptForge Now →
          </Link>
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
