import { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { MainMenuScreen } from './components/MainMenuScreen';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { Toaster } from 'sonner';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioProvider'; // ← ADD THIS IMPORT
import { Settings } from 'lucide-react';
import { GameModeSelectScreen } from './components/story/GameModeSelectScreen';
import { StoryLevel } from './components/story/StoryIsland';
import { BoardGameScreen } from './components/board-game/BoardGameScreen';
import { HouseScene } from './components/story/HouseScene';
import { BeachScene } from './components/story/beach/BeachScene';
import { EndCredits } from './components/story/EndCredits';
import { loadStoryProgress, saveStoryProgress, resetStoryProgress, patchStoryProgress, getIslandCheckpointCount, updateIslandCheckpoint } from './components/story/progress';

// Island story type
type StoryIsland = 'rootsi' | 'gotland' | 'saaremaa';

// Artifact types for lifelines
export type ArtifactType = 'sword' | 'shield' | 'knife' | 'dice' | 'gaming-piece';

export interface Artifact {
  type: ArtifactType;
  name: string;
  description: string;
}

type GameState = 'intro' | 'menu' | 'island-select' | 'quiz' | 'sailing' | 'retry' | 'end' | 'mode-select' | 'story-mode' | 'hnefatafl-local';

function GameContent() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [points, setPoints] = useState(0);

  // Story mode state
  const [currentStoryIsland, setCurrentStoryIsland] = useState<StoryIsland>(() => {
    const saved = loadStoryProgress();
    return saved?.currentStoryIsland ?? 'rootsi';
  });
  const [showHouseScene, setShowHouseScene] = useState(() => {
    const saved = loadStoryProgress();
    return saved?.housePhase !== 'done';
  });
  const [showBeachScene, setShowBeachScene] = useState(false);
  const [completedBeachIslands, setCompletedBeachIslands] = useState<Set<StoryIsland>>(() => {
    const saved = loadStoryProgress();
    return new Set(saved?.completedBeachIslands ?? []);
  });
  const [storyRewards, setStoryRewards] = useState<string[]>([]);
  const [showEndCredits, setShowEndCredits] = useState(false);

  const handleStoryRewardCollect = (rewardId: string) => {
    setStoryRewards((current) =>
      current.includes(rewardId) ? current : [...current, rewardId]
    );
  };

  const saveIslandProgress = (island: StoryIsland, completedBeaches: Set<StoryIsland>) => {
    patchStoryProgress({
      currentStoryIsland: island,
      completedBeachIslands: Array.from(completedBeaches),
    });
  };

  const handleCheckpointComplete = useCallback((island: StoryIsland, count: number) => {
    updateIslandCheckpoint(island, count);
  }, []);

  const handleGuideClick = () => {
    setShowGuideModal(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    setShowBeachScene(false);
    setShowEndCredits(false);
  };

  const handleResetProgress = () => {
    resetStoryProgress();
    setCurrentStoryIsland('rootsi');
    setShowHouseScene(true);
    setShowBeachScene(false);
    setShowEndCredits(false);
    setCompletedBeachIslands(new Set());
    setStoryRewards([]);
    setPoints(0);
    setGameState('menu');
    setShowSettingsModal(false);
  };

  const onGoToBeach = useCallback(() => {
    if (!completedBeachIslands.has(currentStoryIsland)) {
      setShowBeachScene(true);
    }
  }, [completedBeachIslands, currentStoryIsland]);

  return (
    <div className="size-full min-h-screen overflow-auto">
      <Toaster position="bottom-center" richColors />

      {/* Main Menu */}
      {gameState === 'menu' && (
        <MainMenuScreen
          onPlay={() => setGameState('mode-select')}
          onGuide={handleGuideClick}
          onSettings={handleSettingsClick}
        />
      )}

      {/* REŽIIMI VALIK */}
      {gameState === 'mode-select' && (
        <GameModeSelectScreen
          onSelectMode={(mode) => {
            setGameState(mode);
            if (mode === 'story-mode') {
              const saved = loadStoryProgress();
              if (saved) {
                setCurrentStoryIsland(saved.currentStoryIsland ?? 'rootsi');
                setCompletedBeachIslands(new Set(saved.completedBeachIslands ?? []));
                setShowHouseScene(saved.housePhase !== 'done');
              } else {
                resetStoryProgress();
                setCurrentStoryIsland('rootsi');
                setShowHouseScene(true);
                setCompletedBeachIslands(new Set());
              }
              setShowBeachScene(false);
            }
          }}
          onBack={() => setGameState('menu')}
        />
      )}

      {/* STORY MODE – maja → saar, laadimismäng käivitub viikingilaeva juures */}
      {gameState === 'story-mode' &&
        (showHouseScene ? (
          <HouseScene
            onBackToMenu={() => setGameState('mode-select')}
            onExitHouse={() => {
              setShowHouseScene(false);
              saveIslandProgress(currentStoryIsland, completedBeachIslands);
            }}
            onRewardCollect={handleStoryRewardCollect}
            onOpenSettings={() => setShowSettingsModal(true)}
            storyRewards={storyRewards}
          />
        ) : (
          <>
            <StoryLevel
              currentIsland={currentStoryIsland}
              completedBeachIslands={completedBeachIslands}
              onBackToMenu={() => setGameState('mode-select')}
              onGoToIsland={(island) => {
                setCurrentStoryIsland(island);
                saveIslandProgress(island, completedBeachIslands);
              }}
              onCompleteIsland={(island) => {
                if ((island as string) === 'end') {
                  setShowEndCredits(true);
                } else {
                  setCurrentStoryIsland(island);

                  setCompletedBeachIslands((prev) => {
                    const next = new Set(prev).add(currentStoryIsland);
                    saveIslandProgress(island, next);
                    return next;
                  });
                }
              }}
              onGoToBeach={onGoToBeach}
              initialCheckpointCount={getIslandCheckpointCount(currentStoryIsland)}
              onCheckpointComplete={handleCheckpointComplete}
              isPaused={showBeachScene || showEndCredits}
              storyRewards={storyRewards}
              onStoryRewardCollect={handleStoryRewardCollect}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
            {showBeachScene && (
              <div className="fixed inset-0 z-50">
                <BeachScene
                  onBackToMenu={() => setGameState('mode-select')}
                  onExitBeach={() => {
                    setShowBeachScene(false);
                    setCompletedBeachIslands((prev) => {
                      const next = new Set(prev).add(currentStoryIsland);

                      // Auto-advance from Rootsi to Gotland after beach
                      if (currentStoryIsland === 'rootsi') {
                        setCurrentStoryIsland('gotland');
                        saveIslandProgress('gotland', next);
                      } else {
                        saveIslandProgress(currentStoryIsland, next);
                      }

                      return next;
                    });
                  }}
                  onRewardCollect={handleStoryRewardCollect}
                />
              </div>
            )}
            {showEndCredits && (
              <EndCredits onComplete={() => {
                setShowEndCredits(false);
                handleResetProgress();
              }} />
            )}
          </>
        ))}

      {/* HNEFATAFL LAUAMÄNG – SEOTUD TEIE PÄRIS KOMPONENTIDEGA */}
      {gameState === 'hnefatafl-local' && (
        <BoardGameScreen onBack={() => setGameState('mode-select')} />
      )}

      {/* Guide Modal */}
      {showGuideModal && (
        <TutorialModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
            onReturnToMenu={gameState !== 'menu' ? handleReturnToMenu : undefined}
            onResetProgress={handleResetProgress}
          />
        )}
      </AnimatePresence>

      {/* In-game Settings and Shop Buttons */}
      {(gameState === 'island-select' || gameState === 'quiz') && (
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#b8860b] px-4 py-2 rounded-full border-3 border-[#f4ede1] shadow-2xl">
            <span className="text-xl md:text-2xl">💰</span>
            <span className="text-white font-bold text-lg md:text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
              {points}
            </span>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-12 h-12 bg-gradient-to-br from-[#8b6f47] to-[#6b5437] hover:from-[#6b5437] hover:to-[#8b6f47] rounded-full border-3 border-[#f4ede1] shadow-2xl flex items-center justify-center transition-all hover:scale-110"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AudioProvider> {/* ← ADDED: Wraps GameContent with AudioProvider */}
          <GameContent />
        </AudioProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}