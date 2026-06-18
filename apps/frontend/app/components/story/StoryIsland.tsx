import React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Lock } from 'lucide-react';
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

const VikingShipPos = { left: '92%', top: '35%' };

/* Camera: on small (mobile) viewports the map zooms in and follows the
   character instead of shrinking to fit. On desktop it stays fit-to-screen. */
const CAMERA_BREAKPOINT = 960; // viewport width (px) below which the camera engages (mobile/tablet)
const ISLAND_MOBILE_ZOOM = 1.6;
const ZOOM_LERP = 0.08; // per-frame easing for the intro zoom-in after a scene swap

interface StoryIslandProps {
  currentIsland: StoryIsland;
  completedBeachIslands?: Set<StoryIsland>;
  onBackToMenu: () => void;
  onGoToIsland?: (island: StoryIsland) => void;
  onCompleteIsland?: (nextIsland: StoryIsland) => void;
  onGoToBeach?: () => void;
  initialCheckpointCount?: number;
  onCheckpointComplete?: (island: StoryIsland, count: number) => void;
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
  initialCheckpointCount = 0,
  onCheckpointComplete,
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

  const cameraScaleRef = useRef(1);   // current (animated) scale
  const targetScaleRef = useRef(1);   // final camera scale
  const fitScaleRef = useRef(1);      // unzoomed (whole-map) scale — intro start
  /* While a scene/island swap is fading, pause character rendering so DOM
     writes don't yank the still-visible (exiting) sprite to the new start. */
  const isTransitioningRef = useRef(false);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(initialCheckpointCount);
  const [checkpointCount, setCheckpointCount] = useState(initialCheckpointCount);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [pendingIsland, setPendingIsland] = useState<StoryIsland | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const currentMarkerIndexRef = useRef(initialCheckpointCount);
  const markerTriggeredRef = useRef(false);
  const checkpointCountRef = useRef(initialCheckpointCount);

  /* Apply the camera transform: scale the stage and translate it so the
     character is centred, clamped to the map edges. When the scaled stage is
     smaller than the viewport on an axis it is centred instead (fit mode).
     %-coords stay valid because everything lives inside this stage. */
  const applyCamera = useCallback(() => {
    const container = containerRef.current;
    const map = mapRef.current;
    if (!container || !map) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const s = cameraScaleRef.current;
    const stageW = island.designW * s;
    const stageH = island.designH * s;
    const charX = (xRef.current / 100) * stageW;
    const charY = (yRef.current / 100) * stageH;
    const tx = stageW <= cw ? (cw - stageW) / 2 : Math.min(0, Math.max(cw - stageW, cw / 2 - charX));
    const ty = stageH <= ch ? (ch - stageH) / 2 : Math.min(0, Math.max(ch - stageH, ch / 2 - charY));
    map.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  }, [island.designW, island.designH]);

  /* Compute the camera scale: fit-to-screen on desktop, zoomed on small
     (mobile) viewports so the map/character are readable and the camera
     follows. Recomputed on container resize. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      const fit = Math.min(cw / island.designW, ch / island.designH);
      const cover = Math.max(cw / island.designW, ch / island.designH);
      const small = window.innerWidth < CAMERA_BREAKPOINT;
      // Mobile: zoom + follow, but never less than cover (fills the viewport
      // edge-to-edge on both axes, no letterbox bands).
      const target = small ? Math.max(fit * ISLAND_MOBILE_ZOOM, cover) : fit;
      fitScaleRef.current = fit > 0 ? fit : 1;
      targetScaleRef.current = target > 0 ? target : 1;
      applyCamera();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [island.designW, island.designH, applyCamera]);

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
    setCurrentMarkerIndex(initialCheckpointCount);
    setCheckpointCount(initialCheckpointCount);
    currentMarkerIndexRef.current = initialCheckpointCount;
    markerTriggeredRef.current = false;
    currentDirectionRef.current = 'front';
    currentFrameRef.current = 0;
    lastTimeRef.current = 0;
    lastFrameChangeRef.current = 0;
    clickTargetRef.current = null;
    clickMovingRef.current = false;
    keysRef.current = { up: false, down: false, left: false, right: false };

    hasTriggeredShipRef.current = false;

    /* New island fades in via AnimatePresence — block character DOM writes
       until that fade-in completes (cleared in the map-fade onAnimationComplete).
       The sprite mounts at startX/startY declaratively, so no teleport. */
    isTransitioningRef.current = true;
    // Start the camera unzoomed (whole map visible), then ease into the
    // target zoom in the game loop so the player sees the full area first.
    cameraScaleRef.current = fitScaleRef.current;
  }, [currentIsland, island.startX, island.startY, sprites, initialCheckpointCount]);

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
    if (!character || isTransitioningRef.current) return;
    character.style.left = `${xRef.current}%`;
    character.style.top = `${yRef.current}%`;
    character.src = sprites[currentDirectionRef.current][currentFrameRef.current];
  };

  /* Callback ref: position the sprite at startX/startY the instant the new
     island's <img> mounts (during the fade-in), before first paint. Stable
     identity (deps: sprites) so normal re-renders don't re-run it and fight
     the game loop's imperative left/top writes. */
  const setCharacterRef = useCallback(
    (node: HTMLImageElement | null) => {
      characterRef.current = node;
      if (node) {
        node.style.left = `${xRef.current}%`;
        node.style.top = `${yRef.current}%`;
        node.src = sprites.front[0];
      }
    },
    [sprites]
  );


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
    applyCamera();

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

      if (isPausedRef.current || isTransitioningRef.current) {
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
            onCheckpointComplete?.(currentIsland, nextIndex);
            if (nextIndex >= island.markers.length) {
              if (island.nextIsland) {
                if (currentIsland === 'rootsi') setActiveDialogueId(DIALOGUE_TRIGGERS.ormarArrival);
                setPendingIsland(island.nextIsland);
              } else if (currentIsland === 'saaremaa') {
                // Final island completion
                setActiveDialogueId(DIALOGUE_TRIGGERS.nightWatch);
                setPendingIsland('end' as any);
              }
            }
          }
        } else if (dist >= 5) {
          markerTriggeredRef.current = false;
        }
      }


      renderCharacter();
      // Ease the camera scale toward its target (intro zoom-in after a swap).
      const cur = cameraScaleRef.current;
      const tgt = targetScaleRef.current;
      cameraScaleRef.current = Math.abs(tgt - cur) > 0.002 ? cur + (tgt - cur) * ZOOM_LERP : tgt;
      applyCamera();

      const shipX = parseFloat(VikingShipPos.left);
      const shipY = parseFloat(VikingShipPos.top);
      const dxShip = xRef.current - shipX;
      const dyShip = yRef.current - shipY;
      const shipDistance = Math.sqrt(dxShip * dxShip + dyShip * dyShip);

      const beachCompleted = completedBeachIslands.has(currentIsland);

      // Only trigger beach scene on Sweden (rootsi) island where the ship is visually present
      if (currentIsland === 'rootsi' && shipDistance < 10 && !hasTriggeredShipRef.current && !beachCompleted) {
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
  }, [sprites, currentIsland, island, completedBeachIslands, onGoToBeach, onCheckpointComplete, applyCamera]);

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
      currentMarkerIndexRef.current = nextIndex;
      checkpointCountRef.current = nextIndex;
      markerTriggeredRef.current = false;
      setCurrentMarkerIndex(nextIndex);
      setCheckpointCount(nextIndex);
      onCheckpointComplete?.(currentIsland, nextIndex);
      if (nextIndex >= island.markers.length) {
        if (island.nextIsland) {
          const nextIsland = island.nextIsland;
          if (currentIsland === 'rootsi') setActiveDialogueId(DIALOGUE_TRIGGERS.ormarArrival);
          setPendingIsland(nextIsland);
        } else if (currentIsland === 'saaremaa') {
          setActiveDialogueId(DIALOGUE_TRIGGERS.nightWatch);
          setPendingIsland('end' as any);
        }
      }
    }
  };

  const isIslandUnlocked = (id: StoryIsland | 'end') => {
    if (id === 'rootsi') return true;
    if (id === 'gotland') return completedBeachIslands.has('rootsi');
    if (id === 'saaremaa') return completedBeachIslands.has('gotland');
    return false;
  };

  const canNavigateTo = (id: StoryIsland | 'end') => {
    if (id === 'end') return false;
    return id === currentIsland || isIslandUnlocked(id);
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
            {/* <p className="level-topic">Viikingi seiklus</p> */}

            {island.markers.length > 0 && (
              <div className="level-progress">
                <div className="text-2xl font-bold mb-1">
                  {checkpointCount}/{island.markers.length}
                </div>
                <div className="text-sm text-gray-500">
                  küsimust vastatud
                </div>
              </div>
            )}
          </aside>

          <section className="top-progress" aria-labelledby="islandProgressTitle">
            <h2 id="islandProgressTitle" className="sr-only">
              Island progression
            </h2>

            <div className="island-progress">
              <motion.button
                whileHover={canNavigateTo('rootsi') ? { scale: 1.05, y: -2 } : {}}
                whileTap={canNavigateTo('rootsi') ? { scale: 0.95 } : {}}
                type="button"
                className={`progress-step ${currentIsland === 'rootsi' ? 'active' : ''} ${!canNavigateTo('rootsi') ? 'locked' : ''}`}
                aria-current={currentIsland === 'rootsi' ? 'step' : undefined}
                onClick={() => canNavigateTo('rootsi') && onGoToIsland?.('rootsi')}
              >
                <div className="step-icon-wrapper">
                  <span className="step-icon">
                    {!canNavigateTo('rootsi') ? <Lock className="w-5 h-5" /> : '1'}
                  </span>
                  {currentIsland === 'rootsi' && (
                    <motion.div
                      layoutId="active-glow"
                      className="active-glow"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className="step-label">Rootsi</span>
              </motion.button>

              <div className="progress-line" aria-hidden="true">
                <motion.div
                  className="progress-line-fill"
                  initial={{ width: 0 }}
                  animate={{ width: completedBeachIslands.has('rootsi') ? '100%' : '0%' }}
                />
              </div>

              <motion.button
                whileHover={canNavigateTo('gotland') ? { scale: 1.05, y: -2 } : {}}
                whileTap={canNavigateTo('gotland') ? { scale: 0.95 } : {}}
                type="button"
                className={`progress-step ${currentIsland === 'gotland' ? 'active' : ''} ${!canNavigateTo('gotland') ? 'locked' : ''}`}
                aria-current={currentIsland === 'gotland' ? 'step' : undefined}
                onClick={() => canNavigateTo('gotland') && onGoToIsland?.('gotland')}
              >
                <div className="step-icon-wrapper">
                  <span className="step-icon">
                    {!canNavigateTo('gotland') ? <Lock className="w-5 h-5" /> : '2'}
                  </span>
                  {currentIsland === 'gotland' && (
                    <motion.div
                      layoutId="active-glow"
                      className="active-glow"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className="step-label">Gotland</span>
              </motion.button>

              <div className="progress-line" aria-hidden="true">
                <motion.div
                  className="progress-line-fill"
                  initial={{ width: 0 }}
                  animate={{ width: completedBeachIslands.has('gotland') ? '100%' : '0%' }}
                />
              </div>

              <motion.button
                whileHover={canNavigateTo('saaremaa') ? { scale: 1.05, y: -2 } : {}}
                whileTap={canNavigateTo('saaremaa') ? { scale: 0.95 } : {}}
                type="button"
                className={`progress-step ${currentIsland === 'saaremaa' ? 'active' : ''} ${!canNavigateTo('saaremaa') ? 'locked' : ''}`}
                aria-current={currentIsland === 'saaremaa' ? 'step' : undefined}
                onClick={() => canNavigateTo('saaremaa') && onGoToIsland?.('saaremaa')}
              >
                <div className="step-icon-wrapper">
                  <span className="step-icon">
                    {!canNavigateTo('saaremaa') ? <Lock className="w-5 h-5" /> : '3'}
                  </span>
                  {currentIsland === 'saaremaa' && (
                    <motion.div
                      layoutId="active-glow"
                      className="active-glow"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className="step-label">Saaremaa</span>
              </motion.button>
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

        {/*
        <button id="backBtn" className="back-btn" type="button" onClick={onBackToMenu}>
          ← Tagasi
        </button>
        */}

        <div className="map-container" ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIsland}
              className="map-fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onAnimationComplete={(def) => {
                /* Resume character rendering only after the new island has
                   faded fully in (opacity 1), not on the old one's fade-out. */
                if (def && (def as { opacity?: number }).opacity === 1) {
                  isTransitioningRef.current = false;
                }
              }}
            >
              <div
                ref={mapRef}
                className={island.mapWrapClassName}
                onClick={handleMapClick}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${island.designW}px`,
                  height: `${island.designH}px`,
                  transformOrigin: '0 0',
                }}
              >
                <img src={island.mapImage} alt={island.mapAlt} className={island.mapClassName} />

                <img
                  ref={setCharacterRef}
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
                      left: `${parseFloat(VikingShipPos.left) - 7}%`,
                      top: `${parseFloat(VikingShipPos.top) - 15}%`,
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
                  <React.Fragment key={index}>
                    {/* Debug Marker Zone (5% radius) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: marker.left,
                        top: marker.top,
                        width: '10%',
                        height: '10%',
                        /*
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        border: '2px dashed blue',
                    borderRadius: '50%',
                    */
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    />
                    <button
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
                  </React.Fragment>
                ))}

                {/* Debug Ship Trigger Zone (10% radius) */}
                {currentIsland === 'rootsi' && (
                  <div
                    style={{
                      position: 'absolute',
                      left: VikingShipPos.left,
                      top: VikingShipPos.top,
                      width: '20%',
                      height: '20%',
                      /*
                      backgroundColor: 'rgba(255, 0, 0, 0.2)',
                      border: '2px dashed red',
                      borderRadius: '50%',
                      */
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />
                )}

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
            onCheckpointComplete?.(currentIsland, nextIndex);
            if (nextIndex >= island.markers.length) {
              if (island.nextIsland) {
                const nextIsland = island.nextIsland;
                if (currentIsland === 'gotland') setActiveDialogueId(DIALOGUE_TRIGGERS.openSea);
                else if (currentIsland === 'saaremaa') setActiveDialogueId(DIALOGUE_TRIGGERS.nightWatch);
                setPendingIsland(nextIsland);
              } else if (currentIsland === 'saaremaa') {
                setActiveDialogueId(DIALOGUE_TRIGGERS.nightWatch);
                setPendingIsland('end' as any);
              }
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
