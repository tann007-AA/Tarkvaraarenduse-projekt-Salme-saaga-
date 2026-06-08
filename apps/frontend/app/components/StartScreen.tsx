import { motion } from 'motion/react';
import { Ship, Scroll, Sparkles, Anchor } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const { t } = useLanguage();
  return (
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a90a4] via-[#2a5c6f] to-[#1e4d5f]">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              rgba(255,255,255,0.08) 30px,
              rgba(255,255,255,0.08) 60px
            )`
          }}
          animate={{
            backgroundPositionY: ['0px', '60px']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Floating ships in background - hidden on small screens */}
      <motion.div
        className="hidden md:block absolute top-20 left-10 opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Ship className="w-20 h-20 lg:w-24 lg:h-24 text-white" strokeWidth={1} />
      </motion.div>
      <motion.div
        className="hidden md:block absolute bottom-32 right-10 lg:right-20 opacity-15"
        animate={{
          x: [0, -25, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      >
        <Ship className="w-24 h-24 lg:w-32 lg:h-32 text-white" strokeWidth={1} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Title with decorative elements */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="relative inline-block px-8 md:px-0">
            {/* Decorative corners */}
            <motion.div
              className="absolute -top-4 md:-top-6 -left-4 md:-left-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#d4a574]" />
            </motion.div>
            <motion.div
              className="absolute -top-4 md:-top-6 -right-4 md:-right-6"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#d4a574]" />
            </motion.div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-2xl mb-4 px-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.start.title}
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-[#d4a574] mb-8 px-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t.mainMenu.subtitle}
        </motion.h2>

        {/* Story scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative mb-8 mx-auto max-w-3xl"
        >
          <div className="bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-2xl border-4 border-[#8b6f47] shadow-2xl p-6 md:p-8">
            {/* Decorative scroll icon */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-full p-3 border-4 border-[#8b6f47] shadow-xl">
                <Scroll className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Story text */}
            <div className="space-y-3 text-[#1e4d5f]">
              {t.start.story.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Decorative runes */}
            <div className="mt-6 flex justify-center gap-4 text-[#8b6f47] opacity-40">
              <svg width="30" height="30" viewBox="0 0 30 30">
                <text x="15" y="22" fontSize="24" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>ᚱ</text>
              </svg>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <text x="15" y="22" fontSize="24" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>ᚢ</text>
              </svg>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <text x="15" y="22" fontSize="24" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>ᚾ</text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Game info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/30 p-4">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>4 Islands</div>
            <div className="text-sm text-white/80">Explore and conquer</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/30 p-4">
            <div className="text-4xl mb-2">❓</div>
            <div className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>40 Questions</div>
            <div className="text-sm text-white/80">Test your knowledge</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/30 p-4">
            <div className="text-4xl mb-2">⚔️</div>
            <div className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>5 Artifacts</div>
            <div className="text-sm text-white/80">Collect lifelines</div>
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={onStart}
            className="group relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-2xl border-4 border-[#8b6f47] shadow-2xl hover:shadow-[#d4a574]/50 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300" />
            <span
              className="relative flex items-center gap-3 md:gap-4 text-2xl md:text-3xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Anchor className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
              {t.start.beginJourney}
              <Anchor className="w-6 h-6 md:w-8 md:h-8 group-hover:-rotate-12 transition-transform duration-300" />
            </span>
          </button>
        </motion.div>

        {/* Instructions hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-6"
        >
          <p className="text-white/60 text-xs md:text-sm px-4">
            Use <span className="font-bold text-white">WASD</span> or <span className="font-bold text-white">Arrow Keys</span> to explore islands
          </p>
        </motion.div>
      </div>

      {/* Decorative Viking patterns in corners - hidden on mobile */}
      <motion.div
        className="hidden md:block absolute top-8 left-8 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="80" height="80" viewBox="0 0 120 120" className="lg:w-[120px] lg:h-[120px]">
          <path
            d="M60 15 L72 45 L105 45 L78 63 L90 93 L60 75 L30 93 L42 63 L15 45 L48 45 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="60" cy="60" r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </motion.div>
      <motion.div
        className="hidden md:block absolute bottom-8 right-8 opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="80" height="80" viewBox="0 0 120 120" className="lg:w-[120px] lg:h-[120px]">
          <path
            d="M60 15 L72 45 L105 45 L78 63 L90 93 L60 75 L30 93 L42 63 L15 45 L48 45 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="60" cy="60" r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </motion.div>
    </div>
  );
}
