import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';

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
            <span className="ormar-emoji">🧔‍♂️</span>
            <span className="ormar-name">Ormar Raudhabe</span>
          </div>
          <div className="garm-character">
            <span className="garm-emoji">🐕‍🦺</span>
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
