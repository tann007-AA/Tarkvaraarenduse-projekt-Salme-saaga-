import { useEffect, useMemo, useRef, useState } from 'react';
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

interface StoryLevelProps {
  currentIsland: StoryIsland;
  onBackToMenu: () => void;
  onGoToIsland?: (island: StoryIsland) => void;
}

const sharedWalkableZones: Zone[] = [
  { minX: 15, maxX: 78, minY: 27, maxY: 98 },
  { minX: 15, maxX: 18, minY: 12, maxY: 29 },
  { minX: 24, maxX: 88, minY: 12, maxY: 29 },
  { minX: 78, maxX: 88, minY: 8, maxY: 45 },
  { minX: 85, maxX: 95, minY: 28, maxY: 45 },
];

const islandData: Record<
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
  },
  gotland: {
    title: 'Gotland',
    mapImage: GotlandMap,
    mapAlt: 'Gotland',
    mapClassName: 'gotland',
    mapWrapClassName: 'map-wrap-gotland scene-map',
    nextIsland: 'saaremaa',
    startX: 74,
    startY: 70,
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
  },
  saaremaa: {
    title: 'Saaremaa',
    mapImage: SaaremaaMap,
    mapAlt: 'Saaremaa saar',
    mapClassName: 'saaremaa',
    mapWrapClassName: 'map-wrap-gotland scene-map',
    startX: 74,
    startY: 70,
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
  },
};

export function StoryLevel({
  currentIsland,
  onBackToMenu,
  onGoToIsland,
}: StoryLevelProps) {
  const characterRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const lastFrameChangeRef = useRef(0);

  const island = islandData[currentIsland];

  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
  const [checkpointCount, setCheckpointCount] = useState(0);

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

  const speed = 0.036;
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

    if (characterRef.current) {
      characterRef.current.style.left = `${xRef.current}%`;
      characterRef.current.style.top = `${yRef.current}%`;
      characterRef.current.src = sprites.front[0];
    }
  }, [currentIsland, island.startX, island.startY, sprites]);

  const isWalkable = (testX: number, testY: number) => {
    return sharedWalkableZones.some((zone) => {
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

  useEffect(() => {
    renderCharacter();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        keysRef.current.up = true;
        event.preventDefault();
      }
      if (event.key === 'ArrowDown') {
        keysRef.current.down = true;
        event.preventDefault();
      }
      if (event.key === 'ArrowLeft') {
        keysRef.current.left = true;
        event.preventDefault();
      }
      if (event.key === 'ArrowRight') {
        keysRef.current.right = true;
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') keysRef.current.up = false;
      if (event.key === 'ArrowDown') keysRef.current.down = false;
      if (event.key === 'ArrowLeft') keysRef.current.left = false;
      if (event.key === 'ArrowRight') keysRef.current.right = false;
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
  }, [sprites, currentIsland]);

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
    <>
      <div className="water-bg" aria-hidden="true">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="wave wave-4"></div>
        <div className="wave wave-5"></div>
        <div className="wave wave-6"></div>
      </div>

      <main className="level-screen">
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

        <div className={island.mapWrapClassName}>
          <img src={island.mapImage} alt={island.mapAlt} className={island.mapClassName} />
          <img
            ref={characterRef}
            id="character"
            src={Front01}
            alt="Character"
            className="character"
          />

          {island.markers.map((marker, index) => (
            <button
              key={index}
              className={`question-marker ${index === currentMarkerIndex ? 'active' : ''}`}
              data-index={index}
              style={{ left: marker.left, top: marker.top }}
              onClick={() => handleMarkerClick(index)}
            >
              ?
            </button>
          ))}

          {sharedWalkableZones.map((zone, index) => (
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
    </>
  );
}