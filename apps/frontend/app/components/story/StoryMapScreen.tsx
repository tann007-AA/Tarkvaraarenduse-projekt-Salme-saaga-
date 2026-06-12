import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Anchor } from 'lucide-react';
import { Character } from './Character'; // Impordime eraldatud komponendi

type IslandStage = 'rootsi' | 'gotland' | 'saaremaa';

interface StoryMapScreenProps {
  onBackToMenu: () => void;
}

export function StoryMapScreen({ onBackToMenu }: StoryMapScreenProps) {
  const [currentIsland, setCurrentIsland] = useState<IslandStage>('rootsi');
  const [bjornPos, setBjornPos] = useState({ x: 20, y: 30 });
  const [isMoving, setIsMoving] = useState(false);
  const [moveDuration, setMoveDuration] = useState(2000); // Dünaamiline aeg millisekundites

  const viewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // FUNKTSIOON: Arvutab ja kerib kaamera täpselt tegelase reaalajas asukoha peale
  const centerCameraOnBjorn = (smooth = true) => {
    if (!viewportRef.current || !mapRef.current) return;

    const viewport = viewportRef.current;
    const map = mapRef.current;

    const bjornElement = map.querySelector('.bjorn-character');
    if (!bjornElement) return;

    const bjornRect = bjornElement.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();

    const currentX = bjornRect.left - mapRect.left + bjornRect.width / 2;
    const currentY = bjornRect.top - mapRect.top + bjornRect.height / 2;

    const targetScrollLeft = currentX - viewport.clientWidth / 2;
    const targetScrollTop = currentY - viewport.clientHeight / 2;

    if (smooth) {
      viewport.scrollLeft += (targetScrollLeft - viewport.scrollLeft) * 0.08;
      viewport.scrollTop += (targetScrollTop - viewport.scrollTop) * 0.08;
    } else {
      viewport.scrollLeft = targetScrollLeft;
      viewport.scrollTop = targetScrollTop;
    }
  };

  // KLIRENDUS: Punktuaalne liikumine distantsi põhjal
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Arvutame vahemaa Pythagorase teoreemiga protsentides
    const dx = clickX - bjornPos.x;
    const dy = clickY - bjornPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Kiiruse koefitsient (80ms iga protsendi kohta kaardil)
    const speedFactor = 80; 
    const calculatedDuration = Math.max(400, distance * speedFactor);

    setMoveDuration(calculatedDuration);
    setIsMoving(true);
    setBjornPos({ x: clickX, y: clickY });
  };

  // Kaamera reaalajas uuendamise tsükkel requestAnimationFrame'iga
  useEffect(() => {
    const tick = () => {
      centerCameraOnBjorn(true);
      animationRef.current = requestAnimationFrame(tick);
    };

    if (isMoving) {
      animationRef.current = requestAnimationFrame(tick);
    } else {
      centerCameraOnBjorn(true);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMoving, bjornPos]);

  // Taimer mis lõpetab liikumise oleku vastavalt dünaamilisele ajale
  useEffect(() => {
    if (isMoving) {
      const timer = setTimeout(() => {
        setIsMoving(false);
      }, moveDuration);
      return () => clearTimeout(timer);
    }
  }, [bjornPos, moveDuration]);

  // Kui vahetatakse saart
  const handleNextIsland = () => {
    let startPos = { x: 20, y: 30 };
    if (currentIsland === 'rootsi') {
      setCurrentIsland('gotland');
      startPos = { x: 45, y: 40 };
    } else if (currentIsland === 'gotland') {
      setCurrentIsland('saaremaa');
      startPos = { x: 30, y: 60 };
    }
    
    setBjornPos(startPos);
    setIsMoving(false);
    
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setTimeout(() => centerCameraOnBjorn(false), 50);
  };

  // Esmane paigutus mängu või uuele saarele sisenemisel
  useEffect(() => {
    setTimeout(() => centerCameraOnBjorn(false), 100);
  }, [currentIsland]);

  return (
    <div className="relative w-full h-screen bg-[#05090f] text-white flex flex-col overflow-hidden select-none">
      
      {/* Ülemine juhtpaneel */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/95 via-black/40 to-transparent flex justify-between items-center z-20 backdrop-blur-xs pointer-events-none">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900/95 border border-stone-700/50 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer text-sm font-medium shadow-lg pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Tagasi peamenüüsse
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#dfc18d] tracking-wider uppercase drop-shadow-md">
            {currentIsland === 'rootsi' && 'I peatükk: Sveamaa rannikud'}
            {currentIsland === 'gotland' && 'II peatükk: Visby ümbrus'}
            {currentIsland === 'saaremaa' && 'III peatükk: Salme muinasväli'}
          </h2>
          <p className="text-xs text-amber-500/80 font-mono tracking-widest mt-0.5 uppercase drop-shadow-xs">
            Björni rännakud (Point & Click)
          </p>
        </div>

        <button
          onClick={handleNextIsland}
          disabled={currentIsland === 'saaremaa'}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 disabled:opacity-30 disabled:pointer-events-none text-white font-serif rounded-lg transition-all cursor-pointer text-sm font-medium shadow-2xl border border-amber-600/30 pointer-events-auto"
        >
          Järgmine ala <Anchor className="w-4 h-4" />
        </button>
      </div>

      {/* VIEWPORT (KAAMERA AKEN) */}
      <div ref={viewportRef} className="w-full h-full overflow-hidden relative z-10">
        {/* SUUR MAAILMA KAART */}
        <div 
          ref={mapRef}
          onClick={handleMapClick}
          className="w-[200vw] h-[200vh] relative bg-[#111e2e] cursor-crosshair"
        >
          {/* SVG Kaardid */}
          {currentIsland === 'rootsi' && (
            <img src="/game/Sweden.svg" alt="Rootsi" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}
          {currentIsland === 'gotland' && (
            <img src="/game/Gotland.svg" alt="Gotland" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}
          {currentIsland === 'saaremaa' && (
            <img src="/game/Saaremaa.svg" alt="Saaremaa" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}

          {/* TEGELASKUJU PUHAS VÄLJAKUTSE */}
          <Character 
            x={bjornPos.x} 
            y={bjornPos.y} 
            isMoving={isMoving} 
            duration={moveDuration} 
            name="Björn" 
          />

        </div>
      </div>

      {/* Koordinaatide tabel info jaoks */}
      <div className="absolute bottom-4 left-4 bg-black/80 border border-stone-800 p-2 rounded-lg backdrop-blur-md z-20 pointer-events-none">
        <p className="text-[10px] text-stone-400 font-mono">
          📍 Koordinaadid: X: {Math.round(bjornPos.x)}% | Y: {Math.round(bjornPos.y)}%
        </p>
      </div>

    </div>
  );
}