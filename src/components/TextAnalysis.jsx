import React, { useMemo, useState } from 'react';

function analyzeEmotionFromText(text) {
  const t = text.toLowerCase();
  const scores = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0,
  };

  const lex = {
    joy: ['happy', 'great', 'love', 'excited', 'joy', 'wonderful', 'awesome', 'delighted', 'thrilled'],
    sadness: ['sad', 'down', 'unhappy', 'depressed', 'lonely', 'heartbroken', 'gloomy'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'rage', 'irritated'],
    fear: ['scared', 'afraid', 'nervous', 'anxious', 'worried', 'terrified'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'wow'],
  };

  Object.entries(lex).forEach(([emotion, words]) => {
    words.forEach((w) => {
      const count = t.split(w).length - 1;
      scores[emotion] += count;
    });
  });

  if (t.trim().length > 0 && Object.values(scores).every((v) => v === 0)) {
    scores.neutral = 1;
  }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const label = top ? top[0] : 'neutral';
  const confidence = top ? Math.min(1, top[1] / Math.max(1, t.split(' ').length / 8)) : 0.5;

  return { label, confidence: Number(confidence.toFixed(2)), scores };
}

export default function TextAnalysis() {
  const [text, setText] = useState('I am excited about this new project!');
  const result = useMemo(() => analyzeEmotionFromText(text), [text]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 md:px-8 py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-xl font-semibold">Text Analysis</h3>
        <span className="text-xs uppercase tracking-widest text-zinc-400">Emotion from written content</span>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-zinc-300">Enter text</label>
          <textarea
            className="mt-2 w-full h-36 rounded-xl bg-black/50 border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-white/20"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="mt-2 text-xs text-zinc-400">This demo uses a simple keyword-based heuristic for on-device analysis.</p>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-zinc-300">Detected Emotion</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold capitalize">{result.label}</span>
              <span className="text-zinc-400 text-sm">confidence {Math.round(result.confidence * 100)}%</span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(result.scores).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-white/10 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="capitalize text-sm">{k}</span>
                    <span className="text-xs text-zinc-400">{v}</span>
                  </div>
                  <div className="h-1 mt-2 bg-white/10 rounded">
                    <div className="h-1 bg-white/70 rounded" style={{ width: `${Math.min(100, v * 25)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
