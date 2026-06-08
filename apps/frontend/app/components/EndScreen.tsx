import { motion } from 'motion/react';
import { Trophy, Skull, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface EndScreenProps {
  success: boolean;
  completedIslands: number;
  totalIslands: number;
  onRestart: () => void;
}

export function EndScreen({
  success,
  completedIslands,
  totalIslands,
  onRestart
}: EndScreenProps) {
  const { t } = useLanguage();
  return (
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div
        className={`absolute inset-0 ${
          success
            ? 'bg-gradient-to-br from-[#d4a574] via-[#b8860b] to-[#8b6f47]'
            : 'bg-gradient-to-br from-[#4a4a4a] via-[#2a2a2a] to-[#1a1a1a]'
        }`}
      >
        {/* Animated particles */}
        {success ? (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 0
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              />
            ))}
          </>
        ) : (
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundImage: [
                'radial-gradient(circle at 20% 50%, rgba(139, 46, 46, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(139, 46, 46, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(139, 46, 46, 0.3) 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-3xl px-4 md:px-8"
      >
        {success ? (
          <>
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="mb-8 inline-block"
            >
              <div className="relative">
                <Trophy className="w-32 h-32 text-white drop-shadow-2xl" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-200" />
                </motion.div>
              </div>
            </motion.div>

            {/* Success title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.end.victoryTitle}
            </motion.h1>

            {/* Success message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <p
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.end.victorySubtitle}
              </p>
              <p className="text-base md:text-lg lg:text-xl text-white/80">
                {t.end.victoryMessage}
              </p>
            </motion.div>

            {/* Decorative Viking ship */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mb-8"
            >
              <svg width="200" height="100" viewBox="0 0 200 100" className="inline-block drop-shadow-2xl">
                <path
                  d="M20 50 Q100 40 180 50 L170 60 Q100 55 30 60 Z"
                  fill="white"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                />
                <rect x="95" y="20" width="3" height="30" fill="white" opacity="0.8" />
                <path
                  d="M98 25 L120 35 L120 50 L98 42 Z"
                  fill="white"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              </svg>
            </motion.div>
          </>
        ) : (
          <>
            {/* Failure icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: 0.3, duration: 0.8, repeat: Infinity }}
              className="mb-8 inline-block"
            >
              <Skull className="w-32 h-32 text-[#8b2e2e] drop-shadow-2xl" />
            </motion.div>

            {/* Failure title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl mb-6 text-[#8b2e2e] drop-shadow-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.end.defeatTitle}
            </motion.h1>

            {/* Failure message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <p
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.end.defeatSubtitle}
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-400">
                {t.end.defeatMessage}
              </p>
            </motion.div>

            {/* Broken shield decoration */}
            <motion.div
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 0.3, rotate: 0 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" className="inline-block">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#8b2e2e" strokeWidth="4" strokeDasharray="10 5" />
                <line x1="30" y1="30" x2="90" y2="90" stroke="#8b2e2e" strokeWidth="3" />
                <line x1="90" y1="30" x2="30" y2="90" stroke="#8b2e2e" strokeWidth="3" />
              </svg>
            </motion.div>
          </>
        )}

        {/* Restart button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={onRestart}
            className={`group px-6 md:px-10 py-4 md:py-5 rounded-xl border-3 md:border-4 shadow-2xl transition-all duration-300 hover:scale-105 md:hover:scale-110 ${
              success
                ? 'bg-white border-white/50 text-[#8b6f47] hover:shadow-white/50'
                : 'bg-[#8b2e2e] border-[#6b1e1e] text-white hover:shadow-[#8b2e2e]/50'
            }`}
          >
            <span
              className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <RotateCcw className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-180 transition-transform duration-500" />
              {t.end.playAgain}
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      {success && (
        <>
          <motion.div
            className="absolute top-8 left-8 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path
                d="M50 10 L58 38 L88 38 L63 56 L72 84 L50 66 L28 84 L37 56 L12 38 L42 38 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 opacity-30"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path
                d="M50 10 L58 38 L88 38 L63 56 L72 84 L50 66 L28 84 L37 56 L12 38 L42 38 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
}
