import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Ship, Waves } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SailingTransitionProps {
  onComplete: () => void;
}

export function SailingTransition({ onComplete }: SailingTransitionProps) {
  const { t } = useLanguage();
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative size-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ocean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a90a4] via-[#2a5c6f] to-[#1e4d5f]">
        {/* Animated waves */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              rgba(255,255,255,0.05) 30px,
              rgba(255,255,255,0.05) 60px
            )`
          }}
          animate={{
            backgroundPositionY: ['0px', '60px']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Wave icons */}
        <motion.div
          className="absolute top-1/3 left-1/4"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Waves className="w-16 h-16 text-white/30" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-1/4"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          <Waves className="w-16 h-16 text-white/30" />
        </motion.div>
      </div>

      {/* Viking ship sailing */}
      <motion.div
        initial={{ x: '-100%', scale: 0.5 }}
        animate={{ x: '100vw', scale: 1.2 }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut'
        }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            rotate: [-2, 2, -2],
            y: [-5, 5, -5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Viking longship */}
          <svg width="200" height="120" viewBox="0 0 200 120" className="drop-shadow-2xl">
            {/* Hull */}
            <path
              d="M20 70 Q100 50 180 70 L170 85 Q100 75 30 85 Z"
              fill="#8b6f47"
              stroke="#654321"
              strokeWidth="2"
            />

            {/* Mast */}
            <rect x="95" y="20" width="4" height="50" fill="#654321" />

            {/* Sail */}
            <motion.path
              d="M99 25 L130 40 L130 60 L99 50 Z"
              fill="#f4ede1"
              stroke="#8b6f47"
              strokeWidth="2"
              animate={{
                d: [
                  'M99 25 L130 40 L130 60 L99 50 Z',
                  'M99 25 L135 40 L135 60 L99 50 Z',
                  'M99 25 L130 40 L130 60 L99 50 Z'
                ]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Dragon head */}
            <path
              d="M180 65 Q195 60 200 50 Q195 55 190 58"
              fill="#654321"
              stroke="#654321"
              strokeWidth="2"
            />

            {/* Shields along the side */}
            <circle cx="50" cy="75" r="8" fill="#8b2e2e" stroke="#654321" strokeWidth="1.5" />
            <circle cx="70" cy="73" r="8" fill="#d4a574" stroke="#654321" strokeWidth="1.5" />
            <circle cx="90" cy="72" r="8" fill="#8b2e2e" stroke="#654321" strokeWidth="1.5" />
            <circle cx="110" cy="73" r="8" fill="#d4a574" stroke="#654321" strokeWidth="1.5" />
            <circle cx="130" cy="75" r="8" fill="#8b2e2e" stroke="#654321" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 text-center px-4"
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl text-white mb-4 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.sailing.title}
        </h2>
        <motion.div
          className="flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
