import { useState } from 'react';
import { ChoiceBox } from '../ChoiceBox';
import { DialogueBox } from '../DialogueBox';
import './HnefataflStory.css';

interface HnefataflLoopChoiceProps {
  isOpen: boolean;
  onRetry: () => void;
  onEnough: () => void;
  onClose: () => void;
}

const GUNNAR_ADVICE = [
  {
    speaker: 'Gunnar',
    avatar: '🛡️',
    text: 'Hnefataflis on kõige tähtsam kannatlikkus. Ärgu kuningas ruttu liigu — las ta ootab õiget hetke.',
  },
  {
    speaker: 'Gunnar',
    avatar: '🛡️',
    text: 'Kaitsjad peavad kaitsma kuningat ja looma talle tee nurka. Ründajad peavad teda piirama.',
  },
  {
    speaker: 'Gunnar',
    avatar: '🛡️',
    text: 'Kui vastane seab enda nupu kahe suure vahele, võid ta võtta. Aga ära unusta — sama kehtib ka sinu kohta.',
  },
];

export function HnefataflLoopChoice({ isOpen, onRetry, onEnough, onClose }: HnefataflLoopChoiceProps) {
  const [gunnarIndex, setGunnarIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleChoice = (choiceId: string) => {
    if (choiceId === 'retry') {
      setGunnarIndex(null);
      onRetry();
    } else if (choiceId === 'enough') {
      setGunnarIndex(null);
      onEnough();
    } else if (choiceId === 'ask-gunnar') {
      setGunnarIndex((current) => {
        const next = current === null ? 0 : (current + 1) % GUNNAR_ADVICE.length;
        return next;
      });
    }
  };

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" onClick={(e) => { e.stopPropagation(); onClose(); }} />

      <div className="leather-panel hnefatafl-story-panel">
        <div className="panel-content">
          <div className="panel-title">⚔️ Mäng läbi</div>
          <div className="panel-subtitle">Mis edasi?</div>

          <div className="longhouse-section">
            <div className="kitchen-header">
              <span className="fire-icon">⚔️</span>
              <h3>VALIK</h3>
            </div>

            <div className="recipe-info">
              <strong>Björn mängis hnefataflit.</strong> Kas proovid uuesti, küsid
              Gunnarilt nõu või oled piisavalt õppinud?
            </div>

            <ChoiceBox
              options={[
                { id: 'retry', label: '🔁 Proovi uuesti' },
                { id: 'ask-gunnar', label: '❓ Küsi Gunnarilt' },
                { id: 'enough', label: '✅ Piisab' },
              ]}
              onSelect={handleChoice}
              selectedId={null}
            />

            {gunnarIndex !== null && (
              <div className="mt-4">
                <DialogueBox
                  speaker={GUNNAR_ADVICE[gunnarIndex].speaker}
                  avatar={GUNNAR_ADVICE[gunnarIndex].avatar}
                  text={GUNNAR_ADVICE[gunnarIndex].text}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
