import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface GameModeSelectScreenProps {
  onSelectMode: (mode: 'story-mode' | 'hnefatafl-local' | 'island-select') => void;
  onBack: () => void;
}

export function GameModeSelectScreen({ onSelectMode, onBack }: GameModeSelectScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated ocean background - sama mis su teistel ekraanidel */}
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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 text-center">
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2
            className="text-4xl md:text-5xl text-white drop-shadow-2xl mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vali režiim
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-[#d4a574] to-transparent" />
        </motion.div>

        {/* Option Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* STORY MODE / SAGA */}
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelectMode('story-mode')}
            className="group relative flex items-center gap-4 w-full p-5 bg-gradient-to-r from-[#2a5c6f] to-[#1e4d5f] hover:from-[#3d7a8f] hover:to-[#2a5c6f] border-4 border-[#1e4d5f] hover:border-[#d4a574] rounded-xl shadow-2xl transition-all duration-300 cursor-pointer text-left hover:scale-105"
          >
            <div className="p-3 bg-[#d4a574]/20 group-hover:bg-[#d4a574]/40 text-[#d4a574] rounded-lg transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Saaga (Story Mode)
              </div>
              <div className="text-xs text-white/70 mt-1">
                Koge tõelist viikingite seiklust Salme rannale läbi narratiivi ja minimängude.
              </div>
            </div>
          </motion.button>

          {/* HNEFATAFL */}
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => onSelectMode('hnefatafl-local')}
            className="group relative flex items-center gap-4 w-full p-5 bg-gradient-to-r from-[#2a5c6f] to-[#1e4d5f] hover:from-[#3d7a8f] hover:to-[#2a5c6f] border-4 border-[#1e4d5f] hover:border-[#d4a574] rounded-xl shadow-2xl transition-all duration-300 cursor-pointer text-left hover:scale-105"
          >
            <div className="p-3 bg-white/10 group-hover:bg-[#d4a574]/20 text-white group-hover:text-[#d4a574] rounded-lg transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Hnefatafl (Lauamäng)
              </div>
              <div className="text-xs text-white/70 mt-1">
                Klassikaline viikingite strateegiamäng. Mängi sõbra vastu samal arvutil.
              </div>
            </div>
          </motion.button>

          {/* VANA SAARE/TESTI REŽIIMI NUPP */}
          {/*
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => onSelectMode('island-select')}
            className="group relative flex items-center gap-4 w-full p-5 bg-gradient-to-r from-[#2a5c6f] to-[#1e4d5f] hover:from-[#3d7a8f] hover:to-[#2a5c6f] border-4 border-[#1e4d5f] hover:border-[#d4a574] rounded-xl shadow-2xl transition-all duration-300 cursor-pointer text-left hover:scale-105"
          >
            <div className="p-3 bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors">
              <span>🗺️</span>
            </div>
            <div>
              <div className="text-xl font-bold text-white font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Mälumängu Saared (Test)
              </div>
              <div className="text-xs text-white/70 mt-1">
                Sinu algne režiim: liigu WASD klahvidega mööda saari ja vasta küsimustele.
              </div>
            </div>
          </motion.button>
          */}

          {/* BACK BUTTON */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onBack}
            className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors text-sm py-2 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Tagasi peamenüüsse
          </motion.button>
        </div>
      </div>
    </div>
  );
}
