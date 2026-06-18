import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import audioFile from "../components/story/audio/5. Odin's Whisper.mp3";

const GameAudioContext = createContext<{
  volume: number;
  setVolume: (v: number) => void;
  isPlaying: boolean;
  resumeAudio: () => void;
} | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef(new Audio(audioFile));
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    // Mobile browsers (esp. iOS Safari) ignore programmatic `volume` changes,
    // but they DO honour `muted`. Toggle it so volume 0 mutes on phones too.
    audio.muted = volume === 0;
    audio.loop = true;
  }, [volume]);

  const resumeAudio = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Autoplay still blocked"));
    }
  };

  return (
    <GameAudioContext.Provider value={{ volume, setVolume, isPlaying, resumeAudio }}>
      {children}
    </GameAudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(GameAudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}