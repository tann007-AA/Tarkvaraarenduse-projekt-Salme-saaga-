import Front01 from './character/Front_01.png';
import Back01 from './character/Back_01.png';
import Left01 from './character/Left_01.png';
import Right01 from './character/Right_01.png';

type Direction = 'front' | 'back' | 'left' | 'right';

interface CharacterProps {
  x: number;
  y: number;
  isMoving: boolean;
  duration: number;
  name: string;
  direction: Direction;
}

export function Character({
  x,
  y,
  isMoving,
  duration,
  name,
  direction,
}: CharacterProps) {
  const spriteMap = {
    front: Front01,
    back: Back01,
    left: Left01,
    right: Right01,
  };

  return (
    <img
      src={spriteMap[direction]}
      alt={name}
      className="bjorn-character absolute w-8 h-8 pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        imageRendering: 'pixelated',
        transition: isMoving && duration > 0 ? `left ${duration}ms linear, top ${duration}ms linear` : 'none',
      }}
    />
  );
}