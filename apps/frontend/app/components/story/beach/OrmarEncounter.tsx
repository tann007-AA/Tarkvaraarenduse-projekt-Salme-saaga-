import { useState } from 'react';
import { DialogueBox } from '../DialogueBox';
import { ChoiceBox } from '../ChoiceBox';

interface OrmarEncounterProps {
  onComplete: () => void;
  onRewardCollect?: (rewardId: string) => void;
}

const ORMAR_LINES = [
  {
    speaker: 'Ormar Raudhabe',
    avatar: '🧔‍♂️',
    text: 'Esimene retk on nagu esimene kord külma vette hüpata — hinge tõmbab kinni, aga pärast tunned, et oled elus. Ole nagu Garm — vali ja ustav.',
  },
  {
    speaker: 'Ormar Raudhabe',
    avatar: '🧔‍♂️',
    text: 'Kui meri muutub igavaks, siis veereta neid. Need toovad meelde, et elu on mäng õnne ja tarkusega.',
  },
];

export function OrmarEncounter({ onComplete, onRewardCollect }: OrmarEncounterProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [rewardGiven, setRewardGiven] = useState(false);

  const currentLine = ORMAR_LINES[lineIndex];
  const isLastLine = lineIndex >= ORMAR_LINES.length - 1;

  const handleAdvance = () => {
    if (!rewardGiven && lineIndex === 0) {
      setRewardGiven(true);
      onRewardCollect?.('whalebone-dice');
    }

    if (isLastLine) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  };

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

        <div className="ormar-dialogue-panel">
          <DialogueBox
            speaker={currentLine.speaker}
            avatar={currentLine.avatar}
            text={currentLine.text}
          />

          <button className="beach-phase-btn" onClick={handleAdvance}>
            {isLastLine ? '✅ Täname kingituse eest' : '🎲 Võta täringud vastu'}
          </button>
        </div>
      </div>
    </div>
  );
}
