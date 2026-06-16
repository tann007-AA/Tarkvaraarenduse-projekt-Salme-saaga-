export enum PieceType {
  None = 0,
  Attacker = 1,
  Defender = 2,
  King = 3,
}

export enum Difficulty {
  Easy = 1,
  Medium = 3,
  Hard = 4,
}

export interface LegalMove {
  id: number;
  from: [number, number];
  to: [number, number];
  description: string;
}

export interface MoveResult {
  from: [number, number];
  to: [number, number];
}
