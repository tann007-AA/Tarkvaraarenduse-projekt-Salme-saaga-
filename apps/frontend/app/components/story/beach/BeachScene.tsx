import { useEffect, useMemo, useRef, useState } from 'react';
import './BeachScene.css';

import Front01 from '../character/Front_01.png';
import Front02 from '../character/Front_02.png';
import Front03 from '../character/Front_03.png';
import Back01 from '../character/Back_01.png';
import Back02 from '../character/Back_02.png';
import Back03 from '../character/Back_03.png';
import Left01 from '../character/Left_01.png';
import Left02 from '../character/Left_02.png';
import Left03 from '../character/Left_03.png';
import Right01 from '../character/Right_01.png';
import Right02 from '../character/Right_02.png';
import Right03 from '../character/Right_03.png';

import VikingShip from '../character/VikingShip.png';

const VikingShipPos = { left: '45.5%', top: '29%' };

import { ShipHotspots } from './ShipHotspots';
import { SupplyDragDrop } from './SupplyDragDrop';
import { OrmarEncounter } from './OrmarEncounter';
import { PushOffDialogue } from './PushOffDialogue';

type Direction = 'front' | 'back' | 'left' | 'right';
type BeachPhase = 'hotspots' | 'supplies' | 'ormar' | 'pushoff';

interface BeachSceneProps {
  onExitBeach: () => void;
  onBackToMenu: () => void;
  onRewardCollect?: (rewardId: string) => void;
}

export function BeachScene({ onExitBeach, onBackToMenu, onRewardCollect }: BeachSceneProps) {
  const [playerPos, setPlayerPos] = useState({ x: 25, y: 78 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<Direction>('right');
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<BeachPhase>('hotspots');

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameChangeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ up: false, down: false, left: false, right: false });

  const sprites = useMemo(
    () => ({
      front: [Front01, Front02, Front03],
      back: [Back01, Back02, Back03],
      left: [Left01, Left02, Left03],
      right: [Right01, Right02, Right03],
    }),
    []
  );

  const speed = 0.025;
  const frameDuration = 120;

  // Beach walkable area: lower half of the screen
  const isBeachPositionAllowed = (x: number, y: number) => {
    return x >= 5 && x <= 95 && y >= 65 && y <= 88;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') keysRef.current.up = true;
      if (key === 'arrowdown' || key === 's') keysRef.current.down = true;
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = true;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = true;
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
  }, []);

  const handleBeachClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (!isBeachPositionAllowed(clickX, clickY)) return;

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
    const gameLoop = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      setPlayerPos((prev) => {
        let nextX = prev.x;
        let nextY = prev.y;
        let moved = false;

        const keyboardMoving =
          keysRef.current.up ||
          keysRef.current.down ||
          keysRef.current.left ||
          keysRef.current.right;

        if (keyboardMoving) {
          setTargetPos(null);

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
        } else if (targetPos) {
          const dx = targetPos.x - prev.x;
          const dy = targetPos.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            setTargetPos(null);
            return prev;
          }

          const moveX = (dx / distance) * speed * delta;
          const moveY = (dy / distance) * speed * delta;

          nextX = prev.x + moveX;
          nextY = prev.y + moveY;
          moved = true;

          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 'right' : 'left');
          } else {
            setDirection(dy > 0 ? 'front' : 'back');
          }
        }

        if (isBeachPositionAllowed(nextX, prev.y)) {
          prev = { ...prev, x: nextX };
        }
        if (isBeachPositionAllowed(prev.x, nextY)) {
          prev = { ...prev, y: nextY };
        }

        if (moved) {
          if (timestamp - lastFrameChangeRef.current > frameDuration) {
            setFrameIndex((current) => (current + 1) % 3);
            lastFrameChangeRef.current = timestamp;
          }
        } else {
          setFrameIndex(0);
        }

        return prev;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPos]);

  return (
    <main className="beach-scene-screen">
      <button id="backBtn" className="back-btn" type="button" onClick={onBackToMenu}>
        ← Back
      </button>

      <section className="beach-scene-only" onClick={handleBeachClick}>
        <div className="beach-sky" aria-hidden="true" />
        <div className="beach-sea" aria-hidden="true" />
        <div className="beach-sand" aria-hidden="true" />
        <div className="beach-dunes" aria-hidden="true" />

        {/* Fixed-width, full-height stage keeps the ship and its hotspots in a
            shared coordinate space so hotspots never overlap at narrow widths.
            The ship stays full size; on narrow screens the stage crops at the
            edges (centered) instead of shrinking. */}
        <div className="ship-stage">
          <div
            className="ship-wrapper"
            style={{
              position: 'absolute',
              left: VikingShipPos.left,
              top: VikingShipPos.top,
              width: '150px',
              transform: 'scale(5)',
              transformOrigin: 'center center',
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

          {phase === 'hotspots' && (
            <ShipHotspots onComplete={() => setPhase('supplies')} />
          )}
        </div>

        <img
          src={sprites[direction][frameIndex]}
          alt="Björn"
          className="beach-player-sprite"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        />

        {phase === 'supplies' && (
          <SupplyDragDrop onComplete={() => setPhase('ormar')} />
        )}

        {phase === 'ormar' && (
          <OrmarEncounter
            onComplete={() => setPhase('pushoff')}
            onRewardCollect={onRewardCollect}
          />
        )}

        {phase === 'pushoff' && <PushOffDialogue onComplete={onExitBeach} />}
      </section>
    </main>
  );
}
