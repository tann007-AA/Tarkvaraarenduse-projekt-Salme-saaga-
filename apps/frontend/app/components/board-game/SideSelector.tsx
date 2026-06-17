import { motion } from 'motion/react';
import { PieceType } from './types';
import { useLanguage } from '../../i18n/LanguageContext';
import { OceanBackground } from '../OceanBackground';

interface SideSelectorProps {
  onSelect: (side: PieceType) => void;
  onBack: () => void;
}

export function SideSelector({ onSelect, onBack }: SideSelectorProps) {
  const { t } = useLanguage();

  const panelClass =
    'relative z-10 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center shadow-2xl';
  const buttonBase =
    'group relative w-full px-6 py-4 rounded-xl border-4 shadow-2xl hover:scale-105 transition-all duration-300';
  const overlay =
    'absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300';
  const labelClass =
    'relative text-lg font-bold';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <OceanBackground />

      <motion.div
        className={panelClass}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h2
          className="text-white text-2xl font-bold mb-6 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.boardGame.side.title}
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => onSelect(PieceType.Attacker)}
            className={`${buttonBase} bg-gradient-to-b from-[#b83b30] to-[#7d221a] border-[#5c1a13] hover:shadow-[#b83b30]/50`}
          >
            <div className={overlay} />
            <span className={`${labelClass} text-white`}>
              {t.boardGame.side.attacker} — {t.boardGame.side.attackerDesc}
            </span>
          </button>

          <button
            onClick={() => onSelect(PieceType.Defender)}
            className={`${buttonBase} bg-gradient-to-b from-[#2c3e50] to-[#1a252f] border-[#0f151c] hover:shadow-[#2c3e50]/50`}
          >
            <div className={overlay} />
            <span className={`${labelClass} text-white`}>
              {t.boardGame.side.defender} — {t.boardGame.side.defenderDesc}
            </span>
          </button>

          <button
            onClick={onBack}
            className={`${buttonBase} bg-gradient-to-b from-[#6b7280] to-[#4b5563] border-[#374151] hover:shadow-[#6b7280]/50`}
          >
            <div className={overlay} />
            <span className={`${labelClass} text-white`}>{t.boardGame.side.back}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
