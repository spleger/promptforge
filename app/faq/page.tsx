import { Navigation } from '@/components/navigation';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Häufig gestellte Fragen
          </h1>
          <p className="text-slate-400 text-xl">
            Alles was Sie über PromptForge wissen müssen
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Was ist PromptForge?</h3>
              <p className="text-slate-400">
                PromptForge ist ein KI-gestütztes Tool, das Ihre beiläufigen Beschreibungen in professionell optimierte Prompts verwandelt.
                Es verwendet fortschrittliche Prompt-Engineering-Techniken, um Ihnen bessere Ergebnisse von KI-Modellen wie ChatGPT und Claude zu ermöglichen.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Wie funktioniert es?</h3>
              <p className="text-slate-400">
                Beschreiben Sie einfach in normaler Sprache, was Sie möchten, wählen Sie Ihr Verbesserungsniveau und klicken Sie auf "Prompt verbessern".
                Unsere KI analysiert Ihre Eingabe, erkennt Ihre Absicht und strukturiert sie mit bewährten Prompt-Engineering-Mustern
                wie Chain-of-Thought, Few-Shot-Learning und Rollenzuweisung.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Was sind die Verbesserungsstufen?</h3>
              <p className="text-slate-400">
                <strong className="text-white">Light:</strong> Schnelle Korrekturen für Klarheit und grundlegende Struktur.<br/>
                <strong className="text-white">Standard:</strong> Ausgewogene Verbesserung mit guter Struktur und Formatierung.<br/>
                <strong className="text-white">Comprehensive:</strong> Maximale Verbesserung mit Beispielen, Randfällen und detaillierten Anleitungen.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Ist es kostenlos?</h3>
              <p className="text-slate-400">
                Ja! PromptForge ist völlig kostenlos nutzbar. Wir werden von Claude Sonnet 4.5 betrieben und auf Vercel gehostet.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Mit welchen KI-Modellen kann ich die verbesserten Prompts verwenden?</h3>
              <p className="text-slate-400">
                Die verbesserten Prompts funktionieren mit jedem KI-Modell, einschließlich ChatGPT, Claude, Gemini und anderen.
                Sie können sogar speziell für Claude oder GPT-4 optimieren, indem Sie die Option "Zielmodell" verwenden.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Warum empfiehlt Gratje das?</h3>
              <p className="text-slate-400">
                Weil Gratje Qualität erkennt, wenn er sie sieht! Selbst aus Maaskantje versteht Gratje, dass gute Prompts
                der Schlüssel zu den besten KI-Antworten sind. Total geil!
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials - Gratje Edition (German) */}
        <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-orange-500/30">
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">🐕 Was Gratje sagt</h2>
          <p className="text-slate-400 text-center text-sm mb-6">Vertraut vom legendärsten Hund in Maaskantje</p>

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
                "Schnell schnell! Das ist doch nicht zu glauben! Meine Prompts sind jetzt so gut, dass sogar Richard sie versteht. Total geil!"
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
                "Jesus Christus! Ich habe noch nie so schöne Prompts gesehen. Besser als ein Frikandel-Brötchen, und das will schon was heißen!"
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
                "Ich bin total fertig von diesem Tool! Jetzt kann ich endlich gute Prompts machen, ohne dass Barrie alles versaut. Junge junge junge!"
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
                "Das ist doch unglaublich! Sogar besser als damals, als wir den Roller geklaut haben. Total abgefahren!"
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
                "Junge! Für diese Prompts würde ich sogar meine Bredase Kaolo eintauschen. Und das bedeutet echt viel!"
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
                "Was für ein geiles Ding! Jetzt mache ich bessere Prompts als Gerrie bessere Würste macht. Und das will echt was heißen, Junge!"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
