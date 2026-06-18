import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';
import VikingShip from '../character/VikingShip.png';

interface PushOffDialogueProps {
  onComplete: () => void;
}

export function PushOffDialogue({ onComplete }: PushOffDialogueProps) {
  const [dialogueId, setDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.pushOff ?? 'e3_ulemin_merele');
  const [isPushingOff, setIsPushingOff] = useState(false);

  const triggerPushOff = () => {
    setIsPushingOff(true);
    // burst splash settles after a moment, but ambient splash/bob keeps going via CSS
  };

  return (
    <div className="pushoff-overlay">
      <div className="pushoff-scene">
        <div
          className={`ship-wrapper ${isPushingOff ? 'ship-pushing-off' : ''}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '150px',
            transform: 'translate(-50%, -50%) scale(5)',
            transformOrigin: 'center center',
          }}
        >
          <div className="ship-splash" aria-hidden="true">
            <span className="splash-pixel p1" />
            <span className="splash-pixel p2" />
            <span className="splash-pixel p3" />
            <span className="splash-pixel p4" />
            <span className="splash-pixel p5" />
            <span className="splash-pixel p6" />
            <span className="splash-pixel p7" />
            <span className="splash-pixel p8" />
          </div>
          <img
            src={VikingShip}
            alt="Viking Ship"
            className="character ship-bob"
            style={{ width: '150px', height: 'auto', position: 'relative', zIndex: 2 }}
          />
        </div>

        <DialogueBox
          dialogueId={dialogueId}
          onComplete={() => {
            setDialogueId(null);
            triggerPushOff();
          }}
        />
        {!dialogueId && (
          <button
            className="beach-phase-btn pushoff-btn"
            onClick={() => {
              triggerPushOff();
              onComplete();
            }}
          >
            🌊 Avamerelle
          </button>
        )}
      </div>
    </div>
  );
}
