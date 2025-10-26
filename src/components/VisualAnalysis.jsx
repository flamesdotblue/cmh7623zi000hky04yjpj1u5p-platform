import React, { useEffect, useRef, useState } from 'react';

export default function VisualAnalysis() {
  const [tab, setTab] = useState('image');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 md:px-8 py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-xl font-semibold">Visual Analysis</h3>
        <span className="text-xs uppercase tracking-widest text-zinc-400">Facial emotions from image & video</span>
      </div>

      <div className="mt-4">
        <div className="inline-flex rounded-lg overflow-hidden border border-white/10">
          <button onClick={() => setTab('image')} className={`px-4 py-2 text-sm ${tab === 'image' ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}>Image</button>
          <button onClick={() => setTab('video')} className={`px-4 py-2 text-sm ${tab === 'video' ? 'bg-white text黑': 'bg-transparent text-white hover:bg-white/10'}`.replace('黑','black')}>Video</button>
        </div>
      </div>

      <div className="mt-6">
        {tab === 'image' ? <ImagePanel /> : <VideoPanel />}
      </div>
    </div>
  );
}

function ImagePanel() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('Upload a face image to analyze emotions.');

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStatus('Processing locally...');

    const run = async () => {
      const hasFaceDetector = 'FaceDetector' in window;
      if (hasFaceDetector) {
        try {
          const img = document.getElementById('img-preview');
          const detector = new window.FaceDetector({ fastMode: true });
          const faces = await detector.detect(img);
          if (faces.length > 0) {
            setStatus('Face detected. Emotion estimation placeholder: neutral.');
          } else {
            setStatus('No face detected. Try another image.');
          }
        } catch (e) {
          setStatus('Face detection failed in this browser. Showing preview only.');
        }
      } else {
        setStatus('FaceDetector API not available. Showing preview only.');
      }
    };

    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm text-zinc-300">Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-zinc-200" />
        <p className="mt-2 text-xs text-zinc-400">Images are processed locally in your browser.</p>
      </div>

      <div>
        <div className="aspect-video w-full rounded-xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img id="img-preview" src={preview} alt="preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-zinc-400 text-sm">Preview will appear here</span>
          )}
        </div>
        <p className="mt-3 text-sm text-zinc-300">{status}</p>
      </div>
    </div>
  );
}

function VideoPanel() {
  const videoRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Allow camera access to start real-time analysis.');

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setRunning(true);
        setStatus('Camera active. Placeholder emotion: neutral.');
      }
    } catch (e) {
      setStatus('Camera permission denied or unavailable.');
    }
  };

  const stop = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setRunning(false);
    setStatus('Camera stopped.');
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-sm text-zinc-300">Webcam</p>
        <div className="aspect-video w-full rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        </div>
        <div className="flex items-center gap-3">
          {!running ? (
            <button onClick={start} className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition">Start Camera</button>
          ) : (
            <button onClick={stop} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-400 transition">Stop Camera</button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-zinc-300">Real-time Emotion</p>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold capitalize">neutral</span>
            <span className="text-zinc-400 text-sm">prototype</span>
          </div>
          <p className="mt-3 text-sm text-zinc-300">{status}</p>
          <p className="mt-2 text-xs text-zinc-400">For production-grade models, integrate a face-expression model (e.g., TF.js or MediaPipe) and fuse with audio/text cues.</p>
        </div>
      </div>
    </div>
  );
}
