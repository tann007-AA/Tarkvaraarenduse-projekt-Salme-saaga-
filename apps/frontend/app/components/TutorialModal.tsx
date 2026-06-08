import { motion } from 'motion/react';
import { X, Move, HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl max-w-3xl w-full p-6 md:p-8 my-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#8b2e2e] hover:bg-[#6b1e1e] rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-3"
          >
            <div className="bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-full p-3 md:p-4 border-3 md:border-4 border-[#8b6f47] shadow-xl">
              <HelpCircle className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl text-[#1e4d5f] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.tutorial.title}
          </h2>
          <p className="text-base md:text-lg text-[#6b7280]">{t.tutorial.welcome}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {/* Movement */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 md:gap-4 bg-white rounded-lg md:rounded-xl p-4 md:p-5 border-2 border-[#8b6f47]"
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#3d7a8f] to-[#2a5c6f] rounded-lg flex items-center justify-center">
              <Move className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl text-[#1e4d5f] mb-2 font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.tutorial.movement}
              </h3>
              <p className="text-sm md:text-base text-[#6b7280] mb-2">
                {t.tutorial.movementDesc}
              </p>
              <div className="flex gap-2 flex-wrap">
                <kbd className="px-2 md:px-3 py-1 bg-[#8b6f47] text-white rounded text-xs md:text-sm font-bold">W</kbd>
                <kbd className="px-2 md:px-3 py-1 bg-[#8b6f47] text-white rounded text-xs md:text-sm font-bold">A</kbd>
                <kbd className="px-2 md:px-3 py-1 bg-[#8b6f47] text-white rounded text-xs md:text-sm font-bold">S</kbd>
                <kbd className="px-2 md:px-3 py-1 bg-[#8b6f47] text-white rounded text-xs md:text-sm font-bold">D</kbd>
              </div>
            </div>
          </motion.div>

          {/* Questions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-3 md:gap-4 bg-white rounded-lg md:rounded-xl p-4 md:p-5 border-2 border-[#8b6f47]"
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#8b2e2e] to-[#6b1e1e] rounded-lg flex items-center justify-center text-xl md:text-2xl text-white font-bold">
              ?
            </div>
            <div>
              <h3 className="text-lg md:text-xl text-[#1e4d5f] mb-2 font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.tutorial.questions}
              </h3>
              <p className="text-sm md:text-base text-[#6b7280]">
                {t.tutorial.questionsDesc}
              </p>
            </div>
          </motion.div>

          {/* Artifacts */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-3 md:gap-4 bg-white rounded-lg md:rounded-xl p-4 md:p-5 border-2 border-[#8b6f47]"
          >
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl text-[#1e4d5f] mb-2 font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.tutorial.artifacts}
              </h3>
              <p className="text-sm md:text-base text-[#6b7280] mb-2">
                {t.tutorial.artifactsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg">⚔️</span>
                  <span className="text-[#6b7280]">{t.tutorial.lifeline1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg">🎲</span>
                  <span className="text-[#6b7280]">{t.tutorial.lifeline2}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Start button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onClose}
            className="w-full py-3 md:py-4 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-lg md:rounded-xl border-2 md:border-3 border-[#8b6f47] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span
              className="text-xl md:text-2xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.tutorial.ready}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
