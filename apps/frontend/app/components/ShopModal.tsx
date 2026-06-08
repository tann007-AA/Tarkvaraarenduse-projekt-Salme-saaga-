import { motion } from 'motion/react';
import { X, ShoppingCart, Coins } from 'lucide-react';
import type { ArtifactType } from '../App';
import { useLanguage } from '../i18n/LanguageContext';

interface ShopModalProps {
  onClose: () => void;
  points: number;
  inventory: ArtifactType[];
  purchaseHistory: { [key in ArtifactType]?: number };
  onPurchase: (artifactType: ArtifactType) => void;
}

const ARTIFACT_COST = 100;
const MAX_PURCHASES = 1;

export function ShopModal({ onClose, points, inventory, purchaseHistory, onPurchase }: ShopModalProps) {
  const { t } = useLanguage();

  const artifacts: Array<{ type: ArtifactType; name: string; desc: string; icon: string }> = [
    { type: 'sword', name: t.artifacts.sword, desc: t.artifacts.swordDesc, icon: '⚔️' },
    { type: 'shield', name: t.artifacts.shield, desc: t.artifacts.shieldDesc, icon: '🛡️' },
    { type: 'knife', name: t.artifacts.knife, desc: t.artifacts.knifeDesc, icon: '🔪' },
    { type: 'dice', name: t.artifacts.dice, desc: t.artifacts.diceDesc, icon: '🎲' },
    { type: 'gaming-piece', name: t.artifacts.gamingPiece, desc: t.artifacts.gamingPieceDesc, icon: '♟️' }
  ];

  const canPurchase = (artifact: ArtifactType) => {
    const timesPurchased = purchaseHistory[artifact] || 0;
    return points >= ARTIFACT_COST && timesPurchased < MAX_PURCHASES;
  };

  const getPurchaseStatus = (artifact: ArtifactType) => {
    const timesPurchased = purchaseHistory[artifact] || 0;
    const inInventoryCount = inventory.filter(a => a === artifact).length;

    if (timesPurchased >= MAX_PURCHASES) {
      return { text: 'Sold Out', color: 'text-[#8b2e2e]' };
    }
    if (inInventoryCount > 0) {
      return { text: `In Inventory (${inInventoryCount})`, color: 'text-[#2d5016]' };
    }
    return { text: 'Available', color: 'text-[#d4a574]' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#f4ede1] via-[#e8dcc8] to-[#d4c4a8] rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl max-w-3xl w-full p-6 md:p-8 my-4 max-h-[90vh] overflow-y-auto"
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-3"
          >
            <div className="bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-full p-3 md:p-4 border-3 md:border-4 border-[#8b6f47] shadow-xl">
              <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl text-[#1e4d5f] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Artifact Shop
          </h2>
          <p className="text-base md:text-lg text-[#6b7280] mb-4">
            Purchase powerful artifacts to aid your journey
          </p>

          {/* Points Display */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#b8860b] px-6 py-3 rounded-xl border-2 border-[#8b6f47] shadow-lg">
            <Coins className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {points} Points
            </span>
          </div>
        </div>

        {/* Shop Info */}
        <div className="bg-white/50 rounded-lg p-4 mb-6 border-2 border-[#8b6f47]">
          <p className="text-sm md:text-base text-[#1e4d5f] text-center">
            <span className="font-bold">💰 Each artifact costs {ARTIFACT_COST} points</span>
            <br />
            <span className="text-xs md:text-sm text-[#6b7280]">
              Earn +30 points for correct answers, -10 for wrong answers. Each artifact can be purchased once.
            </span>
          </p>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((artifact, idx) => {
            const canBuy = canPurchase(artifact.type);
            const status = getPurchaseStatus(artifact.type);
            const timesPurchased = purchaseHistory[artifact.type] || 0;

            return (
              <motion.div
                key={artifact.type}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-xl p-5 border-3 shadow-lg ${
                  canBuy
                    ? 'border-[#d4a574] hover:shadow-xl hover:scale-105 transition-all'
                    : 'border-[#cbd5e1] opacity-75'
                }`}
              >
                {/* Artifact Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-full flex items-center justify-center text-4xl border-3 border-[#8b6f47] shadow-md">
                    {artifact.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-lg md:text-xl text-[#1e4d5f] font-bold mb-1"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {artifact.name}
                    </h3>
                    <p className="text-sm text-[#6b7280]">{artifact.desc}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${status.color}`}>
                    {status.text}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    Purchased: {timesPurchased}/{MAX_PURCHASES}
                  </span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => canBuy && onPurchase(artifact.type)}
                  disabled={!canBuy}
                  className={`w-full py-3 rounded-lg border-2 font-bold transition-all ${
                    canBuy
                      ? 'bg-gradient-to-b from-[#d4a574] to-[#b8860b] border-[#8b6f47] text-white hover:scale-105 shadow-md cursor-pointer'
                      : 'bg-[#cbd5e1] border-[#6b7280] text-[#6b7280] cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {canBuy ? (
                    <>
                      <Coins className="w-4 h-4 inline mr-2" />
                      Buy for {ARTIFACT_COST} Points
                    </>
                  ) : timesPurchased >= MAX_PURCHASES ? (
                    'Sold Out'
                  ) : (
                    <>Need {ARTIFACT_COST - points} more points</>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white rounded-lg border-2 border-[#8b6f47] text-[#8b6f47] hover:bg-[#f4ede1] transition-all font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Close Shop
          </button>
        </div>
      </motion.div>
    </div>
  );
}
