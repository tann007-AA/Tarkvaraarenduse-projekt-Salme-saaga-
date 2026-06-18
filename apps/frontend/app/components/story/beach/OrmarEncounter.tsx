import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';

import ORMAR_IMAGE from '../character/Ormar.png';
import GARM_IMAGE from '../character/Garm.png';

interface OrmarEncounterProps {
  onComplete: () => void;
  onRewardCollect?: (rewardId: string) => void;
}

export function OrmarEncounter({ onComplete, onRewardCollect }: OrmarEncounterProps) {
  const [dialogueId, setDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.ormarArrival);
  const [rewardCollected, setRewardCollected] = useState(false);

  return (
    <div className="ormar-overlay">
      <div className="ormar-scene">
        <div className="ormar-figures" aria-hidden="true">
          <div className="ormar-character">
            <img
              className="ormar"
              src={ORMAR_IMAGE}
              alt="Bearded man"
              style={{ width: 150, height: 150, objectFit: 'contain' }}
            />
            <span className="ormar-name">Ormar Raudhabe</span>
          </div>
          <div className="garm-character">
            <img
              className="garm"
              src={GARM_IMAGE}
              alt="Dog"
              style={{ width: 150, height: 150, objectFit: 'contain' }}
            />
            <span className="garm-name">Garm</span>
          </div>
        </div>

        <DialogueBox
          dialogueId={dialogueId}
          onComplete={() => {
            if (!rewardCollected) {
              onRewardCollect?.('whalebone-dice');
              setRewardCollected(true);
            }
            setDialogueId(null);
            onComplete();
          }}
        />
      </div>
    </div>
  );
}
