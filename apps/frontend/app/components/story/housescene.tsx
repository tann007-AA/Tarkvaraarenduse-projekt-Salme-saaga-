import { useEffect, useMemo, useRef, useState } from 'react';
import './level.css';

import HouseImage from './character/Interior.svg';

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

type Zone = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

interface HouseSceneProps {
  onExitHouse: () => void;
  onBackToMenu: () => void;
}

export function HouseScene({ onExitHouse, onBackToMenu }: HouseSceneProps) {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 78 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<Direction>('front');
  const [frameIndex, setFrameIndex] = useState(0);

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
    { minX: 5, maxX: 80, minY: 23, maxY: 85 },
  ];

  const blockedZones: Zone[] = [
    { minX: 14, maxX: 30, minY: 34, maxY: 73 }, // pikk laud vasakul
    { minX: 63, maxX: 77, minY: 20, maxY: 28 },  // tünnid üleval paremal
    //{ minX: 41.5, maxX: 53.5, minY: 82, maxY: 85 },
  ];

  const isInsideZone = (x: number, y: number, zone: Zone) => {
    return (
      x >= zone.minX &&
      x <= zone.maxX &&
      y >= zone.minY &&
      y <= zone.maxY
    );
  };

  const isHousePositionAllowed = (x: number, y: number) => {
    const inWalkableZone = houseWalkableZones.some((zone) =>
      isInsideZone(x, y, zone)
    );

    const inBlockedZone = blockedZones.some((zone) =>
      isInsideZone(x, y, zone)
    );

    return inWalkableZone && !inBlockedZone;
  };

  const handleHouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.house-exit-btn')) return;

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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      const keyboardMoving =
        keysRef.current.up ||
        keysRef.current.down ||
        keysRef.current.left ||
        keysRef.current.right;

      setPlayerPos((prev) => {
        let updatedPos = prev;
        let moved = false;

        if (keyboardMoving) {
          if (targetPos) {
            setTargetPos(null);
          }

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

          if (timestamp - lastFrameChangeRef.current > frameDuration) {
            setFrameIndex((current) => (current + 1) % 3);
            lastFrameChangeRef.current = timestamp;
          }

          return nextPos;
        }

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
  }, [targetPos]);

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
          <div className="house-scene-stage" onClick={handleHouseClick}>
            <img
              src={HouseImage}
              alt="Maja sisemus"
              className="house-scene-image"
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

            <button
              type="button"
              className="house-exit-btn"
              onClick={onExitHouse}
            >
              Lahku majast
            </button>

            {houseWalkableZones.map((zone, index) => (
              <div
                key={`walkable-${index}`}
                className="debug-zone"
                style={{
                  left: `${zone.minX}%`,
                  top: `${zone.minY}%`,
                  width: `${zone.maxX - zone.minX}%`,
                  height: `${zone.maxY - zone.minY}%`,
                }}
              />
            ))}

            {blockedZones.map((zone, index) => (
              <div
                key={`blocked-${index}`}
                className="debug-zone blocked-zone"
                style={{
                  left: `${zone.minX}%`,
                  top: `${zone.minY}%`,
                  width: `${zone.maxX - zone.minX}%`,
                  height: `${zone.maxY - zone.minY}%`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}