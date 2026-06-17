import { DialogueBox } from '../DialogueBox';

interface PushOffDialogueProps {
  onComplete: () => void;
}

export function PushOffDialogue({ onComplete }: PushOffDialogueProps) {
  return (
    <div className="pushoff-overlay">
      <div className="pushoff-scene">
        <div className="pushoff-visual" aria-hidden="true">
          <span className="pushoff-ship">🛶</span>
          <span className="pushoff-splash">🌊</span>
        </div>

        <div className="pushoff-dialogue-panel">
          <DialogueBox
            speaker="Ormar Raudhabe"
            avatar="🧔‍♂️"
            text="LÜKKAME! Meie saatus ootab lainete taga!"
          />

          <p className="pushoff-sfx">Puidu krigin, laev vette...</p>

          <button className="beach-phase-btn pushoff-btn" onClick={onComplete}>
            🌊 Avamerelle
          </button>
        </div>
      </div>
    </div>
  );
}
