import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, X } from 'lucide-react';
import type { ArtifactType } from '../App';
import { useLanguage } from '../i18n/LanguageContext';

interface QuizScreenProps {
  island: {
    name: string;
    theme: string;
  };
  question: {
    question: string;
    answers: string[];
    correct: number;
  };
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  inventory: ArtifactType[];
  onUseArtifact: (artifactType: ArtifactType) => void;
  onClose?: () => void;
}

export function QuizScreen({
  island,
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  inventory,
  onUseArtifact,
  onClose
}: QuizScreenProps) {
  const { t } = useLanguage();
  const [filteredAnswers, setFilteredAnswers] = useState<number[]>([0, 1, 2, 3]);
  const [activePowerUp, setActivePowerUp] = useState<ArtifactType | null>(null);
  const [hasShieldActive, setHasShieldActive] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState<number | null>(null);
  const [highlightedAnswers, setHighlightedAnswers] = useState<number[]>([]);

  // Reset state when question changes
  useEffect(() => {
    setFilteredAnswers([0, 1, 2, 3]);
    setActivePowerUp(null);
    setHasShieldActive(false);
    setWrongAttempt(null);
    setHighlightedAnswers([]);
  }, [questionIndex]);

  const handleUsePowerUp = (artifact: ArtifactType) => {
    if (activePowerUp) return; // Can only use one power-up per question

    setActivePowerUp(artifact);
    onUseArtifact(artifact);

    switch (artifact) {
      case 'sword': {
        // Remove 2 wrong answers (50/50)
        const wrongAnswers = filteredAnswers.filter(idx => idx !== question.correct);
        const toRemove = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
        setFilteredAnswers(filteredAnswers.filter(idx => !toRemove.includes(idx)));
        break;
      }
      case 'shield': {
        // Allow one wrong answer retry
        setHasShieldActive(true);
        break;
      }
      case 'knife': {
        // Remove 1 wrong answer
        const wrongAnswers = filteredAnswers.filter(idx => idx !== question.correct);
        const toRemove = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        setFilteredAnswers(filteredAnswers.filter(idx => idx !== toRemove));
        break;
      }
      case 'dice': {
        // Randomly remove 1-2 wrong answers
        const wrongAnswers = filteredAnswers.filter(idx => idx !== question.correct);
        const removeCount = Math.random() > 0.5 ? 2 : 1;
        const toRemove = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, removeCount);
        setFilteredAnswers(filteredAnswers.filter(idx => !toRemove.includes(idx)));
        break;
      }
      case 'gaming-piece': {
        // Highlight 2 most likely answers (one correct, one random)
        const randomWrong = filteredAnswers.filter(idx => idx !== question.correct)[0];
        setHighlightedAnswers([question.correct, randomWrong]);
        break;
      }
    }
  };

  const handleAnswerClick = (answerIdx: number) => {
    const isCorrect = answerIdx === question.correct;

    if (!isCorrect && hasShieldActive && wrongAttempt === null) {
      // Shield protects from first wrong answer
      setWrongAttempt(answerIdx);
      setFilteredAnswers(filteredAnswers.filter(idx => idx !== answerIdx));
      return;
    }

    onAnswer(answerIdx);
  };

  const getArtifactInfo = (artifact: ArtifactType) => {
    switch (artifact) {
      case 'sword':
        return { name: t.artifacts.sword, desc: t.quiz.fiftyFiftyDesc, icon: '⚔️' };
      case 'shield':
        return { name: t.artifacts.shield, desc: t.artifacts.shieldDesc, icon: '🛡️' };
      case 'knife':
        return { name: t.artifacts.knife, desc: t.artifacts.knifeDesc, icon: '🔪' };
      case 'dice':
        return { name: t.artifacts.dice, desc: t.quiz.skipDesc, icon: '🎲' };
      case 'gaming-piece':
        return { name: t.artifacts.gamingPiece, desc: t.artifacts.gamingPieceDesc, icon: '♟️' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm overflow-auto pt-24 md:pt-8">
      {/* Quiz modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl p-4 md:p-8 max-w-4xl w-full shadow-2xl my-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b6f47' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
       {/* SULGEMISNUPP (Taganemistee ilma vastamata) */}
        <button
          onClick={() => {
            console.log("X nuppu klikati edukalt!");
            if (onClose) onClose();
          }}
          type="button"
          className="absolute top-4 right-4 z-[99] p-2 text-[#8b6f47] hover:text-[#8b2e2e] bg-white hover:bg-stone-100 border-2 border-[#8b6f47]/40 hover:border-[#8b2e2e]/60 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 block"
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          title="Retreat from challenge"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 pointer-events-none" />
        </button>

        {/* Progress indicator */}
        <div className="relative mb-4 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <Swords className="w-5 h-5 md:w-6 md:h-6 text-[#8b2e2e]" />
            <span
              className="text-lg md:text-xl text-[#1e4d5f]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {island.name}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-sm md:text-base lg:text-lg text-[#6b7280]">
              {t.quiz.question} {questionIndex + 1} {t.quiz.of} {totalQuestions}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx <= questionIndex ? 'bg-[#d4a574]' : 'bg-[#cbd5e1]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Power-ups section */}
        {inventory.length > 0 && !activePowerUp && (
          <div className="relative mb-4 md:mb-6 bg-white/50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-[#8b6f47]">
            <p className="text-xs md:text-sm text-[#8b6f47] font-bold mb-2 md:mb-3">{t.quiz.inventory}:</p>
            <div className="flex gap-2 md:gap-3 flex-wrap">
              {inventory.map((artifact, idx) => {
                const info = getArtifactInfo(artifact);
                return (
                  <button
                    key={idx}
                    onClick={() => handleUsePowerUp(artifact)}
                    className="group relative flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-lg border-2 border-[#8b6f47] shadow-md hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <span className="text-xl md:text-2xl">{info.icon}</span>
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-bold text-white">{info.name}</p>
                      <p className="text-[10px] md:text-xs text-white/80">{info.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active power-up indicator */}
        {activePowerUp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 bg-gradient-to-r from-[#d4a574] to-[#b8860b] rounded-xl p-3 border-2 border-[#8b6f47]"
          >
            <p className="text-sm text-white font-bold text-center">
              {getArtifactInfo(activePowerUp).icon} {getArtifactInfo(activePowerUp).name} activated!
            </p>
          </motion.div>
        )}

        {/* Shield retry message */}
        {wrongAttempt !== null && hasShieldActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-6 bg-[#8b2e2e] rounded-xl p-3 border-2 border-[#654321]"
          >
            <p className="text-sm text-white font-bold text-center">
              🛡️ Shield Protected! That answer was wrong. Try again!
            </p>
          </motion.div>
        )}

        {/* Question card */}
        <div className="relative bg-white rounded-2xl border-4 border-[#8b6f47] shadow-2xl overflow-hidden">
          {/* Decorative top border */}
          <div className="h-4 bg-gradient-to-r from-[#8b6f47] via-[#d4a574] to-[#8b6f47]" />

          {/* Question */}
          <div className="relative p-4 md:p-8 lg:p-12">
            <motion.h2
              key={questionIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xl md:text-3xl lg:text-4xl mb-6 md:mb-8 text-[#1e4d5f] leading-relaxed"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {question.question}
            </motion.h2>

            {/* Answers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {question.answers.map((answer, idx) => {
                  if (!filteredAnswers.includes(idx)) return null;
                  
                  const isHighlighted = highlightedAnswers.includes(idx);
                  const wasWrongAttempt = wrongAttempt === idx;

                  return (
                    <motion.button
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleAnswerClick(idx)}
                      disabled={wasWrongAttempt}
                      className={`group relative p-4 md:p-6 border-2 md:border-3 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-left ${
                        isHighlighted
                          ? 'bg-gradient-to-br from-[#d4a574]/30 to-[#b8860b]/30 border-[#d4a574]'
                          : wasWrongAttempt
                          ? 'bg-gradient-to-br from-[#8b2e2e]/20 to-[#654321]/20 border-[#8b2e2e] opacity-50 cursor-not-allowed'
                          : 'bg-gradient-to-br from-[#f4ede1] to-[#e8dcc8] border-[#8b6f47]'
                      }`}
                    >
                      {/* Answer letter badge */}
                      <div className={`absolute -left-2 md:-left-3 -top-2 md:-top-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 md:border-3 shadow-md group-hover:scale-110 transition-transform ${
                        isHighlighted
                          ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#d4a574]'
                          : wasWrongAttempt
                          ? 'bg-gradient-to-br from-[#8b2e2e] to-[#654321] border-[#8b2e2e]'
                          : 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47]'
                      }`}>
                        <span
                          className="text-white font-bold text-sm md:text-base lg:text-lg"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {wasWrongAttempt ? '✗' : String.fromCharCode(65 + idx)}
                        </span>
                      </div>

                      {/* Answer text */}
                      <div className="pl-4 md:pl-6">
                        <span className={`text-base md:text-lg lg:text-xl transition-colors ${
                          isHighlighted
                            ? 'text-[#8b6f47] font-bold'
                            : wasWrongAttempt
                            ? 'text-[#8b2e2e] line-through'
                            : 'text-[#1e4d5f] group-hover:text-[#0f2930]'
                        }`}>
                          {answer}
                        </span>
                      </div>

                      {/* Hover decoration */}
                      {!wasWrongAttempt && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574]/0 to-[#d4a574]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                      )}

                      {/* Highlight indicator */}
                      {isHighlighted && (
                        <div className="absolute top-2 right-2">
                          <span className="text-2xl">⭐</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="h-4 bg-gradient-to-r from-[#8b6f47] via-[#d4a574] to-[#8b6f47]" />
        </div>
      </motion.div>
    </div>
  );
}
