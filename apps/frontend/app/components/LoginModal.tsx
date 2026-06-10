import { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Lock, Mail, AlertCircle, Hash } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const { t } = useLanguage();
  const { login, register, error: authError, clearError } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'school'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleModeChange = (newMode: 'login' | 'register' | 'school') => {
    setMode(newMode);
    clearError();
    setLocalError(null);
  };

  const validateForm = (): string | null => {
    if (mode === 'login') {
      if (!email.trim()) return 'Email is required';
      if (!password) return 'Password is required';
      if (!email.includes('@')) return 'Invalid email address';
    } else if (mode === 'register') {
      if (!email.trim()) return 'Email is required';
      if (!email.includes('@')) return 'Invalid email address';
      if (!username.trim()) return 'Username is required';
      if (username.length < 3) return 'Username must be at least 3 characters';
      if (!name.trim()) return 'Name is required';
      if (!password) return 'Password is required';
      if (password.length < 8) return 'Password must be at least 8 characters';
      if (password !== confirmPassword) return 'Passwords do not match';
    } else if (mode === 'school') {
      if (!name.trim()) return 'Name is required';
      // Room code is optional for school mode
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password, rememberMe });
        onSuccess(email); // Pass email as identifier
      } else if (mode === 'register') {
        await register({ email, username, name, password });
        onSuccess(username); // Pass username for new users
      } else if (mode === 'school') {
        // School mode - no authentication, just pass name
        onSuccess(name.trim());
      }
      onClose();
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
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
            {mode === 'login' ? 'Welcome Back, Viking!' : mode === 'register' ? 'Join the Saga' : 'School Mode'}
          </h2>
          <p className="text-base md:text-lg text-[#6b7280]">
            {mode === 'login'
              ? 'Sign in to continue your adventure'
              : mode === 'register'
                ? 'Create your account to begin'
                : 'Quick play for classroom use'}
          </p>
        </div>

        {/* Error Display */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{displayError}</p>
          </motion.div>
        )}

        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`flex-1 px-3 py-3 rounded-lg border-2 transition-all duration-300 ${mode === 'login'
              ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white shadow-lg scale-105'
              : 'bg-white/50 border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
              }`}
          >
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              Sign In
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`flex-1 px-3 py-3 rounded-lg border-2 transition-all duration-300 ${mode === 'register'
              ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white shadow-lg scale-105'
              : 'bg-white/50 border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
              }`}
          >
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              Register
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('school')}
            className={`flex-1 px-3 py-3 rounded-lg border-2 transition-all duration-300 ${mode === 'school'
              ? 'bg-gradient-to-br from-[#3d7a8f] to-[#2a5c6f] border-[#1e4d5f] text-white shadow-lg scale-105'
              : 'bg-white/50 border-[#cbd5e1] text-[#6b7280] hover:border-[#8b6f47]'
              }`}
          >
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              School
            </span>
          </button>
        </div>

        {/* Login/Register/School Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* School Mode Fields */}
          {mode === 'school' && (
            <>
              {/* Name Field for School */}
              <div>
                <label
                  htmlFor="schoolName"
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
                    id="schoolName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Room Code Field for School */}
              <div>
                <label
                  htmlFor="roomCode"
                  className="block text-sm font-bold text-[#8b6f47] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Room Code (Optional)
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
                    placeholder="Enter room code"
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Field (login and register modes) */}
          {mode !== 'school' && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                  disabled={isLoading}
                />
              </div>
            </div>

          )}

          {/* Username Field (register only) */}
          {mode === 'register' && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Name Field (register only) */}
          {mode === 'register' && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Full Name
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
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Password Field (both modes) */}
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
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password Field (register only) */}
          {mode === 'register' && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-[#8b6f47] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border-2 border-[#cbd5e1] focus:border-[#8b6f47] focus:outline-none text-[#1e4d5f] placeholder:text-[#cbd5e1]"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Remember Me (login only) */}
          {mode === 'login' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-[#8b6f47] text-[#b8860b] focus:ring-[#8b6f47]"
                disabled={isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-[#6b7280] cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl border-3 shadow-xl transition-all duration-300 ${isLoading
              ? 'bg-[#cbd5e1] border-[#6b7280] text-[#6b7280] cursor-not-allowed opacity-50'
              : 'bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white hover:scale-105 hover:shadow-2xl cursor-pointer'
              }`}
          >
            <span
              className="text-2xl flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {isLoading
                ? 'Loading...'
                : mode === 'login'
                  ? 'Sign In'
                  : mode === 'register'
                    ? 'Create Account'
                    : 'Start Playing'}
            </span>
          </button>
        </form>

        {/* Info text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#6b7280]">
            {mode === 'login'
              ? 'Your progress and achievements will be saved'
              : mode === 'register'
                ? 'By registering, you agree to save your game progress'
                : 'Quick play mode - progress will not be saved'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
