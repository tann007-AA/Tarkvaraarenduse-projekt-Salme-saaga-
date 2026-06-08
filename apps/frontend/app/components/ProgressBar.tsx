import { motion } from 'motion/react';
import { Check, Lock } from 'lucide-react';

interface ProgressBarProps {
  islands: Array<{ id: number; name: string }>;
  currentIslandIndex: number;
  completedIslands: number[];
}

export function ProgressBar({ islands, currentIslandIndex, completedIslands }: ProgressBarProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[95vw]">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 md:border-3 border-[#8b6f47] shadow-2xl p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          {islands.map((island, idx) => {
            const isCompleted = completedIslands.includes(island.id);
            const isCurrent = idx === currentIslandIndex;
            const isLocked = idx > currentIslandIndex;

            return (
              <div key={island.id} className="flex items-center">
                {/* Island marker */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: isCurrent ? Infinity : 0,
                    }
                  }}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-3 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#2d5016] to-[#4a7a35] border-[#2d5016]'
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#d4a574] to-[#b8860b] border-[#8b6f47]'
                        : isLocked
                        ? 'bg-[#cbd5e1] border-[#6b7280]'
                        : 'bg-gradient-to-br from-[#8b6f47] to-[#6b5437] border-[#654321]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-[#6b7280]" />
                    ) : (
                      <span className="text-white font-bold text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Island name tooltip - hidden on mobile */}
                  <div className="hidden md:block absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        isCurrent
                          ? 'bg-[#8b6f47] text-white font-bold'
                          : 'bg-[#8b6f47] text-white'
                      }`}
                    >
                      {island.name}
                    </div>
                  </div>
                </motion.div>

                {/* Connector line */}
                {idx < islands.length - 1 && (
                  <div className="w-4 md:w-8 h-1">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#2d5016] to-[#4a7a35]'
                          : 'bg-[#cbd5e1]'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
