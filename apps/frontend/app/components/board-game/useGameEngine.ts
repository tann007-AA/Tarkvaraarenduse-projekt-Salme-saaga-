import { useState, useCallback, useRef } from 'react';
import { PieceType, type LegalMove } from './types';

const SIZE = 11;

function createEmptyGrid(): PieceType[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(PieceType.None));
}

function setupInitialPieces(): PieceType[][] {
  const grid = createEmptyGrid();
  const mid = Math.floor(SIZE / 2);

  grid[mid][mid] = PieceType.King;

  const defPositions: [number, number][] = [
    [mid - 1, mid], [mid - 2, mid], [mid + 1, mid], [mid + 2, mid],
    [mid, mid - 1], [mid, mid - 2], [mid, mid + 1], [mid, mid + 2],
    [mid - 1, mid - 1], [mid - 1, mid + 1], [mid + 1, mid - 1], [mid + 1, mid + 1],
  ];
  for (const [x, y] of defPositions) {
    grid[x][y] = PieceType.Defender;
  }

  const attPositions: [number, number][] = [
    [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [5, 1],
    [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [5, 9],
    [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 5],
    [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [9, 5],
  ];
  for (const [x, y] of attPositions) {
    grid[x][y] = PieceType.Attacker;
  }

  return grid;
}

function isSpecialCell(x: number, y: number): boolean {
  const last = SIZE - 1;
  const mid = Math.floor(SIZE / 2);
  return (x === 0 && y === 0) || (x === last && y === 0) ||
         (x === 0 && y === last) || (x === last && y === last) ||
         (x === mid && y === mid);
}

function isThroneCell(x: number, y: number): boolean {
  const mid = Math.floor(SIZE / 2);
  return x === mid && y === mid;
}

function isHostileFor(x: number, y: number, attackerSide: PieceType, grid: PieceType[][]): boolean {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return false;
  const piece = grid[x][y];
  if (isSpecialCell(x, y)) return piece !== PieceType.King;
  if (attackerSide === PieceType.Attacker) return piece === PieceType.Defender || piece === PieceType.King;
  if (attackerSide === PieceType.Defender || attackerSide === PieceType.King) return piece === PieceType.Attacker;
  return false;
}

function checkCaptures(grid: PieceType[][], tx: number, ty: number): void {
  const movedPiece = grid[tx][ty];
  if (movedPiece === PieceType.None) return;

  const directions: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (const [dx, dy] of directions) {
    const victimX = tx + dx;
    const victimY = ty + dy;
    const neighborX = tx + dx * 2;
    const neighborY = ty + dy * 2;

    if (victimX < 0 || victimX >= SIZE || victimY < 0 || victimY >= SIZE) continue;
    const victimPiece = grid[victimX][victimY];
    if (victimPiece === PieceType.None || victimPiece === PieceType.King) continue;
    if (movedPiece === PieceType.Attacker && victimPiece === PieceType.Attacker) continue;
    if ((movedPiece === PieceType.Defender || movedPiece === PieceType.King) && victimPiece === PieceType.Defender) continue;

    if (isHostileFor(neighborX, neighborY, victimPiece, grid)) {
      grid[victimX][victimY] = PieceType.None;
    }
  }
}

function generateLegalMoves(grid: PieceType[][], player: PieceType): LegalMove[] {
  const moves: LegalMove[] = [];
  let idCounter = 1;

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      const piece = grid[x][y];
      if (player === PieceType.Attacker && piece !== PieceType.Attacker) continue;
      if (player === PieceType.Defender && piece !== PieceType.Defender && piece !== PieceType.King) continue;

      const directions: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;

        while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
          if (grid[nx][ny] !== PieceType.None) break;
          if (piece !== PieceType.King && isSpecialCell(nx, ny)) {
            nx += dx;
            ny += dy;
            continue;
          }

          moves.push({
            id: idCounter++,
            from: [x, y],
            to: [nx, ny],
            description: `[${x},${y}] -> [${nx},${ny}]`,
          });

          nx += dx;
          ny += dy;
        }
      }
    }
  }
  return moves;
}

function checkGameOver(grid: PieceType[][]): { gameOver: boolean; winner: string } {
  let kingX = -1, kingY = -1;

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (grid[x][y] === PieceType.King) {
        kingX = x;
        kingY = y;
        break;
      }
    }
    if (kingX !== -1) break;
  }

  if (kingX === -1) {
    return { gameOver: true, winner: 'attackersWinCaptured' };
  }

  if (isSpecialCell(kingX, kingY) && !isThroneCell(kingX, kingY)) {
    return { gameOver: true, winner: 'defendersWinEscaped' };
  }

  const directions: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  let hostileBlocks = 0;

  for (const [dx, dy] of directions) {
    const nx = kingX + dx;
    const ny = kingY + dy;

    if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) {
      hostileBlocks++;
    } else {
      const piece = grid[nx][ny];
      if (piece === PieceType.Attacker || isThroneCell(nx, ny)) {
        hostileBlocks++;
      }
    }
  }

  if (hostileBlocks === 4) {
    return { gameOver: true, winner: 'attackersWinSurrounded' };
  }

  return { gameOver: false, winner: '' };
}

export function useGameEngine() {
  const [grid, setGrid] = useState<PieceType[][]>(() => setupInitialPieces());
  const [currentPlayer, setCurrentPlayer] = useState<PieceType>(PieceType.Attacker);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const reset = useCallback(() => {
    const newGrid = setupInitialPieces();
    setGrid(newGrid);
    setCurrentPlayer(PieceType.Attacker);
    setGameOver(false);
    setWinner('');
  }, []);

  const makeMove = useCallback((fromX: number, fromY: number, toX: number, toY: number): boolean => {
    const newGrid = gridRef.current.map(row => [...row]);
    const piece = newGrid[fromX][fromY];
    if (piece === PieceType.None) return false;

    newGrid[fromX][fromY] = PieceType.None;
    newGrid[toX][toY] = piece;
    checkCaptures(newGrid, toX, toY);

    setGrid(newGrid);
    gridRef.current = newGrid;

    const status = checkGameOver(newGrid);
    if (status.gameOver) {
      setGameOver(true);
      setWinner(status.winner);
      return true;
    }

    setCurrentPlayer(prev => prev === PieceType.Attacker ? PieceType.Defender : PieceType.Attacker);
    return false;
  }, []);

  const applyMoveFromService = useCallback((newGrid: PieceType[][], gameOverState?: boolean, winnerText?: string) => {
    setGrid(newGrid);
    gridRef.current = newGrid;
    if (gameOverState) {
      setGameOver(true);
      setWinner(winnerText || '');
    }
    setCurrentPlayer(prev => prev === PieceType.Attacker ? PieceType.Defender : PieceType.Attacker);
  }, []);

  const getLegalMoves = useCallback((player: PieceType): LegalMove[] => {
    return generateLegalMoves(gridRef.current, player);
  }, []);

  return {
    grid,
    currentPlayer,
    gameOver,
    winner,
    setGrid,
    setCurrentPlayer,
    setGameOver,
    setWinner,
    reset,
    makeMove,
    applyMoveFromService,
    getLegalMoves,
    isSpecialCell,
    isThroneCell,
  };
}
