import { Difficulty } from './types';
import { useLanguage } from '../../i18n/LanguageContext';
import { OceanBackground } from '../OceanBackground';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export function DifficultySelector({ onSelect, onBack }: DifficultySelectorProps) {
  const { t } = useLanguage();

  const panelClass =
    'relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 shadow-2xl';
  const buttonBase =
    'group relative w-full px-6 py-4 rounded-xl border-4 shadow-2xl hover:scale-105 transition-all duration-300';
  const overlay =
    'absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300';
  const labelClass =
    'relative text-lg font-bold text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      <OceanBackground />

      <div className={panelClass}>
        <h2
          className="text-white text-2xl font-bold text-center mb-1 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.boardGame.difficulty.title}
        </h2>
        <p className="text-[#d4a574] italic text-sm text-center mb-5">
          {t.boardGame.difficulty.subtitle}
        </p>

        <div className="bg-[#f4ede1]/90 p-4 rounded-lg border border-[#d4a574]/30 mb-6 text-sm leading-relaxed max-h-60 overflow-y-auto text-[#1e4d5f]">
          <b className="block mb-2 text-xs uppercase tracking-wider">{t.boardGame.difficulty.rulesTitle}</b>
          <p className="mb-2">{t.boardGame.difficulty.intro}</p>
          <p className="mb-1">
            <b className="text-[#2c3e50]">{t.boardGame.difficulty.defenderGoal}</b>
          </p>
          <p className="mb-1">
            <b className="text-[#b83b30]">{t.boardGame.difficulty.attackerGoal}</b>
          </p>
          <p>{t.boardGame.difficulty.movement}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelect(Difficulty.Easy)}
            className={`${buttonBase} bg-gradient-to-b from-green-600 to-green-700 border-green-800 hover:shadow-green-600/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.difficulty.easy}</span>
          </button>

          <button
            onClick={() => onSelect(Difficulty.Medium)}
            className={`${buttonBase} bg-gradient-to-b from-yellow-500 to-yellow-600 border-yellow-700 hover:shadow-yellow-500/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.difficulty.medium}</span>
          </button>

          <button
            onClick={() => onSelect(Difficulty.Hard)}
            className={`${buttonBase} bg-gradient-to-b from-red-600 to-red-800 border-red-900 hover:shadow-red-600/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.difficulty.hard}</span>
          </button>

          <button
            onClick={onBack}
            className={`${buttonBase} bg-gradient-to-b from-[#6b7280] to-[#4b5563] border-[#374151] hover:shadow-[#6b7280]/50`}
          >
            <div className={overlay} />
            <span className={labelClass}>{t.boardGame.difficulty.back}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
