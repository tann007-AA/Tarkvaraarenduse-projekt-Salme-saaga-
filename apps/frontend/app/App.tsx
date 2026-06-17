import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MainMenuScreen } from './components/MainMenuScreen';
import { SettingsModal } from './components/SettingsModal';
import { StartScreen } from './components/StartScreen';
import { TutorialModal } from './components/TutorialModal';
import { SailingTransition } from './components/SailingTransition';
import { Toaster, toast } from 'sonner';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Settings, ShoppingBag } from 'lucide-react';
import { GameModeSelectScreen } from './components/story/GameModeSelectScreen';
import { StoryLevel } from './components/story/StoryIsland';
import { HouseScene } from './components/story/housescene';

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
  const [currentStoryIsland, setCurrentStoryIsland] = useState<StoryIsland>('rootsi');
  const [showHouseScene, setShowHouseScene] = useState(true);

  const handleGuideClick = () => {
    setShowGuideModal(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };


  const handleReturnToMenu = () => {
    setGameState('menu');
    setCurrentStoryIsland('rootsi');
    setShowHouseScene(true);
  };


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
              setCurrentStoryIsland('rootsi');
              setShowHouseScene(true);
            }
          }}
          onBack={() => setGameState('menu')}
        />
      )}


      {/* STORY MODE – maja enne esimest saart */}
      {gameState === 'story-mode' &&
        (showHouseScene ? (
          <HouseScene
            onBackToMenu={() => setGameState('mode-select')}
            onExitHouse={() => setShowHouseScene(false)}
          />
        ) : (
          <StoryLevel
            currentIsland={currentStoryIsland}
            onBackToMenu={() => setGameState('mode-select')}
            onGoToIsland={setCurrentStoryIsland}
            onEnterHouse={() => setShowHouseScene(true)}
          />
        ))}


      {/* HNEFATAFL LAUAMÄNG */}
      {gameState === 'hnefatafl-local' && (
        <div className="p-8 text-center bg-stone-950 min-h-screen flex flex-col justify-center items-center">
          <h2 className="text-2xl font-serif text-[#dfc18d] mb-4">⚔️ Hnefatafl ⚔️</h2>
          <p className="text-stone-400 mb-4">Siia tuleb kohalik kahe mängija lauamäng.</p>
          <button onClick={() => setGameState('mode-select')} className="px-4 py-2 bg-stone-800 rounded">
            Tagasi režiimi valikusse
          </button>
        </div>
      )}

      {/* Guide Modal */}
      {showGuideModal && (
        <TutorialModal onClose={() => setShowGuideModal(false)} />
      )}


      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onReturnToMenu={gameState !== 'menu' ? handleReturnToMenu : undefined}
        />
      )}

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
        <GameContent />
      </LanguageProvider>
    </AuthProvider>
  );
}