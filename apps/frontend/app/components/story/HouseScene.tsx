import { useEffect, useMemo, useRef, useState } from 'react';
import './level.css';

import HouseImage from './character/Interior.svg';
import HouseImageDark from './character/Interior_dark.svg';

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

import { CookingGame } from '../story/cooking/CookingGame';
import { LonghouseHotspots } from '../story/cooking/LonghouseHotspots';
import { MythologyHotspots } from '../story/cooking/MythologyHotspots';
import { HnefataflStory } from '../story/hnefatafl/HnefataflStory';
import { HnefataflLoopChoice } from '../story/hnefatafl/HnefataflLoopChoice';
import { RaidhoTransition } from '../story/transition/RaidhoTransition';
import { DIALOGUE_TRIGGERS } from './dialogue/dialogues';
import { DialogueBox } from './dialogue/DialogueBox';
import { loadStoryProgress, saveStoryProgress, patchStoryProgress, type HousePhase } from './progress';

type Direction = 'front' | 'back' | 'left' | 'right';

type Zone = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

interface HouseSceneProps {
  onExitHouse: () => void;
  onBackToMenu: () => void;
  onRewardCollect?: (rewardId: string) => void;
  onDialogueStart?: (id: string) => void;
}


export function HouseScene({ onExitHouse, onBackToMenu, onRewardCollect, onDialogueStart }: HouseSceneProps) {
  const [playerPos, setPlayerPos] = useState({ x: 48.5, y: 43 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<Direction>('front');
  const [frameIndex, setFrameIndex] = useState(0);

  const [isCookingOpen, setIsCookingOpen] = useState(false);
  const [isLonghouseOpen, setIsLonghouseOpen] = useState(false);
  const [isMythologyOpen, setIsMythologyOpen] = useState(false);
  const [isHnefataflOpen, setIsHnefataflOpen] = useState(false);
  const [isLoopChoiceOpen, setIsLoopChoiceOpen] = useState(false);
  const [showRaidho, setShowRaidho] = useState(false);
  const [housePhase, setHousePhase] = useState<HousePhase>(() => {
    const saved = loadStoryProgress();
    return saved?.housePhase ?? 'etapp1';
  });
  const [hasTriggeredInteraction, setHasTriggeredInteraction] = useState(false);
  const [hasFinishedHouseGames, setHasFinishedHouseGames] = useState(() => {
    const saved = loadStoryProgress();
    const savedPhase = saved?.housePhase ?? 'etapp1';
    return savedPhase !== 'etapp1' && savedPhase !== 'longhouse';
  });
  const [hasTriggeredExit, setHasTriggeredExit] = useState(false);
  const hasLeftDoorAreaRef = useRef(false);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const hasAutoTriggeredAfterCookingRef = useRef(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameChangeRef = useRef(0);
  const lastTimeRef = useRef(0);

  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const sprites = useMemo(
    () => ({
      front: [Front01, Front02, Front03],
      back: [Back01, Back02, Back03],
      left: [Left01, Left02, Left03],
      right: [Right01, Right02, Right03],
    }),
    []
  );

  const speed = 0.02;
  const frameDuration = 120;

  const houseWalkableZones: Zone[] = [
    { minX: 19, maxX: 71, minY: 19, maxY: 81 },
  ];

  const blockedZones: Zone[] = [
    { minX: 25, maxX: 36, minY: 30, maxY: 70 },
    { minX: 59, maxX: 69, minY: 19, maxY: 24 },
  ];

  const questionMarkPosition = {
    x: 23,
    y: 25,
  };

  const questionMarkZone: Zone = {
    minX: questionMarkPosition.x - 3,
    maxX: questionMarkPosition.x + 3,
    minY: questionMarkPosition.y - 4,
    maxY: questionMarkPosition.y + 4,
  };

  const exitPosition = {
    x: 48.5,
    y: 81,
  };

  const exitZone: Zone = {
    minX: exitPosition.x - 5,
    maxX: exitPosition.x + 5,
    minY: exitPosition.y - 4,
    maxY: exitPosition.y + 4,
  };

  const isInsideZone = (x: number, y: number, zone: Zone) => {
    return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
  };

  const isHousePositionAllowed = (x: number, y: number) => {
    const inWalkableZone = houseWalkableZones.some((zone) => isInsideZone(x, y, zone));
    const inBlockedZone = blockedZones.some((zone) => isInsideZone(x, y, zone));
    return inWalkableZone && !inBlockedZone;
  };

  useEffect(() => {
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

      if (key === 'escape') {
        if (isLonghouseOpen) {
          setIsLonghouseOpen(false);
        } else if (isCookingOpen) {
          setIsCookingOpen(false);
        } else if (isMythologyOpen) {
          setIsMythologyOpen(false);
        } else if (isHnefataflOpen) {
          setIsHnefataflOpen(false);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') keysRef.current.up = false;
      if (key === 'arrowdown' || key === 's') keysRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = false;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCookingOpen, isLonghouseOpen, isMythologyOpen, isHnefataflOpen]);

  const handleHouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCookingOpen || isLonghouseOpen || isMythologyOpen || isHnefataflOpen || isLoopChoiceOpen || showRaidho) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (!isHousePositionAllowed(clickX, clickY)) return;

    const dx = clickX - playerPos.x;
    const dy = clickY - playerPos.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 'right' : 'left');
    } else {
      setDirection(dy > 0 ? 'front' : 'back');
    }

    setTargetPos({ x: clickX, y: clickY });
  };

  useEffect(() => {
    if (isCookingOpen || isLonghouseOpen || isMythologyOpen || isHnefataflOpen || isLoopChoiceOpen || showRaidho) {
      setTargetPos(null);
    }
  }, [isCookingOpen, isLonghouseOpen, isMythologyOpen, isHnefataflOpen, isLoopChoiceOpen, showRaidho]);

  // ETAPP 2 story beats are mandatory — auto-reopen if player closes them
  useEffect(() => {
    if (housePhase === 'longhouse' && !isLonghouseOpen && !isCookingOpen && !activeDialogueId) {
      if (!hasAutoTriggeredAfterCookingRef.current) {
        hasAutoTriggeredAfterCookingRef.current = true;
        const timer = setTimeout(() => setActiveDialogueId(DIALOGUE_TRIGGERS.afterCooking), 50);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setIsLonghouseOpen(true), 50);
      return () => clearTimeout(timer);
    }
    if (housePhase === 'etapp2' && !isMythologyOpen && !isLonghouseOpen && !isCookingOpen) {
      const timer = setTimeout(() => setIsMythologyOpen(true), 50);
      return () => clearTimeout(timer);
    }
    if (housePhase === 'hnefatafl' && !isHnefataflOpen && !isMythologyOpen) {
      const timer = setTimeout(() => setIsHnefataflOpen(true), 50);
      return () => clearTimeout(timer);
    }
    if (housePhase === 'loop' && !isLoopChoiceOpen && !isHnefataflOpen) {
      const timer = setTimeout(() => setIsLoopChoiceOpen(true), 50);
      return () => clearTimeout(timer);
    }
  }, [housePhase, isMythologyOpen, isHnefataflOpen, isLoopChoiceOpen, isLonghouseOpen, isCookingOpen, activeDialogueId]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      if (isCookingOpen || isLonghouseOpen || isMythologyOpen || isHnefataflOpen || isLoopChoiceOpen || showRaidho) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const keyboardMoving =
        keysRef.current.up ||
        keysRef.current.down ||
        keysRef.current.left ||
        keysRef.current.right;

      setPlayerPos((prev) => {
        let updatedPos = prev;
        let moved = false;

        const runZoneChecks = (pos: { x: number; y: number }) => {
          const isTouchingQuestionMark =
            housePhase === 'etapp1' &&
            !hasFinishedHouseGames &&
            !isCookingOpen &&
            !isLonghouseOpen &&
            isInsideZone(pos.x, pos.y, questionMarkZone);

          if (isTouchingQuestionMark && !hasTriggeredInteraction) {
            setHasTriggeredInteraction(true);
            setIsCookingOpen(true);
          }

          if (!isInsideZone(pos.x, pos.y, questionMarkZone) && hasTriggeredInteraction) {
            setHasTriggeredInteraction(false);
          }

          if (
            !hasLeftDoorAreaRef.current &&
            !isInsideZone(pos.x, pos.y, exitZone)
          ) {
            hasLeftDoorAreaRef.current = true;
          }

          const isTouchingExit =
            hasLeftDoorAreaRef.current &&
            housePhase === 'done' &&
            !isCookingOpen &&
            !isLonghouseOpen &&
            !isMythologyOpen &&
            !isHnefataflOpen &&
            !isLoopChoiceOpen &&
            !showRaidho &&
            isInsideZone(pos.x, pos.y, exitZone);

          if (isTouchingExit && !hasTriggeredExit) {
            setHasTriggeredExit(true);
            queueMicrotask(onExitHouse);
          }

          if (!isInsideZone(pos.x, pos.y, exitZone) && hasTriggeredExit) {
            setHasTriggeredExit(false);
          }
        };

        if (keyboardMoving) {
          if (targetPos) setTargetPos(null);

          let nextX = prev.x;
          let nextY = prev.y;

          if (keysRef.current.up) {
            nextY -= speed * delta;
            setDirection('back');
            moved = true;
          }
          if (keysRef.current.down) {
            nextY += speed * delta;
            setDirection('front');
            moved = true;
          }
          if (keysRef.current.left) {
            nextX -= speed * delta;
            setDirection('left');
            moved = true;
          }
          if (keysRef.current.right) {
            nextX += speed * delta;
            setDirection('right');
            moved = true;
          }

          if (isHousePositionAllowed(nextX, updatedPos.y)) {
            updatedPos = { ...updatedPos, x: nextX };
          }

          if (isHousePositionAllowed(updatedPos.x, nextY)) {
            updatedPos = { ...updatedPos, y: nextY };
          }

          runZoneChecks(updatedPos);

          if (moved) {
            if (timestamp - lastFrameChangeRef.current > frameDuration) {
              setFrameIndex((current) => (current + 1) % 3);
              lastFrameChangeRef.current = timestamp;
            }
            return updatedPos;
          }

          setFrameIndex(0);
          return updatedPos;
        }

        if (targetPos) {
          const dx = targetPos.x - prev.x;
          const dy = targetPos.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.45) {
            setFrameIndex(0);
            setTargetPos(null);
            runZoneChecks(targetPos);
            return targetPos;
          }

          const moveX = (dx / distance) * speed * delta;
          const moveY = (dy / distance) * speed * delta;

          const proposedX = prev.x + moveX;
          const proposedY = prev.y + moveY;

          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 'right' : 'left');
          } else {
            setDirection(dy > 0 ? 'front' : 'back');
          }

          let nextPos = prev;

          if (isHousePositionAllowed(proposedX, nextPos.y)) {
            nextPos = { ...nextPos, x: proposedX };
          }

          if (isHousePositionAllowed(nextPos.x, proposedY)) {
            nextPos = { ...nextPos, y: proposedY };
          }

          runZoneChecks(nextPos);

          if (timestamp - lastFrameChangeRef.current > frameDuration) {
            setFrameIndex((current) => (current + 1) % 3);
            lastFrameChangeRef.current = timestamp;
          }

          return nextPos;
        }

        runZoneChecks(updatedPos);
        setFrameIndex(0);
        return updatedPos;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    targetPos,
    housePhase,
    hasFinishedHouseGames,
    isCookingOpen,
    isLonghouseOpen,
    isMythologyOpen,
    isHnefataflOpen,
    isLoopChoiceOpen,
    showRaidho,
    hasTriggeredInteraction,
    hasTriggeredExit,
    onExitHouse,
  ]);

  return (
    <main className="house-scene-screen">
      <button
        id="backBtn"
        className="back-btn"
        type="button"
        onClick={onBackToMenu}
      >
        ← Back
      </button>

      <section className="house-scene-only">
        <div className="house-scene-map">
          <div
            className={`house-scene-stage ${housePhase !== 'etapp1' ? 'dark-active' : ''}`}
            onClick={handleHouseClick}
          >
            <img
              src={housePhase === 'etapp1' ? HouseImage : HouseImageDark}
              alt="Maja sisemus"
              className={`house-scene-image ${housePhase !== 'etapp1' ? 'dark-house' : ''}`}
            />

            <img
              src={sprites[direction][frameIndex]}
              alt="Björn"
              className="house-player-sprite"
              style={{
                left: `${playerPos.x}%`,
                top: `${playerPos.y}%`,
              }}
            />

            {housePhase === 'done' && (
              <div
                className="house-exit-btn"
                style={{
                  left: `${exitPosition.x}%`,
                  top: `${exitPosition.y}%`,
                }}
                aria-hidden="true"
              >
                EXIT
              </div>
            )}

            {housePhase === 'etapp1' && !isCookingOpen && !isLonghouseOpen && (
              <div
                className="question-mark-trigger"
                style={{
                  left: `${questionMarkPosition.x}%`,
                  top: `${questionMarkPosition.y}%`,
                }}
                aria-hidden="true"
              >
                ?
              </div>
            )}

            <CookingGame
              isOpen={isCookingOpen}
              onClose={() => setIsCookingOpen(false)}
              onComplete={() => {
                setIsCookingOpen(false);
                setHousePhase('longhouse');
                patchStoryProgress({ housePhase: 'longhouse' });
                setActiveDialogueId(DIALOGUE_TRIGGERS.afterCooking);
                hasAutoTriggeredAfterCookingRef.current = true;
              }}
            />

            <LonghouseHotspots
              isOpen={isLonghouseOpen}
              onClose={() => setIsLonghouseOpen(false)}
              onComplete={() => {
                setIsLonghouseOpen(false);
                setHasFinishedHouseGames(true);
                setHousePhase('etapp2');
                patchStoryProgress({ housePhase: 'etapp2' });
                setTimeout(() => setIsMythologyOpen(true), 350);
              }}
              onRewardCollect={() => onRewardCollect?.('kodumulla-paun')}
            />

            <MythologyHotspots
              isOpen={isMythologyOpen}
              onClose={() => setIsMythologyOpen(false)}
              onComplete={() => {
                setIsMythologyOpen(false);
                setHousePhase('hnefatafl');
                patchStoryProgress({ housePhase: 'hnefatafl' });
                setTimeout(() => setIsHnefataflOpen(true), 350);
              }}
            />

            <HnefataflStory
              isOpen={isHnefataflOpen}
              onComplete={() => {
                setIsHnefataflOpen(false);
                setHousePhase('loop');
                patchStoryProgress({ housePhase: 'loop' });
                setTimeout(() => setIsLoopChoiceOpen(true), 350);
              }}
            />

            <HnefataflLoopChoice
              isOpen={isLoopChoiceOpen}
              onClose={() => setIsLoopChoiceOpen(false)}
              onRetry={() => {
                setIsLoopChoiceOpen(false);
                setHousePhase('hnefatafl');
                patchStoryProgress({ housePhase: 'hnefatafl' });
                setTimeout(() => setIsHnefataflOpen(true), 350);
              }}
              onEnough={() => {
                setIsLoopChoiceOpen(false);
                setHousePhase('raidho');
                patchStoryProgress({ housePhase: 'raidho' });
                setShowRaidho(true);
              }}
            />

            {showRaidho && (
              <RaidhoTransition
                onComplete={() => {
                  setShowRaidho(false);
                  setHousePhase('done');
                  patchStoryProgress({ housePhase: 'done' });
                  queueMicrotask(onExitHouse);
                }}
              />
            )}

            <DialogueBox
              dialogueId={activeDialogueId}
              onComplete={() => {
                setActiveDialogueId(null);
                setTimeout(() => {
                  setIsLonghouseOpen(true);
                }, 250);
              }}
              onChoice={(label, nextId) => {
                // Sigridi valik: e1_bjorn_lugupidav või e1_bjorn_ulbe
                // Dialoog süsteem jätkub automaatselt järgmise stseeni kaudu
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
