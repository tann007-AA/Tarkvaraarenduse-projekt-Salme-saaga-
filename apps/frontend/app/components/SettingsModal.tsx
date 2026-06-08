import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Music, Maximize, Globe, Palette, Accessibility, Home } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';

interface SettingsModalProps {
  onClose: () => void;
  onReturnToMenu?: () => void;
}

export function SettingsModal({ onClose, onReturnToMenu }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(50);
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState('default');
  const [textSize, setTextSize] = useState('medium');
  const [animations, setAnimations] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl max-w-2xl w-full p-6 md:p-8 my-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#8b2e2e] hover:bg-[#6b1e1e] rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-3xl md:text-4xl text-[#1e4d5f] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.settings.title}
          </h2>
          <p className="text-base md:text-lg text-[#6b7280]">
            {t.settings.subtitle}
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="bg-white rounded-xl p-5 border-2 border-[#8b6f47]">
            <h3
              className="text-xl text-[#1e4d5f] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Volume2 className="w-6 h-6 text-[#8b6f47]" />
              {t.settings.audio}
            </h3>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-[#1e4d5f] font-bold">{t.settings.soundEffects}</label>
                <p className="text-sm text-[#6b7280]">{t.settings.soundEffectsDesc}</p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  soundEnabled ? 'bg-[#d4a574]' : 'bg-[#cbd5e1]'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    soundEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Sound Volume */}
            {soundEnabled && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6b7280]">{t.settings.soundVolume}</label>
                  <span className="text-sm font-bold text-[#8b6f47]">{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#d4a574]"
                />
              </div>
            )}

            {/* Music Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-[#1e4d5f] font-bold flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  {t.settings.backgroundMusic}
                </label>
                <p className="text-sm text-[#6b7280]">{t.settings.backgroundMusicDesc}</p>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  musicEnabled ? 'bg-[#d4a574]' : 'bg-[#cbd5e1]'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    musicEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Music Volume */}
            {musicEnabled && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6b7280]">{t.settings.musicVolume}</label>
                  <span className="text-sm font-bold text-[#8b6f47]">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full h-2 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#d4a574]"
                />
              </div>
            )}
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-xl p-5 border-2 border-[#8b6f47]">
            <h3
              className="text-xl text-[#1e4d5f] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Maximize className="w-6 h-6 text-[#8b6f47]" />
              {t.settings.display}
            </h3>

            {/* Fullscreen Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-[#1e4d5f] font-bold">{t.settings.fullscreenMode}</label>
                <p className="text-sm text-[#6b7280]">{t.settings.fullscreenDesc}</p>
              </div>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  fullscreen ? 'bg-[#d4a574]' : 'bg-[#cbd5e1]'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    fullscreen ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Theme Selection */}
            <div className="mb-4">
              <label className="text-[#1e4d5f] font-bold flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4" />
                {t.settings.colorTheme}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('default')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all ${
                    theme === 'default'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.default}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.dark}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.light}
                </button>
              </div>
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#1e4d5f] font-bold">{t.settings.animations}</label>
                <p className="text-sm text-[#6b7280]">{t.settings.animationsDesc}</p>
              </div>
              <button
                onClick={() => setAnimations(!animations)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  animations ? 'bg-[#d4a574]' : 'bg-[#cbd5e1]'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    animations ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language & Accessibility */}
          <div className="bg-white rounded-xl p-5 border-2 border-[#8b6f47]">
            <h3
              className="text-xl text-[#1e4d5f] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Globe className="w-6 h-6 text-[#8b6f47]" />
              {t.settings.languageAccessibility}
            </h3>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="text-[#1e4d5f] font-bold mb-2 block">{t.settings.language}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-2 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f]"
              >
                <option value="en">English</option>
                <option value="et">Eesti (Estonian)</option>
                <option value="no">Norsk (Norwegian)</option>
                <option value="sv">Svenska (Swedish)</option>
                <option value="da">Dansk (Danish)</option>
              </select>
            </div>

            {/* Text Size */}
            <div>
              <label className="text-[#1e4d5f] font-bold flex items-center gap-2 mb-2">
                <Accessibility className="w-4 h-4" />
                {t.settings.textSize}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTextSize('small')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                    textSize === 'small'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.small}
                </button>
                <button
                  onClick={() => setTextSize('medium')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all ${
                    textSize === 'medium'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.medium}
                </button>
                <button
                  onClick={() => setTextSize('large')}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-lg ${
                    textSize === 'large'
                      ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white'
                      : 'bg-white border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
                  }`}
                >
                  {t.settings.large}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-lg border-2 border-[#8b6f47] text-white shadow-lg hover:scale-105 transition-all"
          >
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.settings.saveClose}
            </span>
          </button>
          <button
            onClick={() => {
              // Reset to defaults
              setSoundEnabled(true);
              setMusicEnabled(true);
              setSoundVolume(70);
              setMusicVolume(50);
              setFullscreen(false);
              setLanguage('en');
              setTheme('default');
              setTextSize('medium');
              setAnimations(true);
            }}
            className="px-6 py-3 bg-white rounded-lg border-2 border-[#8b6f47] text-[#8b6f47] hover:bg-[#f4ede1] transition-all"
          >
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.settings.reset}
            </span>
          </button>
        </div>

        {/* Return to Menu Button (only shown during gameplay) */}
        {onReturnToMenu && (
          <div className="mt-4">
            <button
              onClick={() => {
                if (window.confirm(t.settings.confirmReturnToMenu)) {
                  onReturnToMenu();
                  onClose();
                }
              }}
              className="w-full px-6 py-3 bg-gradient-to-b from-[#8b2e2e] to-[#6b1e1e] rounded-lg border-2 border-[#654321] text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.settings.returnToMenu}
              </span>
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#6b7280]">
            {t.settings.savedLocally}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
