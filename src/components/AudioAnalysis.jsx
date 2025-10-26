import React, { useEffect, useMemo, useRef, useState } from 'react';

function analyzeEmotionFromText(text) {
  const t = text.toLowerCase();
  const scores = { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, neutral: 0 };
  const lex = {
    joy: ['happy', 'great', 'love', 'excited', 'joy', 'awesome'],
    sadness: ['sad', 'down', 'unhappy', 'depressed', 'lonely'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'rage'],
    fear: ['scared', 'afraid', 'nervous', 'anxious', 'worried'],
    surprise: ['surprised', 'shocked', 'amazed', 'wow'],
  };
  Object.entries(lex).forEach(([emotion, words]) => {
    words.forEach((w) => {
      const count = t.split(w).length - 1;
      scores[emotion] += count;
    });
  });
  if (t.trim().length > 0 && Object.values(scores).every((v) => v === 0)) scores.neutral = 1;
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const label = top ? top[0] : 'neutral';
  const confidence = top ? Math.min(1, top[1] / Math.max(1, t.split(' ').length / 8)) : 0.5;
  return { label, confidence: Number(confidence.toFixed(2)), scores };
}

export default function AudioAnalysis() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [permissionError, setPermissionError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const result = useMemo(() => analyzeEmotionFromText(transcript), [transcript]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        let finalTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalTranscript += t + ' ';
        }
        if (finalTranscript) setTranscript((prev) => (prev + ' ' + finalTranscript).trim());
      };
      recognitionRef.current = rec;
    }
  }, []);

  const startRecording = async () => {
    setPermissionError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);

      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch {}
      }
    } catch (err) {
      setPermissionError('Microphone permission denied or unavailable.');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setRecording(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 md:px-8 py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-xl font-semibold">Audio Analysis</h3>
        <span className="text-xs uppercase tracking-widest text-zinc-400">Record, transcribe, and analyze</span>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-3">
            {!recording ? (
              <button onClick={startRecording} className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition">
                Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-400 transition">
                Stop Recording
              </button>
            )}
            {permissionError && <span className="text-sm text-red-400">{permissionError}</span>}
          </div>

          {audioUrl && (
            <div className="mt-4">
              <audio controls src={audioUrl} className="w-full" />
              <p className="text-xs text-zinc-400 mt-2">Audio captured locally. Transcription uses the browser's Speech Recognition API when available.</p>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm text-zinc-300">Transcript</label>
            <textarea
              className="mt-2 w-full h-32 rounded-xl bg-black/50 border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-white/20"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={"Speak something or type here if speech recognition isn't available"}
            />
          </div>
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
