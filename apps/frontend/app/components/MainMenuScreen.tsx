import { motion } from 'motion/react';
import { Play, Book, Settings, Ship, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface MainMenuScreenProps {
  onPlay: () => void;
  onGuide: () => void;
  onSettings: () => void;
}

export function MainMenuScreen({ onPlay, onGuide, onSettings }: MainMenuScreenProps) {
  const { t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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

      {/* Floating decorative ships */}
      <motion.div
        className="hidden md:block absolute top-32 left-16 opacity-15"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Ship className="w-24 h-24 text-white" strokeWidth={1} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 md:px-8 text-center">
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16"
        >
          <h1
            className="text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-2xl mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.mainMenu.title}
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mb-6" />
          <p
            className="text-2xl md:text-3xl text-[#d4a574] drop-shadow-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.mainMenu.subtitle}
          </p>
        </motion.div>

        {/* Menu Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Play Button */}
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onClick={onPlay}
            className="group relative w-full px-8 py-5 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-xl border-4 border-[#8b6f47] shadow-2xl hover:shadow-[#d4a574]/50 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300" />
            <span
              className="relative flex items-center justify-center gap-3 text-3xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Play className="w-8 h-8 fill-white" />
              {t.mainMenu.play}
            </span>
          </motion.button>

          {/* Guide Button */}
          {/* <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onClick={onGuide}
            className="group relative w-full px-8 py-4 bg-gradient-to-b from-[#3d7a8f] to-[#2a5c6f] rounded-xl border-4 border-[#1e4d5f] shadow-xl hover:shadow-[#3d7a8f]/50 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300" />
            <span
              className="relative flex items-center justify-center gap-3 text-2xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Book className="w-7 h-7" />
              {t.mainMenu.guide}
            </span>
          </motion.button>
           */}

          {/* Settings Button */}
          {/*
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            onClick={onSettings}
            className="group relative w-full px-8 py-4 bg-gradient-to-b from-[#6b7280] to-[#4b5563] rounded-xl border-4 border-[#374151] shadow-xl hover:shadow-[#6b7280]/50 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300" />
            <span
              className="relative flex items-center justify-center gap-3 text-2xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Settings className="w-7 h-7" />
              {t.mainMenu.settings}
            </span>
          </motion.button>
          */}
        </div>

        {/* Version or credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <p className="text-white/40 text-sm">
            Educational Viking History Game
          </p>
        </motion.div>
      </div>

      {/* Decorative corner patterns */}
      <motion.div
        className="hidden lg:block absolute bottom-8 right-8 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="100" height="100" viewBox="0 0 120 120">
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
