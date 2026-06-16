import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MainMenuScreen } from './components/MainMenuScreen';
import { SettingsModal } from './components/SettingsModal';
import { StartScreen } from './components/StartScreen';
import { TutorialModal } from './components/TutorialModal';
import { Island } from './components/Island';
import { QuizScreen } from './components/QuizScreen';
import { RetryModal } from './components/RetryModal';
import { EndScreen } from './components/EndScreen';
import { SailingTransition } from './components/SailingTransition';
import { ProgressBar } from './components/ProgressBar';
import { Toaster, toast } from 'sonner';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Settings, ShoppingBag } from 'lucide-react';
import { ShopModal } from './components/ShopModal';
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
  const [currentIslandIndex, setCurrentIslandIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [completedIslands, setCompletedIslands] = useState<number[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hasShip, setHasShip] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);
  const [retryAnswers, setRetryAnswers] = useState<{ [key: number]: number }>({});
  const [inventory, setInventory] = useState<ArtifactType[]>([]);
  const [collectedArtifacts, setCollectedArtifacts] = useState<number[]>([]);
  const [currentScore, setCurrentScore] = useState<number | undefined>(undefined);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [savedPlayerPosition, setSavedPlayerPosition] = useState<{ x: number; y: number } | null>(null);
  const [points, setPoints] = useState(0);


  // Story mode state
  const [currentStoryIsland, setCurrentStoryIsland] = useState<StoryIsland>('rootsi');
  const [showHouseScene, setShowHouseScene] = useState(true);




  const handleArtifactCollect = (artifactIdx: number, artifactType: ArtifactType) => {
    if (!collectedArtifacts.includes(artifactIdx)) {
      setCollectedArtifacts([...collectedArtifacts, artifactIdx]);
      setInventory([...inventory, artifactType]);
      toast.success('Artifact found! Added to inventory 🎁', { duration: 2000 });
    }
  };


  const handleUseArtifact = (artifactType: ArtifactType) => {
    const index = inventory.indexOf(artifactType);
    if (index > -1) {
      const newInventory = [...inventory];
      newInventory.splice(index, 1);
      setInventory(newInventory);
    }
  };


  const handleQuestionTrigger = (questionIdx: number, playerPos: { x: number; y: number }) => {
    if (userAnswers[questionIdx] === undefined) {
      setSavedPlayerPosition(playerPos);
      setCurrentQuestionIndex(questionIdx);
      setGameState('quiz');
    }
  };



  const handleRetryAnswer = (questionIndex: number, answerIndex: number) => {
    setRetryAnswers({ ...retryAnswers, [questionIndex]: answerIndex });
  };




  const handleSailingComplete = () => {
    setCurrentIslandIndex(currentIslandIndex + 1);
    setCurrentQuestionIndex(null);
    setUserAnswers({});
    setCurrentScore(undefined);
    setSavedPlayerPosition(null);
    setGameState('island-select');
  };

  const handleGuideClick = () => {
    setShowGuideModal(true);
  };


  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleStartGame = () => {
    setSavedPlayerPosition(null);
    setGameState('island-select');
  };


  const handleTutorialComplete = () => {
    setHasSeenTutorial(true);
  };





  const handleReturnToMenu = () => {
    setGameState('menu');
    setCurrentIslandIndex(0);
    setCurrentQuestionIndex(null);
    setUserAnswers({});
    setCompletedIslands([]);
    setFailedAttempts(0);
    setHasShip(false);
    setWrongQuestions([]);
    setRetryAnswers({});
    setInventory([]);
    setCollectedArtifacts([]);
    setHasSeenTutorial(false);
    setSavedPlayerPosition(null);
    setCurrentStoryIsland('rootsi');
    setShowHouseScene(true);
  };


  const handleRestart = () => {
    handleReturnToMenu();
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




      {/* Story Intro Screen */}
      {gameState === 'intro' && (
        <StartScreen onStart={handleStartGame} />
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



      {gameState === 'sailing' && (
        <SailingTransition onComplete={handleSailingComplete} />
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