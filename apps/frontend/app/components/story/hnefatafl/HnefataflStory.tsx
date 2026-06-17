import { useCallback, useEffect, useRef, useState } from 'react';
import { PieceType } from '../../board-game/types';
import { useGameEngine } from '../../board-game/useGameEngine';
import { Board } from '../../board-game/Board';
import { useAI } from '../../board-game/useAI';
import { ChoiceBox } from '../ChoiceBox';
import './HnefataflStory.css';

interface HnefataflStoryProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function HnefataflStory({ isOpen, onComplete }: HnefataflStoryProps) {
  const engine = useGameEngine();
  const { computeBestMove } = useAI();
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerSide] = useState<PieceType>(PieceType.Defender);
  const [aiSide] = useState<PieceType>(PieceType.Attacker);
  const [aiDifficulty] = useState<number>(3);
  const [hasStarted, setHasStarted] = useState(false);

  const makeAIMoveRef = useRef<() => Promise<void>>();

  useEffect(() => {
    if (!isOpen) return;
    if (!hasStarted) {
      engine.reset();
      setSelectedPiece(null);
      setIsAiThinking(false);
      setHasStarted(true);
    }
  }, [isOpen, hasStarted, engine]);

  useEffect(() => {
    if (!isOpen || !hasStarted) return;
    if (engine.gameOver || isAiThinking || engine.currentPlayer !== aiSide) return;

    const timer = setTimeout(() => makeAIMoveRef.current?.(), 600);
    return () => clearTimeout(timer);
  }, [isOpen, hasStarted, engine, isAiThinking, aiSide]);

  makeAIMoveRef.current = useCallback(async () => {
    if (engine.gameOver || isAiThinking || engine.currentPlayer !== aiSide) return;
    setIsAiThinking(true);

    try {
      const move = await computeBestMove(engine.grid, aiSide, aiDifficulty, engine.getLegalMoves);
      if (move) {
        engine.makeMove(move.from[0], move.from[1], move.to[0], move.to[1]);
      }
    } catch (e) {
      console.error('AI move failed:', e);
    } finally {
      setIsAiThinking(false);
    }
  }, [engine, aiDifficulty, aiSide, isAiThinking, computeBestMove]);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (engine.gameOver || isAiThinking || engine.currentPlayer !== playerSide) return;

      const piece = engine.grid[x][y];

      if (selectedPiece === null) {
        if (piece === engine.currentPlayer || (engine.currentPlayer === PieceType.Defender && piece === PieceType.King)) {
          setSelectedPiece([x, y]);
        }
      } else {
        const [fx, fy] = selectedPiece;
        const legalMoves = engine.getLegalMoves(engine.currentPlayer);
        const isLegal = legalMoves.some(
          (m) => m.from[0] === fx && m.from[1] === fy && m.to[0] === x && m.to[1] === y
        );

        if (isLegal) {
          engine.makeMove(fx, fy, x, y);
          setSelectedPiece(null);
        } else {
          setSelectedPiece(
            piece === engine.currentPlayer || (engine.currentPlayer === PieceType.Defender && piece === PieceType.King)
              ? [x, y]
              : null
          );
        }
      }
    },
    [engine, selectedPiece, playerSide, isAiThinking]
  );

  const handleContinue = () => {
    setHasStarted(false);
    onComplete();
  };

  if (!isOpen) return null;

  const turnLabel = engine.currentPlayer === PieceType.Attacker ? 'Ründajad' : 'Kaitsjad';
  const statusText = engine.gameOver
    ? engine.winner === 'defendersWinEscaped' || engine.winner === 'defendersWinSurrounded'
      ? '🎉 Võitsid! Kuningas pääses!'
      : '💀 Kaotasid. Kuningas langes.'
    : isAiThinking
      ? 'Vastane mõtleb...'
      : `Sinu käik (${turnLabel})`;

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" />

      <div className="leather-panel hnefatafl-story-panel">
        <div className="panel-content">
          <div className="panel-title">⚔️ Hnefatafl</div>
          <div className="panel-subtitle">Võida või õpi</div>

          <div className="longhouse-section hnefatafl-section">
            <div className="kitchen-header">
              <span className="fire-icon">⚔️</span>
              <h3>VIKINGITE LAUAMÄNG</h3>
            </div>

            <div className="recipe-info">
              <strong>Sinu ülesanne:</strong> aita kuningal põgeneda. Liiguta oma
              nuppe ruutude kaupa — vertikaalselt või horisontaalselt. Võta vastase
              nupp kinni, kui piirid ta ära kahe oma nupuga.
            </div>

            <div className="hnefatafl-status">{statusText}</div>

            <div className="hnefatafl-board-wrap">
              <Board
                grid={engine.grid}
                selectedPiece={selectedPiece}
                onCellClick={handleCellClick}
                gameOver={engine.gameOver}
                winner={
                  engine.winner === 'defendersWinEscaped' || engine.winner === 'defendersWinSurrounded'
                    ? 'Kaitsjad võitsid!'
                    : 'Ründajad võitsid!'
                }
              />
            </div>

            {engine.gameOver && (
              <div className="hnefatafl-result">
                <ChoiceBox
                  options={[
                    { id: 'continue', label: 'Jätka' },
                  ]}
                  onSelect={handleContinue}
                  selectedId={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
