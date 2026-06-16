import { useRef, useEffect, useCallback } from 'react';
import { PieceType } from './types';

const CELL_SIZE = 50;
const BOARD_SIZE = 11;

interface BoardProps {
  grid: PieceType[][];
  selectedPiece: [number, number] | null;
  onCellClick: (x: number, y: number) => void;
  gameOver: boolean;
  winner: string;
  statusMessage?: string | null;
}

function isSpecialCell(x: number, y: number): boolean {
  const last = BOARD_SIZE - 1;
  const mid = Math.floor(BOARD_SIZE / 2);
  return (x === 0 && y === 0) || (x === last && y === 0) ||
         (x === 0 && y === last) || (x === last && y === last) ||
         (x === mid && y === mid);
}

function isThroneZoneCell(x: number, y: number): boolean {
  const mid = Math.floor(BOARD_SIZE / 2);
  return (Math.abs(x - mid) <= 1 && y === mid) || (Math.abs(y - mid) <= 1 && x === mid);
}

export function Board({ grid, selectedPiece, onCellClick, gameOver, winner, statusMessage }: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 550, 550);

    // Draw board cells
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        if (isThroneZoneCell(x, y) || (isSpecialCell(x, y) && x !== Math.floor(BOARD_SIZE / 2))) {
          ctx.fillStyle = '#1b3252';
        } else {
          ctx.fillStyle = (x + y) % 2 === 0 ? '#fcf8ee' : '#f4eedf';
        }
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

        ctx.strokeStyle = '#181b21';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

        // Special cell decorations
        if (isSpecialCell(x, y)) {
          const mid = Math.floor(BOARD_SIZE / 2);
          const pad = 10;
          ctx.save();
          ctx.shadowBlur = 0;
          if (x === mid && y === mid) {
            ctx.strokeStyle = '#cda231';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
            ctx.fillStyle = '#cda231';
            ctx.beginPath();
            ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = '#cda231';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px + pad, py + pad);
            ctx.lineTo(px + CELL_SIZE - pad, py + CELL_SIZE - pad);
            ctx.moveTo(px + CELL_SIZE - pad, py + pad);
            ctx.lineTo(px + pad, py + CELL_SIZE - pad);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }

    ctx.strokeStyle = '#122238';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 550, 550);

    // Selected highlight
    if (selectedPiece) {
      const [sx, sy] = selectedPiece;
      ctx.fillStyle = 'rgba(41, 128, 185, 0.22)';
      ctx.fillRect(sx * CELL_SIZE, sy * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    // Draw pieces
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const piece = grid[x][y];
        if (piece === PieceType.None) continue;

        const cx = x * CELL_SIZE + CELL_SIZE / 2;
        const cy = y * CELL_SIZE + CELL_SIZE / 2;
        const r = CELL_SIZE * 0.36;

        const isSelected = selectedPiece && selectedPiece[0] === x && selectedPiece[1] === y;

        ctx.save();
        if (isSelected) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#2980b9';
        }

        if (piece === PieceType.Attacker) {
          ctx.fillStyle = '#b83b30';
          ctx.strokeStyle = '#7d221a';
        } else if (piece === PieceType.Defender) {
          ctx.fillStyle = '#2c3e50';
          ctx.strokeStyle = '#1a252f';
        } else if (piece === PieceType.King) {
          ctx.fillStyle = '#f5f0e1';
          ctx.strokeStyle = '#34495e';
        }

        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (piece === PieceType.King) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#d4af37';
          ctx.strokeStyle = '#aa8416';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(cx - 10, cy + 8);
          ctx.lineTo(cx - 12, cy - 4);
          ctx.lineTo(cx - 5, cy + 1);
          ctx.lineTo(cx, cy - 10);
          ctx.lineTo(cx + 5, cy + 1);
          ctx.lineTo(cx + 12, cy - 4);
          ctx.lineTo(cx + 10, cy + 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#34495e';
          ctx.beginPath();
          ctx.arc(cx, cy + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Game over overlay
    if (gameOver) {
      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(18, 34, 56, 0.85)';
      ctx.fillRect(0, 0, 550, 550);
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(winner, 275, 260);
      ctx.restore();
    }

    // Status message
    if (statusMessage) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(50, 200, 450, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(statusMessage, 275, 255);
    }
  }, [grid, selectedPiece, gameOver, winner, statusMessage]);

  useEffect(() => {
    render();
  }, [render]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cellX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const cellY = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    onCellClick(cellX, cellY);
  }, [onCellClick]);

  return (
    <canvas
      ref={canvasRef}
      width={550}
      height={550}
      onClick={handleClick}
      style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
    />
  );
}
