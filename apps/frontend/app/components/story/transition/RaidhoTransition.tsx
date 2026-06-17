import { useEffect } from 'react';
import { motion } from 'motion/react';
import './RaidhoTransition.css';

interface RaidhoTransitionProps {
  onComplete: () => void;
}

export function RaidhoTransition({ onComplete }: RaidhoTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="raidho-transition">
      <div className="raidho-stars" aria-hidden="true" />
      <div className="raidho-glow" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="raidho-content"
      >
        <motion.div
          className="raidho-rune"
          animate={{
            textShadow: [
              '0 0 20px rgba(251, 191, 36, 0.4)',
              '0 0 50px rgba(251, 191, 36, 0.8)',
              '0 0 20px rgba(251, 191, 36, 0.4)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ᚱ
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="raidho-title"
        >
          Raidho
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="raidho-text"
        >
          Teekond algab. Rannik kutsub ja laev ootab.
        </motion.p>
      </motion.div>

      <motion.div
        className="raidho-coast"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
        aria-hidden="true"
      />

      <motion.div
        className="raidho-ship"
        initial={{ x: '-30vw', opacity: 0 }}
        animate={{ x: '30vw', opacity: 1 }}
        transition={{ delay: 1.5, duration: 2, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        🛶
      </motion.div>
    </div>
  );
}
