import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';
import './HnefataflStory.css';

interface HnefataflLoopChoiceProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onEnough: () => void;
}

export function HnefataflLoopChoice({ isOpen, onRetry, onEnough }: HnefataflLoopChoiceProps) {
  const [dialogueId, setDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.hnefataflLoop ?? 'e2_hnefatafl_mangimise_ajal');

  if (!isOpen) return null;

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" />

      <div className="leather-panel hnefatafl-story-panel">
        <div className="panel-content">
          <div className="panel-title">⚔️ Mäng läbi</div>
          <div className="panel-subtitle">Mis edasi?</div>

          <div className="longhouse-section">
            <div className="kitchen-header">
              <span className="fire-icon">⚔️</span>
              <h3>VALIK</h3>
            </div>

            <DialogueBox
              dialogueId={dialogueId}
              onChoice={(label, nextId) => {
                if (nextId === 'e2_hnefatafl_uuesti') {
                  setDialogueId(null);
                  onRetry();
                } else if (nextId === 'e2_ulemin_rannikule') {
                  setDialogueId(null);
                  onEnough();
                } else if (nextId === 'e2_gunnari_selgitus') {
                  setDialogueId('e2_gunnari_selgitus');
                }
              }}
              onComplete={() => {
                setDialogueId(null);
                onEnough();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
