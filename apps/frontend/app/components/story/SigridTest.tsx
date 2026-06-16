import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SigridTestProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: 'Kellel on õigus otsustada talu vara üle, kui mehed on merel?',
    answers: [
      'Küla vanemal',
      'Talunaisel, kelle vööl on võtmed',
      'Laevakaptenil',
    ],
    correct: 1,
  },
  {
    id: 2,
    question: 'Mida pead laevale kõige rohkem kaasa võtma?',
    answers: [
      'Hõbeehteid',
      'Villaseid tekke',
      'Kuivatatud kala ja soolatud liha',
    ],
    correct: 2,
  },
  {
    id: 3,
    question: 'Mis lükkab laeva edasi, kui tuult ei ole?',
    answers: [
      'Mõlad ja aerud',
      'Villased purjed ja rõivad',
      'Lainete jõud',
    ],
    correct: 1,
  },
];

const LABELS = ['A', 'B', 'C'];

type AnswerState = 'pending' | 'correct' | 'wrong';

export function SigridTest({ isOpen, onClose, onComplete }: SigridTestProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [passedCount, setPassedCount] = useState(0);

  if (!isOpen) return null;

  const question = QUESTIONS[currentQ];

  const handleAnswer = (answerIdx: number) => {
    if (answerState !== 'pending') return;
    setSelectedAnswer(answerIdx);

    const correct = answerIdx === question.correct;
    setAnswerState(correct ? 'correct' : 'wrong');
    if (correct) {
      setPassedCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setAnswerState('pending');
        setSelectedAnswer(null);
      } else {
        setShowCompletion(true);
      }
    }, 1200);
  };

  const handleFinish = () => {
    onComplete();
  };

  const getAnswerButtonClass = (idx: number) => {
    const base =
      'w-full text-left p-4 border-2 md:border-3 rounded-xl shadow-lg transition-all duration-300 text-base md:text-lg';

    if (answerState === 'pending') {
      return `${base} bg-gradient-to-br from-[#f4ede1] to-[#e8dcc8] border-[#8b6f47] hover:shadow-xl hover:scale-[1.02]`;
    }

    if (idx === question.correct) {
      return `${base} bg-gradient-to-br from-[#2d6a4f] to-[#40916c] border-[#2d6a4f] text-white scale-[1.02]`;
    }

    if (idx === selectedAnswer && idx !== question.correct) {
      return `${base} bg-gradient-to-br from-[#8b2e2e] to-[#654321] border-[#8b2e2e] text-white opacity-70`;
    }

    return `${base} bg-gradient-to-br from-[#f4ede1] to-[#e8dcc8] border-[#8b6f47] opacity-50`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl"
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b6f47' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Sigrid portrait */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4a574] to-[#b8860b] flex items-center justify-center text-3xl border-3 border-[#8b6f47] shadow-lg shrink-0">
            🧑
          </div>
          <div>
            <p
              className="text-lg font-bold text-[#1e4d5f]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Sigrid
            </p>
            <p className="text-sm text-[#6b7280]">Sigridi kontrolltest</p>
          </div>
          {!showCompletion && (
            <div className="ml-auto flex gap-1">
              {QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx < currentQ
                      ? 'bg-[#2d6a4f]'
                      : idx === currentQ
                        ? 'bg-[#d4a574]'
                        : 'bg-[#cbd5e1]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!showCompletion ? (
            <motion.div
              key={currentQ}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
            >
              <h2
                className="text-xl md:text-2xl text-[#1e4d5f] mb-6 leading-relaxed"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answerState !== 'pending'}
                    className={getAnswerButtonClass(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 ${
                          answerState !== 'pending' && idx === question.correct
                            ? 'bg-white text-[#2d6a4f] border-white'
                            : answerState !== 'pending' && idx === selectedAnswer
                              ? 'bg-white/20 text-white border-white/50'
                              : 'bg-[#d4a574] text-white border-[#8b6f47]'
                        }`}
                      >
                        {answerState !== 'pending' && idx === question.correct
                          ? '✓'
                          : answerState !== 'pending' && idx === selectedAnswer
                            ? '✗'
                            : LABELS[idx]}
                      </span>
                      <span
                        className={
                          answerState !== 'pending' && idx === question.correct
                            ? 'text-white font-bold'
                            : answerState !== 'pending' && idx === selectedAnswer
                              ? 'text-white/70'
                              : 'text-[#1e4d5f]'
                        }
                      >
                        {answer}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Feedback strip */}
              <AnimatePresence>
                {answerState !== 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-xl text-center font-bold ${
                      answerState === 'correct'
                        ? 'bg-[#2d6a4f]/20 text-[#2d6a4f] border border-[#2d6a4f]/30'
                        : 'bg-[#8b2e2e]/20 text-[#8b2e2e] border border-[#8b2e2e]/30'
                    }`}
                  >
                    {answerState === 'correct' ? '✓ Õige!' : '✗ Vale!'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🎒</div>
              <h2
                className="text-xl md:text-2xl text-[#1e4d5f] mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {passedCount >= 2
                  ? 'Hea küll, Björn. Sa ei ole päris lootusetu. Võta see paun kaasa.'
                  : 'Päris nõrk vastus... aga võta see paun siiski.'}
              </h2>
              <p className="text-[#6b7280] mb-6">
                {passedCount} / {QUESTIONS.length} õiget vastust
              </p>
              <div className="bg-[#2d6a4f]/10 border border-[#2d6a4f]/30 rounded-xl p-4 mb-6 inline-block">
                <p className="text-sm text-[#6b7280] mb-1">Saadud ese:</p>
                <p
                  className="text-lg font-bold text-[#2d6a4f]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  🪙 Kodumulla paun
                </p>
                <p className="text-xs text-[#6b7280] mt-1">
                  ID 1-18 — sümbol sidest koduga
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-gradient-to-r from-[#d4a574] to-[#b8860b] text-white font-bold rounded-xl border-2 border-[#8b6f47] shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                Võta vastu
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showCompletion && answerState === 'pending' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#8b6f47] hover:text-[#8b2e2e] transition-colors cursor-pointer"
            title="Katkesta"
          >
            ✕
          </button>
        )}
      </motion.div>
    </div>
  );
}
