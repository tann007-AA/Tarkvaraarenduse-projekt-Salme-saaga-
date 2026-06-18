import React from 'react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './level.css';
import { DialogueBox } from './dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from './dialogue/dialogues';
import { QuestionModal, type Question } from './questions/QuestionModal';
import { ISLAND_QUESTIONS, QUESTIONS_ENABLED } from './questions/questions';
import { type StoryIsland } from './progress';

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

import VikingShip from './character/VikingShip.png';

type Direction = 'front' | 'back' | 'left' | 'right';

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

const VikingShipPos = { left: '87%', top: '18%' };

interface StoryIslandProps {
  currentIsland: StoryIsland;
  completedBeachIslands?: Set<StoryIsland>;
  onBackToMenu: () => void;
  onGoToIsland?: (island: StoryIsland) => void;
  onCompleteIsland?: (nextIsland: StoryIsland) => void;
  onGoToBeach?: () => void;
  isPaused?: boolean;
  points?: number;
  onOpenSettings?: () => void;
  onOpenShop?: () => void;
  storyRewards?: string[];
  onStoryRewardCollect?: (rewardId: string) => void;
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
    /* Fixed design-size of the scaled stage (px). The whole stage scales
       uniformly to fit; all %-coords stay valid because they are relative
       to this constant box. Match the map's current rendered size. */
    designW: number;
    designH: number;
  }
> = {
  rootsi: {
    title: 'Rootsi',
    mapImage: SwedenMap,
    mapAlt: 'Rootsi saar',
    mapClassName: 'rootsi',
    mapWrapClassName: 'map-wrap-rootsi scene-map',
    nextIsland: 'gotland',
    designW: 1000,
    designH: 550,
    startX: 74,
    startY: 70,
    markers: [
      /* { left: '86%', top: '14%' },
      { left: '45%', top: '14%' },
      { left: '22%', top: '30%' },
      { left: '68%', top: '83%' },
      { left: '17%', top: '66%' },
      { left: '26%', top: '82%' },
      { left: '54%', top: '57%' },
      { left: '90%', top: '40%' }, */
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
    designW: 520,
    designH: 650,
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
    designW: 1000,
    designH: 571,
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
  completedBeachIslands = new Set(),
  onBackToMenu,
  onGoToIsland,
  onCompleteIsland,
  onGoToBeach,
  isPaused = false,
  onOpenSettings,
  onOpenShop,
  storyRewards = [],
  onStoryRewardCollect,
}: StoryIslandProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const lastFrameChangeRef = useRef(0);

  const clickTargetRef = useRef<{ x: number; y: number } | null>(null);
  const clickMovingRef = useRef(false);

  const isPausedRef = useRef(isPaused);
  const hasTriggeredShipRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const island = storyIslandData[currentIsland];

  const [mapScale, setMapScale] = useState(1);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
  const [checkpointCount, setCheckpointCount] = useState(0);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [pendingIsland, setPendingIsland] = useState<StoryIsland | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const currentMarkerIndexRef = useRef(0);
  const markerTriggeredRef = useRef(false);
  const checkpointCountRef = useRef(0);

  /* Scale the map stage uniformly to fit its container (letterbox), leaving
     all internal sizes/offsets untouched so %-coords stay aligned. Measure
     the stage's natural box via offsetWidth/Height (transform-independent). */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      const s = Math.min(cw / island.designW, ch / island.designH);
      setMapScale(s > 0 ? s : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [island.designW, island.designH]);

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

  const speed = 0.022;
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
    currentMarkerIndexRef.current = 0;
    markerTriggeredRef.current = false;
    currentDirectionRef.current = 'front';
    currentFrameRef.current = 0;
    lastTimeRef.current = 0;
    lastFrameChangeRef.current = 0;
    clickTargetRef.current = null;
    clickMovingRef.current = false;
    keysRef.current = { up: false, down: false, left: false, right: false };

    hasTriggeredShipRef.current = false;

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


  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (activeDialogueId) return;
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

      if (isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      let nextX = xRef.current;
      let nextY = yRef.current;
      isMovingRef.current = false;

      const moveX =
        (keysRef.current.right ? 1 : 0) +
        (keysRef.current.left ? -1 : 0);

      const moveY =
        (keysRef.current.down ? 1 : 0) +
        (keysRef.current.up ? -1 : 0);

      const keyboardMoving = moveX !== 0 || moveY !== 0;

      if (keyboardMoving) {
        clickMovingRef.current = false;
        clickTargetRef.current = null;

        if (moveY < 0) currentDirectionRef.current = 'back';
        else if (moveY > 0) currentDirectionRef.current = 'front';
        else if (moveX < 0) currentDirectionRef.current = 'left';
        else if (moveX > 0) currentDirectionRef.current = 'right';

        const length = Math.hypot(moveX, moveY) || 1;
        nextX = xRef.current + (moveX / length) * speed * delta;
        nextY = yRef.current + (moveY / length) * speed * delta;
        isMovingRef.current = true;
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
          const moveXClick = (dx / distance) * step;
          const moveYClick = (dy / distance) * step;

          nextX = xRef.current + moveXClick;
          nextY = yRef.current + moveYClick;
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

      const activeMarker = island.markers[currentMarkerIndexRef.current];
      if (activeMarker && !isQuestionOpen) {
        const markerX = parseFloat(activeMarker.left);
        const markerY = parseFloat(activeMarker.top);
        const dist = Math.sqrt(
          Math.pow(xRef.current - markerX, 2) +
          Math.pow(yRef.current - markerY, 2)
        );
        if (dist < 5 && !markerTriggeredRef.current) {
          markerTriggeredRef.current = true;
          if (QUESTIONS_ENABLED[currentIsland]) {
            const q = ISLAND_QUESTIONS[currentIsland][currentMarkerIndexRef.current];
            if (q) {
              setActiveQuestion(q);
              setIsQuestionOpen(true);
            }
          } else {
            const nextIndex = currentMarkerIndexRef.current + 1;
            currentMarkerIndexRef.current = nextIndex;
            checkpointCountRef.current = nextIndex;
            setCurrentMarkerIndex(nextIndex);
            setCheckpointCount(nextIndex);
            markerTriggeredRef.current = false;
            if (nextIndex >= island.markers.length && island.nextIsland) {
              if (currentIsland === 'rootsi') setActiveDialogueId(DIALOGUE_TRIGGERS.ormarArrival);
              setPendingIsland(island.nextIsland);
            }
          }
        } else if (dist >= 5) {
          markerTriggeredRef.current = false;
        }
      }


      renderCharacter();

      const shipX = parseFloat(VikingShipPos.left);
      const shipY = parseFloat(VikingShipPos.top);
      const dxShip = xRef.current - shipX;
      const dyShip = yRef.current - shipY;
      const shipDistance = Math.sqrt(dxShip * dxShip + dyShip * dyShip);

      const beachCompleted = completedBeachIslands.has(currentIsland);

      if (shipDistance < 10 && !hasTriggeredShipRef.current && !beachCompleted) {
        const markersRequired = island.markers.length;
        const allMarkersComplete = checkpointCountRef.current >= markersRequired;

        if (markersRequired === 0 || allMarkersComplete) {
          hasTriggeredShipRef.current = true;
          onGoToBeach?.();
        }
      }

      if (shipDistance >= 10 || beachCompleted) {
        hasTriggeredShipRef.current = false;
      }

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
  }, [sprites, currentIsland, island, completedBeachIslands, onGoToBeach]);

  const handleMarkerClick = (index: number) => {
    if (index !== currentMarkerIndex) return;

    if (QUESTIONS_ENABLED[currentIsland]) {
      const q = ISLAND_QUESTIONS[currentIsland][index];
      if (q) {
        setActiveQuestion(q);
        setIsQuestionOpen(true);
      }
    } else {
      const nextIndex = index + 1;
      setCurrentMarkerIndex(nextIndex);
      setCheckpointCount(nextIndex);
      if (nextIndex >= island.markers.length && island.nextIsland) {
        const nextIsland = island.nextIsland;
        if (currentIsland === 'rootsi') setActiveDialogueId(DIALOGUE_TRIGGERS.ormarArrival);
        setPendingIsland(nextIsland);
      }
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
        <header className="level-header">
          <aside className="level-info-card">
            <h1>{island.title}</h1>
            <p className="level-topic">Viking Journeys</p>
            {island.markers.length > 0 && (
              <p className="level-progress">
                {checkpointCount} / {island.markers.length} Checkpoints
              </p>
            )}
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

          <div className="level-header-actions">
            {storyRewards.includes('kodumulla-paun') && (
              <div
                className="flex items-center justify-center bg-gradient-to-r from-[#2d6a4f] to-[#40916c] w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-[#f4ede1] shadow-xl"
                title="Kodumulla paun"
              >
                <span className="text-lg md:text-xl">🪙</span>
              </div>
            )}

            {storyRewards.includes('whalebone-dice') && (
              <div
                className="flex items-center justify-center bg-gradient-to-r from-[#5c4a6b] to-[#7a5f8d] w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-[#f4ede1] shadow-xl"
                title="Vaalaluust täringud"
              >
                <span className="text-lg md:text-xl">🎲</span>
              </div>
            )}

            <button
              onClick={onOpenSettings}
              className="flex items-center justify-center bg-gradient-to-r from-[#d4a574] to-[#b8860b] w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-[#f4ede1] shadow-xl hover:scale-105 transition-all cursor-pointer overflow-hidden p-2.5"
              aria-label="Seaded"
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
        </header>

        <button id="backBtn" className="back-btn" type="button" onClick={onBackToMenu}>
          ← Tagasi
        </button>

        <div className="map-container" ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIsland}
              className="map-fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
            <div
              ref={mapRef}
              className={island.mapWrapClassName}
              onClick={handleMapClick}
              style={{
                width: `${island.designW}px`,
                height: `${island.designH}px`,
                flex: 'none',
                transform: `scale(${mapScale})`,
                transformOrigin: 'center center',
              }}
            >
              <img src={island.mapImage} alt={island.mapAlt} className={island.mapClassName} />

              <img
                ref={characterRef}
                id="character"
                src={Front01}
                alt="Character"
                className="character"
              />

              {currentIsland === 'rootsi' && (
                <div
                  className="ship-wrapper"
                  style={{
                    position: 'absolute',
                    left: VikingShipPos.left,
                    top: VikingShipPos.top,
                    width: '150px',
                  }}
                >
                  <div className="ship-splash" aria-hidden="true">
                    <span className="splash-pixel p1" />
                    <span className="splash-pixel p2" />
                    <span className="splash-pixel p3" />
                    <span className="splash-pixel p4" />
                    <span className="splash-pixel p5" />
                    <span className="splash-pixel p6" />
                    <span className="splash-pixel p7" />
                    <span className="splash-pixel p8" />
                    <span className="wave-ring r1" />
                    <span className="wave-ring r2" />
                  </div>
                  <img
                    src={VikingShip}
                    alt="Viking Ship"
                    className="character ship-bob"
                    style={{ width: '150px', height: 'auto', position: 'relative', zIndex: 2 }}
                  />
                </div>
              )}

              {island.markers.map((marker, index) => (
                <button
                  key={index}
                  className={`question-marker ${index === currentMarkerIndex ? 'active' : ''}`}
                  data-index={index}
                  style={{ left: marker.left, top: marker.top }}
                  onClick={(e) => {
                    if (activeDialogueId) return;
                    e.stopPropagation();
                    if (index !== currentMarkerIndex) return;
                    const m = island.markers[index];
                    clickTargetRef.current = { x: parseFloat(m.left), y: parseFloat(m.top) };
                    clickMovingRef.current = true;
                  }}
                >
                  <img
                    src="pics/investigation.png"
                    alt="Quest Marker"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}

            </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <QuestionModal
          isOpen={isQuestionOpen}
          question={activeQuestion}
          onCorrect={() => {
            setIsQuestionOpen(false);
            setActiveQuestion(null);
            const nextIndex = currentMarkerIndex + 1;
            currentMarkerIndexRef.current = nextIndex;
            checkpointCountRef.current = nextIndex;
            markerTriggeredRef.current = false;
            setCurrentMarkerIndex(nextIndex);
            setCheckpointCount(nextIndex);
            if (nextIndex >= island.markers.length && island.nextIsland) {
              const nextIsland = island.nextIsland;
              if (currentIsland === 'gotland') setActiveDialogueId(DIALOGUE_TRIGGERS.openSea);
              else if (currentIsland === 'saaremaa') setActiveDialogueId(DIALOGUE_TRIGGERS.nightWatch);
              setPendingIsland(nextIsland);
            }
          }}
          onClose={() => {
            setIsQuestionOpen(false);
            setActiveQuestion(null);
          }}
        />

        <DialogueBox
          dialogueId={activeDialogueId}
          onComplete={() => {
            setActiveDialogueId(null);
            if (pendingIsland) {
              onCompleteIsland?.(pendingIsland);
              setPendingIsland(null);
            }
          }}
        />
      </main>
    </React.Fragment>
  );
}

export { StoryIsland as StoryLevel };
