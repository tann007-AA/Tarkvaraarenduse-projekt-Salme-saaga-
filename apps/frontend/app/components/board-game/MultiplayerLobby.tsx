import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { BoardGameMultiplayerService, type Player, type GameSession } from '../../services/boardGameMultiplayer';
import { useLanguage } from '../../i18n/LanguageContext';
import { OceanBackground } from '../OceanBackground';

interface MultiplayerLobbyProps {
  onGameStarted: (session: GameSession) => void;
  onBack: () => void;
}

export function MultiplayerLobby({ onGameStarted, onBack }: MultiplayerLobbyProps) {
  const { t } = useLanguage();
  const [player, setPlayer] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [showAuth, setShowAuth] = useState(true);
  const [lobbyCode, setLobbyCode] = useState('');
  const [statusText, setStatusText] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const service = useRef(BoardGameMultiplayerService.getInstance());

  useEffect(() => {
    const existing = service.current.getPlayer();
    if (existing) {
      setPlayer(existing);
      setShowAuth(false);
    }
  }, []);

  const handleCreatePlayer = useCallback(async () => {
    if (!name.trim()) return;
    try {
      const p = await service.current.createPlayer(name.trim());
      setPlayer(p);
      setShowAuth(false);
    } catch (e) {
      alert(t.boardGame.multiplayer.failedCreatePlayer);
    }
  }, [name, t]);

  const handleHost = useCallback(async () => {
    try {
      const lobby = await service.current.createLobby();
      setLobbyCode(lobby.code);
      setIsHost(true);
      setStatusText(t.boardGame.multiplayer.waitingOpponent);

      service.current.connectToLobby(
        (event, data) => {
          if (event === 'lobby:player_joined') {
            setStatusText(t.boardGame.multiplayer.opponentJoined.replace('{name}', data.name || ''));
            setShowStartBtn(true);
          } else if (event === 'lobby:player_left') {
            setStatusText(t.boardGame.multiplayer.opponentLeft);
            setShowStartBtn(false);
          } else if (event === 'game:started') {
            service.current.disconnectLobby();
            onGameStarted(data);
          } else if (event === 'error') {
            alert(`${t.boardGame.multiplayer.error}: ${data.message}`);
          } else if (event === 'lobby:ready') {
            setStatusText(t.boardGame.multiplayer.lobbyReady);
          }
        },
        () => {
          // connected
        },
        lobby.code,
      );
    } catch (e) {
      alert(t.boardGame.multiplayer.failedCreateLobby);
    }
  }, [onGameStarted, t]);

  const handleJoin = useCallback(() => {
    if (!joinCode.trim()) return;
    const code = joinCode.trim();
    setIsHost(false);
    setStatusText(t.boardGame.multiplayer.joinedLobby);

    service.current.connectToLobby(
      (event, data) => {
        if (event === 'lobby:joined') {
          setStatusText(t.boardGame.multiplayer.joinedLobby);
        } else if (event === 'game:started') {
          service.current.disconnectLobby();
          onGameStarted(data);
        } else if (event === 'error') {
          alert(`${t.boardGame.multiplayer.error}: ${data.message}`);
        } else if (event === 'authenticated') {
          service.current.emitLobby('lobby:join', { code });
        }
      },
      undefined,
      undefined,
    );
  }, [joinCode, onGameStarted, t]);

  const handleStart = useCallback(() => {
    service.current.emitLobby('lobby:start');
  }, []);

  const panelClass =
    'relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center shadow-2xl';
  const inputClass =
    'w-full p-3 rounded-lg border-2 border-[#d4a574]/30 bg-[#f4ede1]/90 text-[#1e4d5f] placeholder-[#6b7280] focus:outline-none focus:border-[#d4a574]';
  const buttonBase =
    'group relative w-full px-6 py-3 rounded-xl border-4 shadow-2xl hover:scale-105 transition-all duration-300';
  const overlay =
    'absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300';
  const labelClass = 'relative text-base font-bold text-white';
  const panelMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  };

  if (showAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <OceanBackground />

        <motion.div className={panelClass} {...panelMotion}>
          <h2
            className="text-white text-2xl font-bold mb-5 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.boardGame.multiplayer.welcome}
          </h2>

          <input
            type="text"
            placeholder={t.boardGame.multiplayer.namePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
            className={`${inputClass} mb-4`}
            onKeyDown={e => e.key === 'Enter' && handleCreatePlayer()}
          />

          <button
            onClick={handleCreatePlayer}
            className={`${buttonBase} bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] hover:shadow-[#d4a574]/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.multiplayer.createPlayer}</span>
          </button>

          <button
            onClick={onBack}
            className={`${buttonBase} mt-3 bg-gradient-to-b from-[#6b7280] to-[#4b5563] border-[#374151] hover:shadow-[#6b7280]/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.multiplayer.back}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (lobbyCode || statusText) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <OceanBackground />

        <motion.div className={panelClass} {...panelMotion}>
          <h3 className="text-white text-lg font-bold mb-3">
            {t.boardGame.multiplayer.lobbyTitle}: {lobbyCode}
          </h3>
          <p className="text-[#f4ede1] mb-4">{statusText}</p>

          {isHost && showStartBtn && (
            <button
              onClick={handleStart}
              className={`${buttonBase} mb-3 bg-gradient-to-b from-green-600 to-green-700 border-green-800 hover:shadow-green-600/50`}
            >
              <div className={overlay} />
              <span className={labelClass}>{t.boardGame.multiplayer.startGame}</span>
            </button>
          )}

          <button
            onClick={onBack}
            className={`${buttonBase} bg-gradient-to-b from-[#6b7280] to-[#4b5563] border-[#374151] hover:shadow-[#6b7280]/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.multiplayer.cancel}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <OceanBackground />

      <motion.div className={panelClass} {...panelMotion}>
        <h2
          className="text-white text-2xl font-bold mb-5 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.boardGame.multiplayer.menuTitle}
        </h2>

        <button
          onClick={handleHost}
          className={`${buttonBase} mb-4 bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] hover:shadow-[#d4a574]/50`}
        >
          <div className={overlay} />
          <span className={labelClass}>{t.boardGame.multiplayer.createGame}</span>
        </button>

        <div className="flex flex-col gap-2.5 items-center mt-5">
          <input
            type="text"
            placeholder={t.boardGame.multiplayer.lobbyCodePlaceholder}
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            className={`${inputClass} w-[180px] text-center`}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <button
            onClick={handleJoin}
            className={`${buttonBase} bg-gradient-to-b from-[#3d7a8f] to-[#2a5c6f] border-[#1e4d5f] hover:shadow-[#3d7a8f]/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.multiplayer.joinGame}</span>
          </button>
        </div>

        <button
          onClick={onBack}
          className={`${buttonBase} mt-4 bg-gradient-to-b from-[#6b7280] to-[#4b5563] border-[#374151] hover:shadow-[#6b7280]/50`}
        >
          <div className={overlay} />
          <span className={labelClass}>{t.boardGame.multiplayer.back}</span>
        </button>
      </motion.div>
    </div>
  );
}
