import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Anchor } from 'lucide-react';
import { Character } from './Character';
import { HouseScene } from './housescene';

import SwedenMap from './character/Sweden.svg';
import GotlandMap from './character/Gotland.svg';
import SaaremaaMap from './character/Saaremaa.svg';

type IslandStage = 'rootsi' | 'gotland' | 'saaremaa';
type Direction = 'front' | 'back' | 'left' | 'right';

type Zone = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

interface StoryMapScreenProps {
  onBackToMenu: () => void;
}

const WALKABLE_ZONES: Record<IslandStage, Zone[]> = {
  rootsi: [
    { minX: 15, maxX: 78, minY: 27, maxY: 98 },
    { minX: 15, maxX: 18, minY: 12, maxY: 29 },
    { minX: 24, maxX: 88, minY: 12, maxY: 29 },
    { minX: 78, maxX: 88, minY: 8, maxY: 45 },
    { minX: 85, maxX: 95, minY: 28, maxY: 45 },
  ],
  gotland: [
    { minX: 31, maxX: 75, minY: 20, maxY: 39 },
    { minX: 75, maxX: 84, minY: 30, maxY: 39 },
    { minX: 39, maxX: 90, minY: 11, maxY: 20 },
    { minX: 22, maxX: 63, minY: 33, maxY: 63 },
    { minX: 17, maxX: 63, minY: 43, maxY: 63 },
    { minX: 63, maxX: 82, minY: 53, maxY: 64 },
    { minX: 25, maxX: 70, minY: 63, maxY: 83 },
    { minX: 45, maxX: 58, minY: 83, maxY: 93 },
    { minX: 40, maxX: 58, minY: 93, maxY: 97 },
  ],
  saaremaa: [
    { minX: 14, maxX: 84, minY: 34, maxY: 52 },
    { minX: 11, maxX: 14, minY: 39, maxY: 48 },
    { minX: 16, maxX: 78, minY: 52, maxY: 57 },
    { minX: 19, maxX: 94, minY: 30, maxY: 34 },
    { minX: 30, maxX: 99, minY: 24, maxY: 30 },
    { minX: 30, maxX: 41, minY: 17, maxY: 24 },
    { minX: 33, maxX: 41, minY: 12, maxY: 17 },
    { minX: 16, maxX: 24, minY: 13, maxY: 21 },
    { minX: 19, maxX: 24, minY: 21, maxY: 30 },
    { minX: 22, maxX: 39, minY: 57, maxY: 63 },
    { minX: 27, maxX: 37, minY: 63, maxY: 67 },
    { minX: 27, maxX: 31, minY: 67, maxY: 86 },
    { minX: 22, maxX: 29, minY: 83, maxY: 98 },
    { minX: 64, maxX: 73, minY: 57, maxY: 59 },
    { minX: 68, maxX: 73, minY: 59, maxY: 64 },
    { minX: 84, maxX: 87, minY: 33, maxY: 45 },
    { minX: 87, maxX: 92, minY: 33, maxY: 41 },
    { minX: 47, maxX: 91, minY: 11, maxY: 16 },
    { minX: 47, maxX: 94, minY: 16, maxY: 25 },
    { minX: 60, maxX: 64, minY: 3, maxY: 11 },
    { minX: 76, maxX: 86, minY: 5, maxY: 11 },
  ],
};

export function StoryMapScreen({ onBackToMenu }: StoryMapScreenProps) {
  const [hasSeenHouseScene, setHasSeenHouseScene] = useState(false);
  const [currentIsland, setCurrentIsland] = useState<IslandStage>('rootsi');
  const [bjornPos, setBjornPos] = useState({ x: 74, y: 70 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<Direction>('front');

  const viewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const speed = 0.02;

  const isInsideZone = (x: number, y: number, zone: Zone) => {
    return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
  };

  const isPositionAllowed = (x: number, y: number, island: IslandStage): boolean => {
    return WALKABLE_ZONES[island].some((zone) => isInsideZone(x, y, zone));
  };

  const centerCameraOnPosition = (x: number, y: number, smooth = true) => {
    if (!viewportRef.current || !mapRef.current) return;

    const viewport = viewportRef.current;
    const map = mapRef.current;

    const mapWidth = map.scrollWidth;
    const mapHeight = map.scrollHeight;

    const targetPixelX = (x / 100) * mapWidth;
    const targetPixelY = (y / 100) * mapHeight;

    const targetScrollLeft = targetPixelX - viewport.clientWidth / 2;
    const targetScrollTop = targetPixelY - viewport.clientHeight / 2;

    const maxScrollLeft = mapWidth - viewport.clientWidth;
    const maxScrollTop = mapHeight - viewport.clientHeight;

    const clampedLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
    const clampedTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

    if (smooth) {
      viewport.scrollLeft += (clampedLeft - viewport.scrollLeft) * 0.08;
      viewport.scrollTop += (clampedTop - viewport.scrollTop) * 0.08;
    } else {
      viewport.scrollLeft = clampedLeft;
      viewport.scrollTop = clampedTop;
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

    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 'right' : 'left');
    } else {
      setDirection(dy > 0 ? 'front' : 'back');
    }

    setTargetPos({ x: clickX, y: clickY });
    setIsMoving(true);
  };

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      setBjornPos((prev) => {
        if (!targetPos) {
          setIsMoving(false);
          centerCameraOnPosition(prev.x, prev.y, true);
          return prev;
        }

        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.35) {
          setTargetPos(null);
          setIsMoving(false);
          centerCameraOnPosition(targetPos.x, targetPos.y, true);
          return targetPos;
        }

        const moveX = (dx / distance) * speed * delta;
        const moveY = (dy / distance) * speed * delta;

        const nextX = prev.x + moveX;
        const nextY = prev.y + moveY;

        if (Math.abs(dx) > Math.abs(dy)) {
          setDirection(dx > 0 ? 'right' : 'left');
        } else {
          setDirection(dy > 0 ? 'front' : 'back');
        }

        let updatedX = prev.x;
        let updatedY = prev.y;

        if (isPositionAllowed(nextX, prev.y, currentIsland)) {
          updatedX = nextX;
        }

        if (isPositionAllowed(updatedX, nextY, currentIsland)) {
          updatedY = nextY;
        }

        centerCameraOnPosition(updatedX, updatedY, true);

        return { x: updatedX, y: updatedY };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetPos, currentIsland]);

  const handleNextIsland = () => {
    let nextIsland: IslandStage = currentIsland;
    let startPos = { x: 74, y: 70 };

    if (currentIsland === 'rootsi') {
      nextIsland = 'gotland';
      startPos = { x: 54, y: 50 };
    } else if (currentIsland === 'gotland') {
      nextIsland = 'saaremaa';
      startPos = { x: 54, y: 50 };
    }

    setCurrentIsland(nextIsland);
    setBjornPos(startPos);
    setTargetPos(null);
    setIsMoving(false);
    setDirection('front');
    lastTimeRef.current = 0;

    setTimeout(() => {
      centerCameraOnPosition(startPos.x, startPos.y, false);
    }, 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      centerCameraOnPosition(bjornPos.x, bjornPos.y, false);
    }, 100);

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
            <img
              src={SwedenMap}
              alt="Rootsi"
              className="w-full h-full object-cover animate-fadeIn pointer-events-none"
            />
          )}
          {currentIsland === 'gotland' && (
            <img
              src={GotlandMap}
              alt="Gotland"
              className="w-full h-full object-cover animate-fadeIn pointer-events-none"
            />
          )}
          {currentIsland === 'saaremaa' && (
            <img
              src={SaaremaaMap}
              alt="Saaremaa"
              className="w-full h-full object-cover animate-fadeIn pointer-events-none"
            />
          )}

          <Character
            x={bjornPos.x}
            y={bjornPos.y}
            isMoving={isMoving}
            duration={0}
            direction={direction}
            name="Björn"
          />
        </div>
      </div>
    </div>
  );
}