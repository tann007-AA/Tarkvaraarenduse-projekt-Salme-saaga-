import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio("../components/story/audio/5. Odin's Whisper.mp3"));
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => console.log("Autoplay blocked"));
  }, [volume]);

  return (
    <AudioContext.Provider value={{ volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
}