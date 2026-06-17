import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';

interface PushOffDialogueProps {
  onComplete: () => void;
}

export function PushOffDialogue({ onComplete }: PushOffDialogueProps) {
  const [dialogueId, setDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.pushOff ?? 'e3_ulemin_merele');

  return (
    <div className="pushoff-overlay">
      <div className="pushoff-scene">
        <div className="pushoff-visual" aria-hidden="true">
          <span className="pushoff-ship">🛶</span>
          <span className="pushoff-splash">🌊</span>
        </div>

        <DialogueBox
          dialogueId={dialogueId}
          onComplete={() => {
            setDialogueId(null);
            onComplete();
          }}
        />

        {!dialogueId && (
          <button className="beach-phase-btn pushoff-btn" onClick={onComplete}>
            🌊 Avamerelle
          </button>
        )}
      </div>
    </div>
  );
}
