import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PieceType, Difficulty } from './types';
import { useGameEngine } from './useGameEngine';
import { useAI } from './useAI';
import { Board } from './Board';
import { DifficultySelector } from './DifficultySelector';
import { SideSelector } from './SideSelector';
import { MultiplayerLobby } from './MultiplayerLobby';
import { BoardGameMultiplayerService, type GameSession } from '../../services/boardGameMultiplayer';
import { useLanguage } from '../../i18n/LanguageContext';
import { OceanBackground } from '../OceanBackground';

type BoardGameState = 'menu' | 'difficulty' | 'side-select' | 'playing' | 'multiplayer';

export function BoardGameScreen({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const engine = useGameEngine();
  const { computeBestMove } = useAI();
  const [gameState, setGameState] = useState<BoardGameState>('menu');
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [aiSide, setAiSide] = useState<PieceType>(PieceType.None);
  const [aiDifficulty, setAiDifficulty] = useState<number>(3);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Multiplayer state
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [playerRole, setPlayerRole] = useState<'attacker' | 'defender' | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const multiplayerService = BoardGameMultiplayerService.getInstance();

  const handleMenuSinglePlayer = useCallback(() => {
    setGameState('difficulty');
  }, []);

  const handleMenuMultiplayer = useCallback(() => {
    setIsMultiplayer(true);
    setGameState('multiplayer');
  }, []);

  const handleDifficultySelect = useCallback((difficulty: Difficulty) => {
    setAiDifficulty(difficulty);
    setGameState('side-select');
  }, []);

  const makeAIMoveRef = useRef<() => Promise<void>>();

  useEffect(() => {
    if (isMultiplayer) return;
    if (gameState !== 'playing') return;
    if (aiSide === PieceType.None) return;
    if (engine.gameOver || isAiThinking) return;
    if (engine.currentPlayer !== aiSide) return;

    const timer = setTimeout(() => makeAIMoveRef.current?.(), 600);
    return () => clearTimeout(timer);
  }, [gameState, isMultiplayer, aiSide, engine.currentPlayer, engine.gameOver, isAiThinking]);

  makeAIMoveRef.current = useCallback(async () => {
    if (engine.gameOver || isAiThinking || aiSide === PieceType.None) return;
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

  const handleSideSelect = useCallback((side: PieceType) => {
    setAiSide(side === PieceType.Attacker ? PieceType.Defender : PieceType.Attacker);
    setGameState('playing');
    engine.reset();
  }, [engine]);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (engine.gameOver || isAiThinking) return;

    if (isMultiplayer) {
      const myRoleType = playerRole === 'attacker' ? PieceType.Attacker : PieceType.Defender;
      if (engine.currentPlayer !== myRoleType) return;
    }

    const piece = engine.grid[x][y];

    if (selectedPiece === null) {
      if (piece === engine.currentPlayer || (engine.currentPlayer === PieceType.Defender && piece === PieceType.King)) {
        setSelectedPiece([x, y]);
      }
    } else {
      const [fx, fy] = selectedPiece;
      const legalMoves = engine.getLegalMoves(engine.currentPlayer);
      const isLegal = legalMoves.some(m => m.from[0] === fx && m.from[1] === fy && m.to[0] === x && m.to[1] === y);

      if (isLegal) {
        if (isMultiplayer) {
          multiplayerService.emitGame('game:move', {
            fromRow: fy, fromCol: fx,
            toRow: y, toCol: x,
          });
          setSelectedPiece(null);
        } else {
          engine.makeMove(fx, fy, x, y);
          setSelectedPiece(null);
        }
      } else {
        setSelectedPiece(
          (piece === engine.currentPlayer || (engine.currentPlayer === PieceType.Defender && piece === PieceType.King))
            ? [x, y]
            : null,
        );
      }
    }
  }, [engine, selectedPiece, isMultiplayer, playerRole, isAiThinking, aiSide, multiplayerService]);

  const handleMultiplayerGameStarted = useCallback(async (session: GameSession) => {
    setIsMultiplayer(true);
    setCurrentSessionId(session.sessionId);
    setPlayerRole(session.role);
    setAiSide(PieceType.None);
    setGameState('playing');
    updateGameStateFromSession(session);

    multiplayerService.connectToGame(session.sessionId, (event, data) => {
      handleMultiplayerEvent(event, data);
    });
  }, [multiplayerService, engine]);

  const handleMultiplayerEvent = useCallback((event: string, data: any) => {
    if (event === 'game:joined' || event === 'game:state') {
      updateGameStateFromSession(data);
    } else if (event === 'game:move_made') {
      if (data.boardState) {
        const mappedGrid = mapBackendBoard(data.boardState);
        engine.setGrid(mappedGrid);
        if (data.currentTurn) {
          engine.setCurrentPlayer(data.currentTurn === 'attacker' ? PieceType.Attacker : PieceType.Defender);
        } else {
          engine.setCurrentPlayer(prev => prev === PieceType.Attacker ? PieceType.Defender : PieceType.Attacker);
        }
      }
    } else if (event === 'game:error') {
      alert(`${t.boardGame.multiplayer.error}: ${data.message}`);
    } else if (event === 'game:player_disconnected') {
      setStatusMessage(
        t.boardGame.multiplayer.disconnected.replace('{seconds}', String(data.disconnectTimeRemaining || 60))
      );
    } else if (event === 'game:player_reconnected') {
      setStatusMessage(null);
    } else if (event === 'game:ended') {
      engine.setGameOver(true);
      engine.setWinner(data.reason === 'forfeit' ? 'opponentForfeited' : 'gameOver');
    }
  }, [engine, multiplayerService, currentSessionId, t]);

  const updateGameStateFromSession = useCallback((session: any) => {
    const player = multiplayerService.getPlayer();
    if (player) {
      if (String(session.attackerId) === String(player.id)) {
        setPlayerRole('attacker');
      } else if (String(session.defenderId) === String(player.id)) {
        setPlayerRole('defender');
      }
    }

    if (session.currentTurn) {
      engine.setCurrentPlayer(session.currentTurn === 'attacker' ? PieceType.Attacker : PieceType.Defender);
    }

    if (session.boardState) {
      const mappedGrid = mapBackendBoard(session.boardState);
      engine.setGrid(mappedGrid);
    }

    if (session.status === 'ended') {
      engine.setGameOver(true);
      engine.setWinner(player ? (String(session.winnerId) === String(player.id) ? 'youWin' : 'opponentWins') : 'gameOver');
    }

    if (session.opponentDisconnected) {
      setStatusMessage(
        t.boardGame.multiplayer.disconnected.replace('{seconds}', String(session.disconnectTimeRemaining || 60))
      );
    } else {
      setStatusMessage(null);
    }

    setSelectedPiece(null);
  }, [multiplayerService, engine, t]);

  const mapBackendBoard = useCallback((backendBoard: any): PieceType[][] => {
    const size = 11;
    const newGrid: PieceType[][] = Array.from({ length: size }, () => Array(size).fill(PieceType.None));
    if (!backendBoard || !Array.isArray(backendBoard)) return newGrid;

    for (let r = 0; r < Math.min(backendBoard.length, size); r++) {
      const row = backendBoard[r];
      for (let c = 0; c < Math.min(row.length, size); c++) {
        const piece = String(row[c]).toUpperCase();
        if (piece === 'A') newGrid[c][r] = PieceType.Attacker;
        else if (piece === 'D') newGrid[c][r] = PieceType.Defender;
        else if (piece === 'K') newGrid[c][r] = PieceType.King;
        else newGrid[c][r] = PieceType.None;
      }
    }
    return newGrid;
  }, []);

  const handleReset = useCallback(() => {
    engine.reset();
    setSelectedPiece(null);
    setIsAiThinking(false);
    setStatusMessage(null);
    setGameState('menu');
    setIsMultiplayer(false);
    setPlayerRole(null);
    setCurrentSessionId(null);
    multiplayerService.disconnectGame();
    multiplayerService.disconnectLobby();
  }, [engine, multiplayerService]);

  const winnerMessages = t.boardGame.game.winner;
  const translatedWinner = engine.winner
    ? (winnerMessages[engine.winner as keyof typeof winnerMessages] ?? engine.winner)
    : '';

  const turnLabel = engine.currentPlayer === PieceType.Attacker
    ? t.boardGame.game.attackers
    : t.boardGame.game.defenders;
  const roleLabel = playerRole === 'attacker'
    ? t.boardGame.game.attackers
    : t.boardGame.game.defenders;

  let turnStatus: string | null = null;
  if (isMultiplayer && playerRole) {
    turnStatus = `${t.boardGame.game.turn}: ${turnLabel} (${t.boardGame.game.youAre}: ${roleLabel})`;
  } else if (isAiThinking) {
    turnStatus = t.boardGame.game.aiThinking;
  } else if (engine.gameOver) {
    turnStatus = translatedWinner;
  } else {
    turnStatus = `${t.boardGame.game.turn}: ${turnLabel}`;
  }

  const primaryButtonClass =
    'group relative w-full px-8 py-4 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-xl border-4 border-[#8b6f47] shadow-2xl hover:shadow-[#d4a574]/50 hover:scale-105 transition-all duration-300';
  const secondaryButtonClass =
    'group relative w-full px-8 py-4 bg-gradient-to-b from-[#3d7a8f] to-[#2a5c6f] rounded-xl border-4 border-[#1e4d5f] shadow-2xl hover:shadow-[#3d7a8f]/50 hover:scale-105 transition-all duration-300';
  const backButtonClass =
    'group relative w-full px-8 py-3 bg-gradient-to-b from-[#6b7280] to-[#4b5563] rounded-xl border-4 border-[#374151] shadow-2xl hover:shadow-[#6b7280]/50 hover:scale-105 transition-all duration-300';

  const buttonContent = (text: string) => (
    <>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300" />
      <span className="relative text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
        {text}
      </span>
    </>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4">
      <OceanBackground />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-6"
      >
        <h1
          className="text-4xl md:text-5xl text-white drop-shadow-2xl mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.boardGame.title}
        </h1>
        <p
          className="text-lg md:text-xl text-[#d4a574] drop-shadow-lg"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t.boardGame.subtitle}
        </p>
      </motion.div>

      {gameState === 'menu' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center shadow-2xl"
        >
          <div className="space-y-4">
            <button onClick={handleMenuSinglePlayer} className={primaryButtonClass}>
              {buttonContent(t.boardGame.menu.singlePlayer)}
            </button>
            <button onClick={handleMenuMultiplayer} className={secondaryButtonClass}>
              {buttonContent(t.boardGame.menu.multiplayer)}
            </button>
            <button onClick={onBack} className={backButtonClass}>
              {buttonContent(t.boardGame.menu.backToMainMenu)}
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'difficulty' && (
        <DifficultySelector
          onSelect={handleDifficultySelect}
          onBack={() => setGameState('menu')}
        />
      )}

      {gameState === 'side-select' && (
        <SideSelector
          onSelect={handleSideSelect}
          onBack={() => setGameState('difficulty')}
        />
      )}

      {gameState === 'multiplayer' && (
        <MultiplayerLobby
          onGameStarted={handleMultiplayerGameStarted}
          onBack={() => setGameState('menu')}
        />
      )}

      {gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-full">
            <span className="text-[#f4ede1] text-sm font-medium">
              {turnStatus}
            </span>
          </div>

          <Board
            grid={engine.grid}
            selectedPiece={selectedPiece}
            onCellClick={handleCellClick}
            gameOver={engine.gameOver}
            winner={translatedWinner}
            statusMessage={statusMessage}
          />

          <button onClick={handleReset} className={backButtonClass}>
            {buttonContent(t.boardGame.game.mainMenu)}
          </button>
        </motion.div>
      )}
    </div>
  );
}
