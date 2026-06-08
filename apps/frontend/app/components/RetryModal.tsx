import { motion } from 'motion/react';
import { AlertCircle, Swords } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface RetryModalProps {
  island: {
    name: string;
    questions: Array<{
      question: string;
      answers: string[];
      correct: number;
    }>;
  };
  wrongQuestions: number[];
  retryAnswers: { [key: number]: number };
  onAnswer: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
}

export function RetryModal({
  island,
  wrongQuestions,
  retryAnswers,
  onAnswer,
  onSubmit
}: RetryModalProps) {
  const { t } = useLanguage();
  const allAnswered = wrongQuestions.every(qIdx => retryAnswers[qIdx] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-4xl w-full max-h-[95vh] overflow-auto bg-gradient-to-br from-[#f4ede1] to-[#e8dcc8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl my-4"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#8b2e2e] to-[#6b1e1e] p-4 md:p-6 border-b-3 md:border-b-4 border-[#8b6f47]">
          <div className="flex items-center gap-3 md:gap-4">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-[#f4ede1] flex-shrink-0" />
            <div>
              <h2
                className="text-2xl md:text-3xl text-[#f4ede1] mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t.retry.title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[#d4a574]">
                {t.retry.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Wrong questions */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {wrongQuestions.map((qIdx, idx) => {
            const question = island.questions[qIdx];
            const selectedAnswer = retryAnswers[qIdx];

            return (
              <motion.div
                key={qIdx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg md:rounded-xl border-2 md:border-3 border-[#8b6f47] p-4 md:p-6 shadow-lg"
              >
                {/* Question number badge */}
                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#8b2e2e] to-[#6b1e1e] rounded-full flex items-center justify-center border-2 border-[#8b6f47]">
                    <span
                      className="text-white font-bold text-sm md:text-base"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="flex-1 text-base md:text-lg lg:text-xl text-[#1e4d5f] pt-1">
                    {question.question}
                  </h3>
                </div>

                {/* Answers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 ml-0 md:ml-14">
                  {question.answers.map((answer, answerIdx) => {
                    const isSelected = selectedAnswer === answerIdx;

                    return (
                      <button
                        key={answerIdx}
                        onClick={() => onAnswer(qIdx, answerIdx)}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white shadow-lg scale-105'
                            : 'bg-[#f4ede1] border-[#cbd5e1] text-[#1e4d5f] hover:border-[#8b6f47] hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-white bg-white/20'
                                : 'border-[#8b6f47]'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="flex-1">{answer}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-[#8b6f47] to-[#6b5437] p-4 md:p-6 border-t-3 md:border-t-4 border-[#654321]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 text-[#f4ede1]">
              <Swords className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base lg:text-lg">
                {Object.keys(retryAnswers).length} of {wrongQuestions.length} answered
              </span>
            </div>
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className={`w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl border-2 md:border-3 shadow-xl transition-all duration-300 ${
                allAnswered
                  ? 'bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white hover:scale-105 hover:shadow-2xl cursor-pointer'
                  : 'bg-[#cbd5e1] border-[#6b7280] text-[#6b7280] cursor-not-allowed opacity-50'
              }`}
            >
              <span
                className="text-lg md:text-xl flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.retry.submitAnswers}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
