import React from 'react';
import Hero from './components/Hero';
import TextAnalysis from './components/TextAnalysis';
import AudioAnalysis from './components/AudioAnalysis';
import VisualAnalysis from './components/VisualAnalysis';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />

      <main className="relative z-10">
        <section id="modules" className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-16">
          <header className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Multimodal Emotion Recognition</h2>
            <p className="text-zinc-300">Analyze emotions across text, audio, image, and video inputs for richer, more context-aware insights.</p>
          </header>

          <TextAnalysis />
          <AudioAnalysis />
          <VisualAnalysis />
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-sm text-zinc-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Multimodal Emotion AI</span>
          <span>Built with React, Vite, Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
