import { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Users, Lock, Hash } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (mode: 'singleplayer' | 'school', data: LoginData) => void;
}

export interface LoginData {
  name: string;
  password?: string;
  roomCode?: string;
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'singleplayer' | 'school'>('singleplayer');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (mode === 'singleplayer') {
      onLogin('singleplayer', { name: name.trim(), password: password.trim() });
    } else {
      onLogin('school', { name: name.trim(), roomCode: roomCode.trim() });
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl max-w-lg w-full p-6 md:p-8"
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
          <h2
            className="text-3xl md:text-4xl text-[#1e4d5f] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.login.title}
          </h2>
          <p className="text-base md:text-lg text-[#6b7280]">
            {t.login.subtitle}
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode('singleplayer')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
              mode === 'singleplayer'
                ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white shadow-lg scale-105'
                : 'bg-white/50 border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.login.singleplayer}
              </span>
            </div>
          </button>
          <button
            onClick={() => setMode('school')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
              mode === 'school'
                ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white shadow-lg scale-105'
                : 'bg-white/50 border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.login.school}
              </span>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-[#8b6f47] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Viking Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.login.enterName}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
              />
            </div>
          </div>

          {/* Conditional Fields */}
          {mode === 'singleplayer' ? (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Room Code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder={t.login.enterCode}
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl border-3 shadow-xl transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white hover:scale-105 hover:shadow-2xl cursor-pointer'
                : 'bg-[#cbd5e1] border-[#6b7280] text-[#6b7280] cursor-not-allowed opacity-50'
            }`}
          >
            <span
              className="text-2xl flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.login.start}
            </span>
          </button>
        </form>

        {/* Info text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#6b7280]">
            {mode === 'singleplayer'
              ? t.login.singleplayerDesc
              : t.login.schoolDesc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
