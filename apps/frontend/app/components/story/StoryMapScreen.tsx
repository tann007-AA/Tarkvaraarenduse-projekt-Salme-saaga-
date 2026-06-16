import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Anchor } from 'lucide-react';
import { Character } from './Character';
import { HouseScene } from './housescene';

import SwedenMap from './character/Sweden.svg';
import GotlandMap from './character/Gotland.svg';
import SaaremaaMap from './character/Saaremaa.svg';

type IslandStage = 'rootsi' | 'gotland' | 'saaremaa';

interface StoryMapScreenProps {
  onBackToMenu: () => void;
}

export function StoryMapScreen({ onBackToMenu }: StoryMapScreenProps) {
  console.log('StoryMapScreen renderdab');

  const [hasSeenHouseScene, setHasSeenHouseScene] = useState(false);
  const [currentIsland, setCurrentIsland] = useState<IslandStage>('rootsi');
  const [bjornPos, setBjornPos] = useState({ x: 20, y: 30 });
  const [isMoving, setIsMoving] = useState(false);
  const [moveDuration, setMoveDuration] = useState(2000);

  const viewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const isPositionAllowed = (x: number, y: number, island: IslandStage): boolean => {
    if (x < 5 || x > 95 || y < 5 || y > 95) return false;

    if (island === 'rootsi') {
      if (x < 15 && y < 25) return false;
      if (x > 85 && y < 20) return false;
    }

    return true;
  };

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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (!isPositionAllowed(clickX, clickY, currentIsland)) return;

    const dx = clickX - bjornPos.x;
    const dy = clickY - bjornPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speedFactor = 80;
    const calculatedDuration = Math.max(400, distance * speedFactor);

    setMoveDuration(calculatedDuration);
    setIsMoving(true);
    setBjornPos({ x: clickX, y: clickY });
  };

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

  useEffect(() => {
    if (isMoving) {
      const timer = setTimeout(() => {
        setIsMoving(false);
      }, moveDuration);

      return () => clearTimeout(timer);
    }
  }, [bjornPos, moveDuration, isMoving]);

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
  };

  useEffect(() => {
    const timer = setTimeout(() => centerCameraOnBjorn(false), 100);
    return () => clearTimeout(timer);
  }, [currentIsland]);

  if (!hasSeenHouseScene) {
    return (
      <HouseScene
        onBackToMenu={onBackToMenu}
        onExitHouse={() => {
          setHasSeenHouseScene(true);
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#05090f] text-white flex flex-col overflow-hidden select-none">
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

      <div ref={viewportRef} className="w-full h-full overflow-hidden relative z-10">
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="w-[200vw] h-[200vh] relative bg-[#111e2e] cursor-crosshair"
        >
          {currentIsland === 'rootsi' && (
            <img src={SwedenMap} alt="Rootsi" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}
          {currentIsland === 'gotland' && (
            <img src={GotlandMap} alt="Gotland" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}
          {currentIsland === 'saaremaa' && (
            <img src={SaaremaaMap} alt="Saaremaa" className="w-full h-full object-cover animate-fadeIn pointer-events-none" />
          )}

          <Character
            x={bjornPos.x}
            y={bjornPos.y}
            isMoving={isMoving}
            duration={moveDuration}
            name="Björn"
          />
        </div>
      </div>
    </div>
  );
}