import React from 'react';

interface CharacterProps {
  x: number;
  y: number;
  isMoving: boolean;
  duration: number; // Dünaamiline kestus distantsi järgi
  name: string;
  avatar?: string;
  weapon?: string;
}

export function Character({ x, y, isMoving, duration, name, avatar = "🧔", weapon = "🪓" }: CharacterProps) {
  return (
    <div
      className="bjorn-character absolute transition-all linear z-30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -85%)',
        transitionDuration: `${duration}ms` // Reaalne aeg distantsi järgi asub nüüd siin
      }}
    >
      <div className="flex flex-col items-center justify-center relative">
        
        {/* Hõljumise laine-efekt jalgade all, kui tegelane liigub */}
        {isMoving && (
          <span className="absolute bottom-0 w-14 h-5 bg-amber-500/10 border border-amber-500/20 rounded-full animate-ping z-0" />
        )}

        {/* Avatar */}
        <div className="relative p-2 bg-stone-900/95 border-2 border-[#dfc18d] rounded-full shadow-2xl backdrop-blur-xs flex items-center justify-center w-14 h-14 z-10">
          <span className="text-3xl filter drop-shadow-md">
            {avatar}
          </span>
          {weapon && (
            <span className="absolute -top-1.5 -right-1 text-sm">{weapon}</span>
          )}
        </div>

        {/* Nimesilt */}
        <span className="text-[10px] font-bold tracking-wider text-amber-200 uppercase mt-1 bg-stone-950/90 border border-stone-800 px-2 py-0.5 rounded font-serif shadow-md z-10">
          {name}
        </span>
      </div>
    </div>
  );
}