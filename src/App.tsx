import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, EyeOff, Link, Target, Scale, Loader2, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AnalysisResult {
  L: string;
  U: string;
  C: string;
  I: string;
  D: string;
  concluzie: string;
}

const filters = [
  { id: 'L', title: 'Lupa pe Premise', icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'U', title: 'Unghiurile Moarte', icon: EyeOff, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { id: 'C', title: 'Cauzalitate vs. Corelație', icon: Link, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'I', title: 'Intenție și Influență', icon: Target, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { id: 'D', title: 'Demontarea prin Dovezi', icon: Scale, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
];

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Ești un expert în gândire critică, logică și auto-apărare mentală.
Analizează următoarea afirmație, cuvânt sau serie de cuvinte folosind metoda L.U.C.I.D.

Metoda L.U.C.I.D. este formată din 5 filtre:
1. L - Lupa pe Premise: Ignoră concluzia. Uită-te la fundație. Ce anume trebuie să iau de bun (fără dovezi) pentru ca afirmația să fie măcar parțial adevărată?
2. U - Unghiurile Moarte (Bias-urile): Oglinda. Cel mai ușor om de păcălit ești tu însuți. Ce dovadă fizică, clară, m-ar face să recunosc chiar acum că greșesc în privința acestui subiect?
3. C - Cauzalitate vs. Corelație: Doar pentru că două lucruri se întâmplă simultan, nu înseamnă că unul îl cauzează pe celălalt. Există un Factor Z (o cauză ascunsă) care le-ar putea provoca pe amândouă într-un mod mult mai logic?
4. I - Intenție și Influență: Când emoția crește, logica scade. Pune pe pauză reacția. Ce vrea această persoană (sau sursă) să SIMT acum, și cine câștigă bani sau putere dacă eu acționez la cald, dictat de această emoție?
5. D - Demontarea prin Dovezi: Sarcina probei cade pe cel care face afirmația. Inversia: caută dovezi care să distrugă ideea, nu care să o susțină. Dacă ar fi să testăm ideea asta în practică mâine, care ar fi primul indicator măsurabil pe care ar trebui să-l urmărim?

Analizează acest text: "${input}"

Răspunde în format JSON, strict cu următoarea structură:
{
  "L": "Analiza pentru Lupa pe Premise...",
  "U": "Analiza pentru Unghiurile Moarte...",
  "C": "Analiza pentru Cauzalitate vs. Corelație...",
  "I": "Analiza pentru Intenție și Influență...",
  "D": "Analiza pentru Demontarea prin Dovezi...",
  "concluzie": "O concluzie scurtă și tăioasă despre validitatea afirmației."
}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              L: { type: Type.STRING, description: "Analiza Lupa pe Premise" },
              U: { type: Type.STRING, description: "Analiza Unghiurile Moarte" },
              C: { type: Type.STRING, description: "Analiza Cauzalitate vs. Corelație" },
              I: { type: Type.STRING, description: "Analiza Intenție și Influență" },
              D: { type: Type.STRING, description: "Analiza Demontarea prin Dovezi" },
              concluzie: { type: Type.STRING, description: "Concluzia finală" },
            },
            required: ["L", "U", "C", "I", "D", "concluzie"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setAnalysis(result);
      } else {
        throw new Error("No response text");
      }
    } catch (err) {
      console.error(err);
      setError('A apărut o eroare la analizarea textului. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-800">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5 text-zinc-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">L.U.C.I.D.</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Trusă de auto-apărare mentală</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Intro / Form Section */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
                Nu lăsa zgomotul să gândească pentru tine.
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Înainte de a lua o decizie importantă, de a semna un contract sau de a intra într-o ceartă, trece informația prin aceste 5 filtre critice.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Introdu o afirmație, o știre, un argument sau un cuvânt pentru a-l demonta..."
                  className="w-full h-40 bg-zinc-900/50 border border-white/10 rounded-2xl p-5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none transition-all"
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-600">
                  {input.length} caractere
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full bg-white text-black font-medium rounded-xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Se analizează...</span>
                  </>
                ) : (
                  <>
                    <span>Demontare L.U.C.I.D.</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm"
              >
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!analysis && !loading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 text-zinc-500"
                >
                  <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                  <p className="max-w-sm">
                    Sistemul este pregătit. Introdu un text în stânga pentru a începe analiza critică.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800" />
                        <div className="h-5 bg-zinc-800 rounded w-1/3" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded w-full" />
                        <div className="h-4 bg-zinc-800 rounded w-5/6" />
                        <div className="h-4 bg-zinc-800 rounded w-4/6" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Conclusion Card */}
                  <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-white" />
                    <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-3">Verdict</h3>
                    <p className="text-xl font-medium text-white leading-relaxed">
                      {analysis.concluzie}
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="space-y-4">
                    {filters.map((filter, index) => {
                      const Icon = filter.icon;
                      const content = analysis[filter.id as keyof AnalysisResult] as string;
                      
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={filter.id}
                          className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-start gap-5">
                            <div className={`w-12 h-12 shrink-0 rounded-full ${filter.bg} ${filter.border} border flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${filter.color}`} />
                            </div>
                            <div>
                              <div className="flex items-baseline gap-2 mb-2">
                                <span className={`font-mono font-bold text-lg ${filter.color}`}>{filter.id}</span>
                                <h4 className="text-zinc-300 font-medium">{filter.title}</h4>
                              </div>
                              <p className="text-zinc-400 leading-relaxed text-sm">
                                {content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
