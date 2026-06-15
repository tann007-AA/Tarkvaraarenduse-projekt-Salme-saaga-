// Minimal placeholder for the Hnefatafl game engine
// This provides the initial board state for an 11x11 board

export class HnefataflEngine {
  static initialBoard(): string[][] {
    // 11x11 board with Hnefatafl starting position
    // 'A' = Attacker (Vikings), 'D' = Defender, 'K' = King, '.' = empty
    // This is a standard Copenhagen Hnefatafl setup
    return [
      ['.', '.', '.', 'A', 'A', 'A', 'A', 'A', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'A', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['A', '.', '.', '.', '.', 'D', '.', '.', '.', '.', 'A'],
      ['A', '.', '.', '.', 'D', 'D', 'D', '.', '.', '.', 'A'],
      ['A', 'A', '.', 'D', 'D', 'K', 'D', 'D', '.', 'A', 'A'],
      ['A', '.', '.', '.', 'D', 'D', 'D', '.', '.', '.', 'A'],
      ['A', '.', '.', '.', '.', 'D', '.', '.', '.', '.', 'A'],
      ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'A', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'A', 'A', 'A', 'A', 'A', '.', '.', '.'],
    ];
  }
}
