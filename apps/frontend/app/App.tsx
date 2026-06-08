import { useState } from 'react';
import { MainMenuScreen } from './components/MainMenuScreen';
import { LoginModal, LoginData } from './components/LoginModal';
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
import { Settings, ShoppingBag } from 'lucide-react';
import { ShopModal } from './components/ShopModal';

// Artifact types for lifelines
export type ArtifactType = 'sword' | 'shield' | 'knife' | 'dice' | 'gaming-piece';

export interface Artifact {
  type: ArtifactType;
  name: string;
  description: string;
}

// Island data generator function that uses translations
const getIslandData = (t: any) => [
  {
    id: 1,
    name: t.islands.mjolnirIsle,
    theme: "Norse Mythology",
    questions: t.mjolnirQuestions || [
      {
        question: "Who is the father of Thor in Norse mythology?",
        answers: ["Odin", "Loki", "Freyr", "Balder"],
        correct: 0
      },
      {
        question: "What is the name of Thor's hammer?",
        answers: ["Gungnir", "Mjölnir", "Gram", "Tyrfing"],
        correct: 1
      },
      {
        question: "Which tree connects the nine worlds in Norse cosmology?",
        answers: ["Oak of Ages", "Yggdrasil", "World Pine", "Cosmic Ash"],
        correct: 1
      },
      {
        question: "Who is the trickster god in Norse mythology?",
        answers: ["Heimdall", "Tyr", "Loki", "Freyr"],
        correct: 2
      },
      {
        question: "What is Valhalla?",
        answers: ["A sacred forest", "Hall of the slain warriors", "A mountain", "A sacred ship"],
        correct: 1
      },
      {
        question: "Who guards the Bifrost bridge?",
        answers: ["Odin", "Thor", "Heimdall", "Freya"],
        correct: 2
      },
      {
        question: "What are the Valkyries?",
        answers: ["Female warriors who choose the slain", "Sea monsters", "Giant ravens", "Magic wolves"],
        correct: 0
      },
      {
        question: "What will bring about Ragnarök?",
        answers: ["The breaking of chains", "Fimbulwinter", "The death of Odin", "All of the above"],
        correct: 3
      },
      {
        question: "Who is the goddess of love and beauty?",
        answers: ["Freya", "Frigg", "Sif", "Idunn"],
        correct: 0
      },
      {
        question: "What creatures pull Thor's chariot?",
        answers: ["Wolves", "Eagles", "Goats", "Horses"],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    name: t.islands.dragonshipBay,
    theme: "Viking Ships & Navigation",
    questions: t.dragonshipQuestions || [
      {
        question: "What was the most famous type of Viking ship?",
        answers: ["Knarr", "Longship", "Karve", "Faering"],
        correct: 1
      },
      {
        question: "How did Vikings navigate at sea?",
        answers: ["Compasses", "Sun stones and stars", "Maps only", "Following birds"],
        correct: 1
      },
      {
        question: "What was a Viking ship's dragon head for?",
        answers: ["Navigation", "Intimidation and protection", "Decoration only", "Weather prediction"],
        correct: 1
      },
      {
        question: "Which wood was commonly used for Viking ships?",
        answers: ["Pine", "Oak", "Both oak and pine", "Birch"],
        correct: 2
      },
      {
        question: "What is a knarr?",
        answers: ["A war ship", "A merchant vessel", "A rowing boat", "A fishing boat"],
        correct: 1
      },
      {
        question: "How many oars did a typical longship have?",
        answers: ["10-20", "20-40", "40-60", "60-80"],
        correct: 1
      },
      {
        question: "What was the Viking ship's sail typically made of?",
        answers: ["Silk", "Cotton", "Wool", "Linen"],
        correct: 2
      },
      {
        question: "Vikings reached which distant land around 1000 CE?",
        answers: ["Australia", "North America", "Antarctica", "Japan"],
        correct: 1
      },
      {
        question: "What is clinker building?",
        answers: ["A type of sail", "Overlapping planks method", "A navigation technique", "A type of anchor"],
        correct: 1
      },
      {
        question: "What was the average length of a Viking longship?",
        answers: ["10-15 meters", "20-30 meters", "40-50 meters", "60-70 meters"],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    name: t.islands.runeRock,
    theme: "Viking Culture & History",
    questions: t.runeRockQuestions || [
      {
        question: "What alphabet did Vikings use?",
        answers: ["Latin", "Runic (Futhark)", "Cyrillic", "Greek"],
        correct: 1
      },
      {
        question: "What was a Viking's primary weapon?",
        answers: ["Sword", "Axe", "Spear", "Bow"],
        correct: 2
      },
      {
        question: "Vikings came from which regions?",
        answers: ["Scandinavia", "Germany", "Britain", "Russia"],
        correct: 0
      },
      {
        question: "What was a 'Thing' in Viking society?",
        answers: ["A weapon", "An assembly or council", "A ship", "A feast"],
        correct: 1
      },
      {
        question: "Viking Age is generally dated as:",
        answers: ["500-800 CE", "793-1066 CE", "1000-1200 CE", "600-900 CE"],
        correct: 1
      },
      {
        question: "What was a berserker?",
        answers: ["A type of ship", "A fierce warrior", "A merchant", "A craftsman"],
        correct: 1
      },
      {
        question: "Vikings were also known as:",
        answers: ["Norsemen", "Celts", "Saxons", "Picts"],
        correct: 0
      },
      {
        question: "What event marks the start of the Viking Age?",
        answers: ["Battle of Hastings", "Raid on Lindisfarne", "Discovery of Iceland", "Founding of Dublin"],
        correct: 1
      },
      {
        question: "Viking warriors sought to die in battle to reach:",
        answers: ["Hel", "Valhalla", "Niflheim", "Midgard"],
        correct: 1
      },
      {
        question: "What were skalds?",
        answers: ["Warriors", "Poets and storytellers", "Blacksmiths", "Farmers"],
        correct: 1
      }
    ]
  },
  {
    id: 4,
    name: t.islands.salmeIsland,
    theme: "Salme & Estonian Vikings",
    questions: t.salmeQuestions || [
      {
        question: "Where is Salme located?",
        answers: ["Norway", "Sweden", "Saaremaa, Estonia", "Iceland"],
        correct: 2
      },
      {
        question: "What was discovered in Salme in 2008?",
        answers: ["Viking treasure", "Viking ship burials", "A Viking settlement", "Runestones"],
        correct: 1
      },
      {
        question: "How many men were buried in the Salme ships?",
        answers: ["About 10", "About 20", "Over 40", "Over 100"],
        correct: 2
      },
      {
        question: "The Salme ships date to approximately:",
        answers: ["600 CE", "750 CE", "900 CE", "1000 CE"],
        correct: 1
      },
      {
        question: "The Salme warriors likely came from:",
        answers: ["Norway", "Sweden", "Denmark", "Finland"],
        correct: 1
      },
      {
        question: "What makes the Salme find unique?",
        answers: ["Oldest Viking ship", "Only ship burial in Estonia", "Best preserved ship", "Largest Viking treasure"],
        correct: 1
      },
      {
        question: "Saaremaa is the largest island of:",
        answers: ["Norway", "Sweden", "Estonia", "Latvia"],
        correct: 2
      },
      {
        question: "The Salme warriors were likely on a:",
        answers: ["Trading mission", "Raid or military expedition", "Peaceful settlement", "Religious pilgrimage"],
        correct: 1
      },
      {
        question: "What happened to the Salme warriors?",
        answers: ["They settled peacefully", "They died in battle", "They returned home", "They founded a village"],
        correct: 1
      },
      {
        question: "The Salme find included:",
        answers: ["Gold coins", "Gaming pieces and weapons", "Manuscripts", "Jewelry only"],
        correct: 1
      }
    ]
  }
];

type GameState = 'menu' | 'intro' | 'island-select' | 'quiz' | 'sailing' | 'retry' | 'end';

function GameContent() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [playerData, setPlayerData] = useState<LoginData | null>(null);
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
  const [purchaseHistory, setPurchaseHistory] = useState<{ [key in ArtifactType]?: number }>({});
  const [showShopModal, setShowShopModal] = useState(false);

  const ISLANDS = getIslandData(t);
  const currentIsland = ISLANDS[currentIslandIndex];
  const currentQuestion = currentQuestionIndex !== null ? currentIsland?.questions[currentQuestionIndex] : null;

  const calculateScore = (answers: { [key: number]: number }) => {
    let correct = 0;
    currentIsland.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    return (correct / currentIsland.questions.length) * 100;
  };

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
    // Only trigger if not already answered
    if (userAnswers[questionIdx] === undefined) {
      setSavedPlayerPosition(playerPos); // Save current position
      setCurrentQuestionIndex(questionIdx);
      setGameState('quiz');
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (currentQuestionIndex === null) return;

    const isCorrect = answerIndex === currentIsland.questions[currentQuestionIndex].correct;

    // Update points: +30 for correct, -10 for wrong
    if (isCorrect) {
      setPoints(prev => prev + 30);
      toast.success('Correct! +30 points 💰', { duration: 2000 });
    } else {
      setPoints(prev => Math.max(0, prev - 10)); // Don't go below 0
      toast.error('Wrong answer! -10 points', { duration: 2000 });
    }

    const newAnswers = { ...userAnswers, [currentQuestionIndex]: answerIndex };
    setUserAnswers(newAnswers);
    setCurrentQuestionIndex(null);
    setGameState('island-select');

    // Check if all questions answered
    if (Object.keys(newAnswers).length === currentIsland.questions.length) {
      const score = calculateScore(newAnswers);
      setCurrentScore(score);

      if (score >= 70) {
        // Passed
        const newCompleted = [...completedIslands, currentIsland.id];
        setCompletedIslands(newCompleted);

        if (currentIslandIndex === 0) {
          setHasShip(true);
        }

        if (currentIslandIndex === ISLANDS.length - 1) {
          // Completed all islands
          setGameState('end');
        } else {
          // Move to next island
          setGameState('sailing');
        }
      } else {
        // Failed - show wrong questions
        const wrong: number[] = [];
        currentIsland.questions.forEach((q, idx) => {
          if (newAnswers[idx] !== q.correct) {
            wrong.push(idx);
          }
        });
        setWrongQuestions(wrong);
        setGameState('retry');
      }
    }
  };

  const handleRetryAnswer = (questionIndex: number, answerIndex: number) => {
    setRetryAnswers({ ...retryAnswers, [questionIndex]: answerIndex });
  };

  const handleRetrySubmit = () => {
    // Check if retry is successful and update points for retry answers only
    let correctRetries = 0;
    let pointsChange = 0;
    wrongQuestions.forEach((qIdx) => {
      const isCorrect = retryAnswers[qIdx] === currentIsland.questions[qIdx].correct;
      if (isCorrect) {
        correctRetries++;
        pointsChange += 30; // +30 for correct retry
      } else {
        pointsChange -= 10; // -10 for wrong retry
      }
    });

    // Apply points change
    setPoints(prev => Math.max(0, prev + pointsChange));

    if (pointsChange > 0) {
      toast.success(`Retry successful! +${pointsChange} points 💪`, { duration: 2000 });
    } else if (pointsChange < 0) {
      toast.error(`${pointsChange} points from retry`, { duration: 2000 });
    }

    const originalCorrect = currentIsland.questions.length - wrongQuestions.length;
    const totalCorrect = originalCorrect + correctRetries;
    const retryScore = (totalCorrect / currentIsland.questions.length) * 100;

    if (retryScore >= 70) {
      // Retry successful
      const newCompleted = [...completedIslands, currentIsland.id];
      setCompletedIslands(newCompleted);

      if (currentIslandIndex === 0) {
        setHasShip(true);
      }

      if (currentIslandIndex === ISLANDS.length - 1) {
        setGameState('end');
      } else {
        setGameState('sailing');
      }

      setWrongQuestions([]);
      setRetryAnswers({});
    } else {
      // Still failed
      setGameState('end');
    }
  };

  const handleSailingComplete = () => {
    setCurrentIslandIndex(currentIslandIndex + 1);
    setCurrentQuestionIndex(null);
    setUserAnswers({});
    setCurrentScore(undefined);
    setSavedPlayerPosition(null); // Reset position for new island
    setGameState('island-select');
  };

  const handlePlayClick = () => {
    setShowLoginModal(true);
  };

  const handleGuideClick = () => {
    setShowGuideModal(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleLogin = (mode: 'singleplayer' | 'school', data: LoginData) => {
    setPlayerData(data);
    setShowLoginModal(false);
    setGameState('intro');
  };

  const handleStartGame = () => {
    setSavedPlayerPosition(null); // Reset position for fresh start
    setGameState('island-select');
  };

  const handleTutorialComplete = () => {
    setHasSeenTutorial(true);
  };

  const handlePurchaseArtifact = (artifactType: ArtifactType) => {
    const cost = 100;
    const timesPurchased = purchaseHistory[artifactType] || 0;

    if (points >= cost && timesPurchased < 1) {
      setPoints(prev => prev - cost);
      setInventory([...inventory, artifactType]);
      setPurchaseHistory({
        ...purchaseHistory,
        [artifactType]: timesPurchased + 1
      });
      toast.success('Artifact purchased! Added to inventory 🎒', { duration: 2000 });
    }
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
    setPlayerData(null);
    setSavedPlayerPosition(null);
    setPoints(0);
    setPurchaseHistory({});
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
          onPlay={handlePlayClick}
          onGuide={handleGuideClick}
          onSettings={handleSettingsClick}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
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

      {/* Shop Modal */}
      {showShopModal && (
        <ShopModal
          onClose={() => setShowShopModal(false)}
          points={points}
          inventory={inventory}
          purchaseHistory={purchaseHistory}
          onPurchase={handlePurchaseArtifact}
        />
      )}

      {/* Story Intro Screen */}
      {gameState === 'intro' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {/* In-game Settings and Shop Buttons */}
      {(gameState === 'island-select' || gameState === 'quiz') && (
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          {/* Points Display */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#b8860b] px-4 py-2 rounded-full border-3 border-[#f4ede1] shadow-2xl">
            <span className="text-xl md:text-2xl">💰</span>
            <span className="text-white font-bold text-lg md:text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
              {points}
            </span>
          </div>

          {/* Shop Button */}
          <button
            onClick={() => setShowShopModal(true)}
            className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8860b] hover:from-[#b8860b] hover:to-[#d4a574] rounded-full border-3 border-[#f4ede1] shadow-2xl flex items-center justify-center transition-all hover:scale-110"
            aria-label="Shop"
          >
            <ShoppingBag className="w-6 h-6 text-white" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-12 h-12 bg-gradient-to-br from-[#8b6f47] to-[#6b5437] hover:from-[#6b5437] hover:to-[#8b6f47] rounded-full border-3 border-[#f4ede1] shadow-2xl flex items-center justify-center transition-all hover:scale-110"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {gameState === 'island-select' && (
        <>
          <ProgressBar
            islands={ISLANDS.map(i => ({ id: i.id, name: i.name }))}
            currentIslandIndex={currentIslandIndex}
            completedIslands={completedIslands}
          />
          <Island
            island={currentIsland}
            hasShip={hasShip}
            isFirstIsland={currentIslandIndex === 0}
            answeredQuestions={Object.keys(userAnswers).map(Number)}
            onQuestionTrigger={handleQuestionTrigger}
            collectedArtifacts={collectedArtifacts}
            onArtifactCollect={handleArtifactCollect}
            inventory={inventory}
            score={currentScore}
            showTutorial={currentIslandIndex === 0 && !hasSeenTutorial}
            onTutorialComplete={handleTutorialComplete}
            savedPosition={savedPlayerPosition}
          />
        </>
      )}

      {gameState === 'quiz' && currentQuestion && currentQuestionIndex !== null && (
        <QuizScreen
          island={currentIsland}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={currentIsland.questions.length}
          onAnswer={handleAnswer}
          inventory={inventory}
          onUseArtifact={handleUseArtifact}
        />
      )}

      {gameState === 'sailing' && (
        <SailingTransition onComplete={handleSailingComplete} />
      )}

      {gameState === 'retry' && (
        <RetryModal
          island={currentIsland}
          wrongQuestions={wrongQuestions}
          retryAnswers={retryAnswers}
          onAnswer={handleRetryAnswer}
          onSubmit={handleRetrySubmit}
        />
      )}

      {gameState === 'end' && (
        <EndScreen
          success={completedIslands.length === ISLANDS.length}
          completedIslands={completedIslands.length}
          totalIslands={ISLANDS.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GameContent />
    </LanguageProvider>
  );
}