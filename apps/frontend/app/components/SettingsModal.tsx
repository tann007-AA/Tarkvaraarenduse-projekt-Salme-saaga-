import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Music, Maximize, Globe, Palette, Accessibility, Home } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { toast } from "sonner"

interface SettingsModalProps {
  onClose: () => void;
  onReturnToMenu?: () => void;
}

export function SettingsModal({
  onClose,
}: SettingsModalProps) {
  const [volume, setVolume] = useState(80);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        style={{
          width: "450px",
          background:
            "linear-gradient(135deg, #1a110b, #2c1e15)",
          border: "4px solid #9a793c",
          boxShadow:
            "0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)",
          padding: "30px",
          borderRadius: "4px",
          color: "#e2d4bc",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#dfb15b",
            marginBottom: "30px",
            borderBottom: "2px solid #9a793c",
            paddingBottom: "15px",
          }}
        >
          Settings
        </h2>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Skald Music (Volume)</span>
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
            style={{
              width: "100%",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "35px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background:
                "linear-gradient(to bottom, #3a2a1a, #22140a)",
              border: "1px solid #9a793c",
              color: "#e2d4bc",
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            Back
          </button>

          <button
            onClick={() => {
              toast.success("Settings applied!");
              onClose();
            }}
            style={{
              background: "linear-gradient(to bottom, #3a2a1a, #22140a)",
              border: "1px solid #9a793c",
              color: "#e2d4bc",
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
