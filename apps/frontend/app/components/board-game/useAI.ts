import { useCallback } from 'react';
import { PieceType, type LegalMove, type MoveResult } from './types';

const API_KEY = (import.meta.env.VITE_GROQ_API_KEY as string | undefined) || '';

function getMoveScore(desc: string): number {
  if (desc.includes('KUNINGAS_VÕIDAB')) return 10000;
  if (desc.includes('NURGA_POOLE_JOOKSMINE')) return 500;
  if (desc.includes('KUNINGA_PIIRAMINE')) return 150;
  if (desc.includes('SÖÖMINE')) return 80;
  if (desc.includes('KAITSE_KUNINGAT')) return 60;
  if (desc.includes('TSENTRI_KONTROLL')) return 10;
  if (desc.includes('OHTLIK_POSIRTSIOON')) return -30;
  return 0;
}

function analyzeAndTagMoves(moves: LegalMove[], grid: PieceType[][], aiSide: PieceType): LegalMove[] {
  const size = grid.length;
  const mid = Math.floor(size / 2);
  const last = size - 1;
  const corners: [number, number][] = [[0, 0], [last, 0], [0, last], [last, last]];

  return moves.map(move => {
    const tags: string[] = [];
    const [fx, fy] = move.from;
    const [tx, ty] = move.to;
    const piece = grid[fx][fy];

    if (piece === PieceType.King) {
      const isCorner = corners.some(([cx, cy]) => cx === tx && cy === ty);
      if (isCorner) {
        tags.push('KUNINGAS_VÕIDAB');
      } else {
        let oldMinDist = Infinity;
        let newMinDist = Infinity;
        for (const [cx, cy] of corners) {
          const oldDist = Math.abs(fx - cx) + Math.abs(fy - cy);
          const newDist = Math.abs(tx - cx) + Math.abs(ty - cy);
          if (oldDist < oldMinDist) oldMinDist = oldDist;
          if (newDist < newMinDist) newMinDist = newDist;
        }
        if (newMinDist < oldMinDist) tags.push('NURGA_POOLE_JOOKSMINE');
      }
    }

    const directions: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of directions) {
      const nx = tx + dx;
      const ny = ty + dy;
      const hx = tx + dx * 2;
      const hy = ty + dy * 2;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        const target = grid[nx][ny];
        if (target !== PieceType.None && target !== piece &&
            !(piece === PieceType.King && target === PieceType.Defender)) {
          if (hx >= 0 && hx < size && hy >= 0 && hy < size) {
            const hostile = grid[hx][hy];
            if (hostile === piece || (hx === 0 || hx === last || hy === 0 || hy === last ||
                (hx === mid && hy === mid))) {
              tags.push('SÖÖMINE');
            }
          }
        }
      }
    }

    if (aiSide === PieceType.Attacker) {
      for (const [dx, dy] of directions) {
        const nx = tx + dx;
        const ny = ty + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
          if (grid[nx][ny] === PieceType.King) tags.push('KUNINGA_PIIRAMINE');
        }
      }
    }

    if (aiSide === PieceType.Defender && piece !== PieceType.King) {
      if (Math.abs(tx - mid) <= 2 && Math.abs(ty - mid) <= 2) {
        tags.push('KAITSE_KUNINGAT');
      }
    }

    if (tx >= 3 && tx <= 7 && ty >= 3 && ty <= 7) {
      tags.push('TSENTRI_KONTROLL');
    }

    const tagsText = tags.length > 0 ? ` [${tags.join(', ')}]` : '';
    return { ...move, description: `${move.description}${tagsText}` };
  });
}

function getSmartLocalMove(legalMoves: LegalMove[], depth: number): MoveResult {
  const sorted = [...legalMoves].sort((a, b) => getMoveScore(b.description) - getMoveScore(a.description));
  if (depth === 4) return { from: sorted[0].from, to: sorted[0].to };
  const luckyMoves = sorted.slice(0, Math.min(3, sorted.length));
  const finalMove = luckyMoves[Math.floor(Math.random() * luckyMoves.length)];
  return { from: finalMove.from, to: finalMove.to };
}

export function useAI() {
  const computeBestMove = useCallback(async (
    grid: PieceType[][],
    aiSide: PieceType,
    depth: number = 3,
    getLegalMoves: (player: PieceType) => LegalMove[],
  ): Promise<MoveResult | null> => {
    const rawMoves = getLegalMoves(aiSide);
    if (rawMoves.length === 0) return null;

    const legalMoves = analyzeAndTagMoves(rawMoves, grid, aiSide);

    if (!API_KEY.startsWith('xai-') && !API_KEY.startsWith('gsk_') || API_KEY.trim() === '') {
      return getSmartLocalMove(legalMoves, depth);
    }

    const sortedMoves = [...legalMoves].sort((a, b) => getMoveScore(b.description) - getMoveScore(a.description));
    const topMoves = sortedMoves.slice(0, 12);

    const compactBoard = grid.map(row => row.join('')).join('');
    const compactMovesText = topMoves
      .map(m => `${m.id}:${m.from[0]},${m.from[1]}->${m.to[0]},${m.to[1]}(Score:${getMoveScore(m.description)})`)
      .join('|');

    const apiUrl = API_KEY.startsWith('xai-')
      ? 'https://api.x.ai/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions';
    const modelName = API_KEY.startsWith('xai-') ? 'grok-2' : 'llama-3.1-8b-instant';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: `Oled Hnefatafl (11x11 viikingite male) tark AI. Sinu eesmärk on valida parim käigu ID.\nKui mängid Kaitsjatega, on absoluutne prioriteet viia Kuningas (3) nurka (ruudud [0,0], [10,0], [0,10], [10,10]) või selle lähedale.\nLaud on esitatud 121 sümbolina (0=tühi, 1=Ründaja, 2=Kaitsja, 3=Kuningas).\n\nVasta rangelt vaid lühikeses JSON formaadis:\n{"selected_id":<number>}`,
            },
            {
              role: 'user',
              content: `B:${compactBoard}\nM:${compactMovesText}`,
            },
          ],
          temperature: 0.1,
          max_tokens: 15,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return getSmartLocalMove(legalMoves, depth);

      const aiReply = JSON.parse(content);
      const selectedId = aiReply.selected_id;
      const finalMove = legalMoves.find(m => m.id === selectedId);
      if (finalMove) return { from: finalMove.from, to: finalMove.to };
    } catch {
      // fallback to local
    }

    return getSmartLocalMove(legalMoves, depth);
  }, []);

  return { computeBestMove };
}
