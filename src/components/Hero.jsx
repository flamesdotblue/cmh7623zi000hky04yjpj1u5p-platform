import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  const handleScroll = () => {
    const el = document.getElementById('modules');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(152,97,255,0.25)_0%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,1)_100%)]" />

      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Multimodal Emotion Recognition
          </h1>
          <p className="mt-4 text-zinc-300 md:text-lg">
            Detect and classify human emotions across text, audio, image, and video to build empathetic, context-aware AI experiences.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={handleScroll} className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50">
              Explore Modules
            </button>
            <a href="#modules" className="px-6 py-3 rounded-xl border border-white/30 hover:border-white/60 transition">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
