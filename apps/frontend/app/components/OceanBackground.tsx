import { motion } from 'motion/react';

export function OceanBackground() {
  return (
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
  );
}
