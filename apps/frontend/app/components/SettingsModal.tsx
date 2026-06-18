import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Accessibility, Home, Volume2, X } from 'lucide-react';
import { toast } from "sonner"

interface SettingsModalProps {
  onClose: () => void;
  onReturnToMenu?: () => void;
  onResetProgress?: () => void;
}

export function SettingsModal({
  onClose,
  onReturnToMenu,
  onResetProgress,
}: SettingsModalProps) {
  const [volume, setVolume] = useState(80);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "linear-gradient(135deg, #1a110b, #2c1e15)",
          border: "4px solid #9a793c",
          boxShadow: "0 0 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5)",
          padding: "30px",
          borderRadius: "8px",
          color: "#e2d4bc",
          fontFamily: "serif",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9a793c] hover:text-[#dfb15b] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#dfb15b",
            marginBottom: "30px",
            borderBottom: "2px solid #9a793c",
            paddingBottom: "15px",
            fontSize: "1.8rem",
            letterSpacing: "2px",
            textTransform: "uppercase"
          }}
        >
          Seaded
        </h2>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <span>Muusika helitugevus</span>
            </div>
            <span style={{ color: "#dfb15b" }}>
              {volume}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) =>
              setVolume(Number(e.target.value))
            }
            className="w-full h-2 bg-[#3a2a1a] rounded-lg appearance-none cursor-pointer accent-[#dfb15b]"
          />
        </div>

        <div style={{ marginBottom: "25px", display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {onReturnToMenu && (
            <button
              onClick={() => { onReturnToMenu(); onClose(); }}
              className="flex items-center justify-center gap-3 w-full p-3 bg-[#3a2a1a] border-2 border-[#9a793c] text-[#e2d4bc] hover:bg-[#4a3a2a] hover:text-[#dfb15b] transition-all rounded font-bold uppercase tracking-wider text-sm shadow-lg"
            >
              <Home className="w-5 h-5" />
              Tagasi avamenüüsse
            </button>
          )}

          {onResetProgress && (
            <>
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center justify-center gap-3 w-full p-3 bg-[#421b1b]/40 border-2 border-[#9a3c3c] text-[#ffcccc] hover:bg-[#5a2525]/60 hover:text-white transition-all rounded font-bold uppercase tracking-wider text-sm shadow-lg"
                >
                  <Accessibility className="w-5 h-5" />
                  Alusta uuesti
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 border-2 border-[#9a3c3c] bg-[#2a1111] rounded flex flex-col gap-4 shadow-inner"
                >
                  <p className="text-sm text-center text-[#ffaaaa] leading-relaxed">
                    Hoiatus! See kustutab kogu sinu senise progressi ja kogutud aarded.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="flex-1 p-2 bg-[#3a2a1a] border border-[#9a793c] text-[#e2d4bc] text-xs font-bold uppercase"
                    >
                      Loobu
                    </button>
                    <button
                      onClick={() => {
                        onResetProgress();
                        setShowConfirmReset(false);
                        toast.error("Progressioon on kustutatud.");
                      }}
                      className="flex-1 p-2 bg-[#9a3c3c] hover:bg-[#c44a4a] text-white text-xs font-bold uppercase transition-colors"
                    >
                      Jah, alusta uuesti
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
            gap: "15px"
          }}
        >
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border-2 border-[#9a793c] text-[#9a793c] hover:border-[#dfb15b] hover:text-[#dfb15b] py-3 font-bold uppercase tracking-widest transition-all text-sm rounded"
          >
            Tagasi
          </button>

          <button
            onClick={() => {
              toast.success("Sätted rakendatud!");
              onClose();
            }}
            className="flex-1 bg-gradient-to-b from-[#9a793c] to-[#6a5437] text-white py-3 font-bold uppercase tracking-widest hover:brightness-110 transition-all text-sm rounded shadow-lg"
          >
            Rakenda
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
