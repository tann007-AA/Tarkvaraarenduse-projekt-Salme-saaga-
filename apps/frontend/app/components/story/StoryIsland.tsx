import React from 'react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import './level.css';

import SwedenMap from './character/Sweden.svg';
import GotlandMap from './character/Gotland.svg';
import SaaremaaMap from './character/Saaremaa.svg';

import Front01 from './character/Front_01.png';
import Front02 from './character/Front_02.png';
import Front03 from './character/Front_03.png';

import Back01 from './character/Back_01.png';
import Back02 from './character/Back_02.png';
import Back03 from './character/Back_03.png';

import Left01 from './character/Left_01.png';
import Left02 from './character/Left_02.png';
import Left03 from './character/Left_03.png';

import Right01 from './character/Right_01.png';
import Right02 from './character/Right_02.png';
import Right03 from './character/Right_03.png';

import { CookingGame } from './cooking/CookingGame';

type Direction = 'front' | 'back' | 'left' | 'right';
type StoryIsland = 'rootsi' | 'gotland' | 'saaremaa';

type Zone = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type Marker = {
  left: string;
  top: string;
};

const HOUSE_POSITIONS: Record<StoryIsland, { left: string; top: string }> = {
  rootsi: { left: '16%', top: '12%' },
  gotland: { left: '20%', top: '55%' },
  saaremaa: { left: '22%', top: '20%' },
};

interface StoryIslandProps {
  currentIsland: StoryIsland;
  onBackToMenu: () => void;
  onGoToIsland?: (island: StoryIsland) => void;
  points: number;
  onOpenSettings?: () => void;
  onOpenShop?: () => void;
}

const storyIslandData: Record<
  StoryIsland,
  {
    title: string;
    mapImage: string;
    mapAlt: string;
    mapClassName: string;
    mapWrapClassName: string;
    nextIsland?: StoryIsland;
    markers: Marker[];
    startX: number;
    startY: number;
    walkableZones: Zone[];
  }
> = {
  rootsi: {
    title: 'Rootsi',
    mapImage: SwedenMap,
    mapAlt: 'Rootsi saar',
    mapClassName: 'rootsi',
    mapWrapClassName: 'map-wrap-rootsi scene-map',
    nextIsland: 'gotland',
    startX: 74,
    startY: 70,
    markers: [
      { left: '86%', top: '14%' },
      { left: '45%', top: '14%' },
      { left: '16%', top: '12%' },
      { left: '68%', top: '83%' },
      { left: '17%', top: '66%' },
      { left: '26%', top: '82%' },
      { left: '54%', top: '57%' },
      { left: '90%', top: '40%' },
    ],
    walkableZones: [
      { minX: 15, maxX: 78, minY: 27, maxY: 98 },
      { minX: 15, maxX: 18, minY: 12, maxY: 29 },
      { minX: 24, maxX: 88, minY: 12, maxY: 29 },
      { minX: 78, maxX: 88, minY: 8, maxY: 45 },
      { minX: 85, maxX: 95, minY: 28, maxY: 45 },
    ],
  },

  gotland: {
    title: 'Gotland',
    mapImage: GotlandMap,
    mapAlt: 'Gotland',
    mapClassName: 'gotland',
    mapWrapClassName: 'map-wrap-gotland scene-map',
    nextIsland: 'saaremaa',
    startX: 54,
    startY: 50,
    markers: [
      { left: '86%', top: '14%' },
      { left: '45%', top: '14%' },
      { left: '55%', top: '94%' },
      { left: '20%', top: '55%' },
      { left: '79%', top: '58%' },
      { left: '30%', top: '80%' },
      { left: '54%', top: '57%' },
      { left: '80%', top: '35%' },
    ],
    walkableZones: [
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
  },

  saaremaa: {
    title: 'Saaremaa',
    mapImage: SaaremaaMap,
    mapAlt: 'Saaremaa saar',
    mapClassName: 'saaremaa',
    mapWrapClassName: 'map-wrap-gotland scene-map',
    startX: 54,
    startY: 50,
    markers: [
      { left: '86%', top: '14%' },
      { left: '52%', top: '16%' },
      { left: '25%', top: '94%' },
      { left: '18%', top: '53%' },
      { left: '71%', top: '58%' },
      { left: '22%', top: '20%' },
      { left: '62%', top: '9%' },
      { left: '33%', top: '60%' },
    ],
    walkableZones: [
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
  },
};

export function StoryIsland({
  currentIsland,
  onBackToMenu,
  onGoToIsland,
  points = 0,
  onOpenSettings,
  onOpenShop,
}: StoryIslandProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const lastFrameChangeRef = useRef(0);

  const clickTargetRef = useRef<{ x: number; y: number } | null>(null);
  const clickMovingRef = useRef(false);

  const island = storyIslandData[currentIsland];

  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
  const [checkpointCount, setCheckpointCount] = useState(0);

  const [isCookingOpen, setIsCookingOpen] = useState(false);
  const [cookingCompleted, setCookingCompleted] = useState(false);
  const [showHousePrompt, setShowHousePrompt] = useState(false);

  const xRef = useRef(island.startX);
  const yRef = useRef(island.startY);
  const currentDirectionRef = useRef<Direction>('front');
  const currentFrameRef = useRef(0);
  const isMovingRef = useRef(false);

  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const speed = 0.015;
  const frameDuration = 140;

  const sprites = useMemo(
    () => ({
      front: [Front01, Front02, Front03],
      back: [Back01, Back02, Back03],
      left: [Left01, Left02, Left03],
      right: [Right01, Right02, Right03],
    }),
    []
  );

  useEffect(() => {
    xRef.current = island.startX;
    yRef.current = island.startY;
    setCurrentMarkerIndex(0);
    setCheckpointCount(0);
    currentDirectionRef.current = 'front';
    currentFrameRef.current = 0;
    lastTimeRef.current = 0;
    lastFrameChangeRef.current = 0;
    clickTargetRef.current = null;
    clickMovingRef.current = false;
    setCookingCompleted(false);
    setShowHousePrompt(false);

    keysRef.current = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    if (characterRef.current) {
      characterRef.current.style.left = `${xRef.current}%`;
      characterRef.current.style.top = `${yRef.current}%`;
      characterRef.current.src = sprites.front[0];
    }
  }, [currentIsland, island.startX, island.startY, sprites]);

  const isWalkable = (testX: number, testY: number) => {
    return island.walkableZones.some((zone) => {
      return (
        testX >= zone.minX &&
        testX <= zone.maxX &&
        testY >= zone.minY &&
        testY <= zone.maxY
      );
    });
  };

  const renderCharacter = () => {
    const character = characterRef.current;
    if (!character) return;

    character.style.left = `${xRef.current}%`;
    character.style.top = `${yRef.current}%`;
    character.src = sprites[currentDirectionRef.current][currentFrameRef.current];
  };

  const handleHouseClick = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (!cookingCompleted) {
      setIsCookingOpen(true);
    }
  };

  const handleCookingComplete = () => {
    setCookingCompleted(true);
    setIsCookingOpen(false);
    setCheckpointCount((prev: number) => prev + 1);
  };

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    const map = mapRef.current;
    if (!map) return;

    const rect = map.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;

    if (!isWalkable(clickX, clickY)) return;

    clickTargetRef.current = { x: clickX, y: clickY };
    clickMovingRef.current = true;
  };

  useEffect(() => {
    renderCharacter();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') {
        keysRef.current.up = true;
        event.preventDefault();
      }
      if (key === 'arrowdown' || key === 's') {
        keysRef.current.down = true;
        event.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') {
        keysRef.current.left = true;
        event.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        keysRef.current.right = true;
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') keysRef.current.up = false;
      if (key === 'arrowdown' || key === 's') keysRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = false;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = false;
    };

    const gameLoop = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      let nextX = xRef.current;
      let nextY = yRef.current;
      isMovingRef.current = false;

      if (keysRef.current.up) {
        nextY -= speed * delta;
        currentDirectionRef.current = 'back';
        isMovingRef.current = true;
      }

      if (keysRef.current.down) {
        nextY += speed * delta;
        currentDirectionRef.current = 'front';
        isMovingRef.current = true;
      }

      if (keysRef.current.left) {
        nextX -= speed * delta;
        currentDirectionRef.current = 'left';
        isMovingRef.current = true;
      }

      if (keysRef.current.right) {
        nextX += speed * delta;
        currentDirectionRef.current = 'right';
        isMovingRef.current = true;
      }

      const keyboardMoving =
        keysRef.current.up ||
        keysRef.current.down ||
        keysRef.current.left ||
        keysRef.current.right;

      if (keyboardMoving) {
        clickMovingRef.current = false;
        clickTargetRef.current = null;
      }

      if (!keyboardMoving && clickMovingRef.current && clickTargetRef.current) {
        const target = clickTargetRef.current;
        const dx = target.x - xRef.current;
        const dy = target.y - yRef.current;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.5) {
          clickMovingRef.current = false;
          clickTargetRef.current = null;
        } else {
          const step = speed * delta;
          const moveX = (dx / distance) * step;
          const moveY = (dy / distance) * step;

          nextX = xRef.current + moveX;
          nextY = yRef.current + moveY;
          isMovingRef.current = true;

          if (Math.abs(dx) > Math.abs(dy)) {
            currentDirectionRef.current = dx > 0 ? 'right' : 'left';
          } else {
            currentDirectionRef.current = dy > 0 ? 'front' : 'back';
          }
        }
      }

      if (isWalkable(nextX, yRef.current)) {
        xRef.current = nextX;
      }

      if (isWalkable(xRef.current, nextY)) {
        yRef.current = nextY;
      }

      if (isMovingRef.current) {
        if (timestamp - lastFrameChangeRef.current > frameDuration) {
          currentFrameRef.current = (currentFrameRef.current + 1) % 3;
          lastFrameChangeRef.current = timestamp;
        }
      } else {
        currentFrameRef.current = 0;
      }

      const house = HOUSE_POSITIONS[currentIsland];
      const houseX = parseFloat(house.left);
      const houseY = parseFloat(house.top);
      const distToHouse = Math.sqrt(
        Math.pow(xRef.current - houseX, 2) +
        Math.pow(yRef.current - houseY, 2)
      );

      if (distToHouse < 8 && !cookingCompleted) {
        setShowHousePrompt(true);
      } else {
        setShowHousePrompt(false);
      }

      renderCharacter();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sprites, currentIsland, island, cookingCompleted]);

  const handleMarkerClick = (index: number) => {
    if (index !== currentMarkerIndex) return;

    const nextIndex = index + 1;
    setCurrentMarkerIndex(nextIndex);
    setCheckpointCount(nextIndex);

    if (nextIndex >= island.markers.length && island.nextIsland && onGoToIsland) {
      onGoToIsland(island.nextIsland);
    }
  };

  return (
    <React.Fragment>
      <div className="water-bg" aria-hidden="true">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="wave wave-4"></div>
        <div className="wave wave-5"></div>
        <div className="wave wave-6"></div>
      </div>

      <main className="level-screen">

        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">

          
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#b8860b] px-4 py-2 rounded-full border-3 border-[#f4ede1] shadow-xl">
            <img
              src="pics/dollar.png"
              alt="Coins"
              className="w-5 h-5 md:w-6 md:h-6 object-contain"
            />
            <span className="text-white font-bold text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              {points}
            </span>
          </div>

          
          <button
            onClick={onOpenShop}

            className="flex items-center justify-center bg-gradient-to-r from-[#d4a574] to-[#b8860b] w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-[#f4ede1] shadow-xl hover:scale-105 transition-all cursor-pointer overflow-hidden p-2"
          >
            <img
              src="pics/money-bag.png"
              alt="Inventory"
              className="w-full h-full object-contain"
            />
          </button>

          
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center bg-gradient-to-r from-[#d4a574] to-[#b8860b] w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-[#f4ede1] shadow-xl hover:scale-105 transition-all cursor-pointer overflow-hidden p-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-full h-full text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.77a1.119 1.119 0 0 0-.362.853v.052c0 .31.13.602.362.853l1.003.77a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 0-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.645-.87a6.528 6.528 0 0 1-.22-.127a1.125 1.125 0 0 0-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.43l1.003-.77a1.119 1.119 0 0 0 .362-.852v-.052c0-.31-.13-.602-.362-.853l-1.003-.77a1.125 1.125 0 0 1-.26-1.43l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>

        <aside className="level-info-card">
          <h1>{island.title}</h1>
          <p className="level-topic">Viking Journeys</p>
          <p className="level-progress">
            {checkpointCount} / {island.markers.length} Checkpoints
          </p>
        </aside>

        <section className="top-progress" aria-labelledby="islandProgressTitle">
          <h2 id="islandProgressTitle" className="sr-only">
            Island progression
          </h2>

          <div className="island-progress">
            <button
              type="button"
              className={`progress-step ${currentIsland === 'rootsi' ? 'active' : ''}`}
              aria-current={currentIsland === 'rootsi' ? 'step' : undefined}
              onClick={() => onGoToIsland?.('rootsi')}
            >
              <span className="step-icon">1</span>
              <span className="step-label">Rootsi</span>
            </button>

            <div className="progress-line" aria-hidden="true"></div>

            <button
              type="button"
              className={`progress-step ${currentIsland === 'gotland' ? 'active' : ''}`}
              aria-current={currentIsland === 'gotland' ? 'step' : undefined}
              onClick={() => onGoToIsland?.('gotland')}
            >
              <span className="step-icon">2</span>
              <span className="step-label">Gotland</span>
            </button>

            <div className="progress-line" aria-hidden="true"></div>

            <button
              type="button"
              className={`progress-step ${currentIsland === 'saaremaa' ? 'active' : ''}`}
              aria-current={currentIsland === 'saaremaa' ? 'step' : undefined}
              onClick={() => onGoToIsland?.('saaremaa')}
            >
              <span className="step-icon">3</span>
              <span className="step-label">Saaremaa</span>
            </button>
          </div>
        </section>

        <button id="backBtn" className="back-btn" type="button" onClick={onBackToMenu}>
          ← Back
        </button>

        <div
          ref={mapRef}
          className={island.mapWrapClassName}
          onClick={handleMapClick}
        >
          <img src={island.mapImage} alt={island.mapAlt} className={island.mapClassName} />

          <img
            ref={characterRef}
            id="character"
            src={Front01}
            alt="Character"
            className="character"
          />

          <div
            className={`house-marker ${showHousePrompt ? 'nearby' : ''} ${cookingCompleted ? 'completed' : ''}`}
            style={{ left: HOUSE_POSITIONS[currentIsland].left, top: HOUSE_POSITIONS[currentIsland].top }}
            onClick={handleHouseClick}
            title={cookingCompleted ? 'Supp on juba tehtud!' : 'Klõpsa, et süüa teha'}
          >
            <span className="house-emoji">🏠</span>
            {!cookingCompleted && (
              <span className="house-indicator">
                {showHousePrompt ? '👆 Klõpsa!' : '🍲'}
              </span>
            )}
            {cookingCompleted && <span className="house-indicator">✅</span>}

            {showHousePrompt && !cookingCompleted && (
              <div className="house-prompt">
                🍲 Aja suppi!
                <br />
                <small>Klõpsa majale</small>
              </div>
            )}
          </div>

          {island.markers.map((marker, index) => (
            <button
              key={index}
              className={`question-marker ${index === currentMarkerIndex ? 'active' : ''}`}
              data-index={index}
              style={{ left: marker.left, top: marker.top }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(index);
              }}
            >
              <img
                src="pics/investigation.png" // <-- Pane siia oma pildi nimi (nt. marker.png või quest.png)
                alt="Quest Marker"
                className="w-full h-full object-contain"
              />
            </button>
          ))}

          {island.walkableZones.map((zone, index) => (
            <div
              key={index}
              className="debug-zone"
              style={{
                left: `${zone.minX}%`,
                top: `${zone.minY}%`,
                width: `${zone.maxX - zone.minX}%`,
                height: `${zone.maxY - zone.minY}%`,
              }}
            />
          ))}
        </div>
      </main>

      <CookingGame
        isOpen={isCookingOpen}
        onClose={() => setIsCookingOpen(false)}
        onComplete={handleCookingComplete}
      />
    </React.Fragment>
  );
}