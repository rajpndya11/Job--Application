import { useState, useCallback } from 'react';
import { type ProjectInput, type GenerationResult } from './types/creative';
import { generateCreatives } from './utils/generateCreatives';
import InputForm from './components/InputForm';
import CreativeOutput from './components/CreativeOutput';
import LoadingScreen from './components/LoadingScreen';

type AppState = 'input' | 'generating' | 'output';

export default function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleGenerate = useCallback(async (input: ProjectInput) => {
    setAppState('generating');
    setLoadingProgress(0);
    setLoadingMessage('Initialising AI agent…');

    try {
      const generated = await generateCreatives(input, (msg, progress) => {
        setLoadingMessage(msg);
        setLoadingProgress(progress);
      });
      setLoadingProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setResult(generated);
      setAppState('output');
    } catch (err) {
      console.error('Generation failed:', err);
      setAppState('input');
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setAppState('input');
    setLoadingProgress(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090f] bg-grid">
      {/* Loading Overlay */}
      {appState === 'generating' && (
        <LoadingScreen message={loadingMessage} progress={loadingProgress} />
      )}

      {/* Top Nav */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <span className="text-lg">⚡</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">AI Creative Agent</div>
              <div className="text-xs text-slate-500">Performance Ad Generation</div>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {appState === 'output' && result && (
              <span className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {result.summary.totalCreatives} creatives ready
              </span>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs text-violet-300 font-medium">Agent Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (input only) */}
      {appState === 'input' && (
        <div className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 left-1/2 w-48 h-48 bg-sky-600/5 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-8 animate-pulse-slow">
              <span>🤖</span>
              <span>Psychology-Driven · Platform-Optimised · A/B Ready</span>
              <span>🚀</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              AI Performance{' '}
              <span className="text-gradient">Creative</span>
              <br />
              Generation Agent
            </h1>

            {/* Sub */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate scroll-stopping ad creatives with psychology-driven copy, AI image prompts,
              platform-specific layouts, and A/B test variants — in seconds.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {[
                { icon: '🎣', text: 'Hook Variations' },
                { icon: '✏️', text: '10 Headline Formulas' },
                { icon: '📝', text: 'Psychology Copy' },
                { icon: '🤖', text: 'AI Image Prompts' },
                { icon: '🧪', text: 'A/B Test Matrix' },
                { icon: '📐', text: 'Layout Guides' },
                { icon: '🎨', text: 'Visual Direction' },
                { icon: '📊', text: 'Performance Scoring' },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/40 text-slate-400 text-xs"
                >
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Platform logos */}
            <div className="flex items-center justify-center gap-6 opacity-40">
              {['📘 Meta', '📸 Instagram', '🔍 Google', '▶️ YouTube'].map((p) => (
                <span key={p} className="text-xs text-slate-500 font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {appState === 'input' && (
          <div className="max-w-3xl mx-auto">
            <InputForm onGenerate={handleGenerate} isGenerating={false} />
          </div>
        )}

        {appState === 'output' && result && (
          <div className="fade-in-up">
            {/* Back button */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span>New Generation</span>
              </button>
              <div className="h-px flex-1 bg-slate-800/50" />
              <span className="text-xs text-slate-600">{result.projectName}</span>
            </div>
            <CreativeOutput result={result} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm">
                ⚡
              </div>
              <span className="text-xs text-slate-600">AI Performance Creative Generation Agent</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-700">
              <span>9 Platforms</span>
              <span>12 Dimensions</span>
              <span>9 Objectives</span>
              <span>8 Brand Styles</span>
              <span>A/B Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
