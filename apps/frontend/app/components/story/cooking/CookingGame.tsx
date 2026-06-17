import React, { useState, useCallback, useEffect } from 'react';
import { Draggable, DropZone } from '../Draggable';
import { DialogueBox } from '../DialogueBox';
import './CookingGame.css';

interface CookingGameProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface Ingredient {
  id: string;
  emoji: string;
  name: string;
  correct: boolean;
  humor?: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'lamb', emoji: '🍖', name: 'Lamba kints', correct: true },
  { id: 'beef', emoji: '🥩', name: 'Veiseliha', correct: true },
  { id: 'boar', emoji: '🐗', name: 'Metssea tagaosa', correct: true },
  { id: 'turnip', emoji: '🥔', name: 'Naerid', correct: true },
  { id: 'arrow', emoji: '🏹', name: 'Nooleots', correct: false, humor: 'ivar' },
  { id: 'bone', emoji: '🦴', name: 'Luu', correct: false, humor: 'ivar' },
  { id: 'fish', emoji: '🐟', name: 'Heeringas', correct: false },
  { id: 'bread', emoji: '🍞', name: 'Leib', correct: false },
  { id: 'cheese', emoji: '🧀', name: 'Juust', correct: false },
  { id: 'apple', emoji: '🍎', name: 'Õun', correct: false },
];

interface DialogueLine {
  speaker: string;
  avatar: string;
  text: string;
}

const DIALOGUES: Record<string, DialogueLine> = {
  start: {
    speaker: 'Haldor',
    avatar: '🧔',
    text: 'Björn, see leem on sul täna kuidagi õhuke... Aja suppi! Viska potti 3 õiget koostisosa.',
  },
  hint: {
    speaker: 'Ivar',
    avatar: '⚔️',
    text: 'Viska sinna midagi rammusat sisse, muidu me ei jaksa homme isegi aeru tõsta.',
  },
  wrong_arrow: {
    speaker: 'Ivar',
    avatar: '⚔️',
    text: 'Hei! Kas sa proovid meid nooleotsadega toita? Hoia need vaenlaste jaoks!',
  },
  wrong_bone: {
    speaker: 'Ivar',
    avatar: '⚔️',
    text: 'See luu on juba korjatud puhtaks. Midagi söödavat seal pole!',
  },
  wrong_generic: {
    speaker: 'Haldor',
    avatar: '🧔',
    text: 'See ei sobi suppi. Midagi tugevamat on vaja!',
  },
  correct: {
    speaker: 'Haldor',
    avatar: '🧔',
    text: 'Jah, just seda vajasime! Supp pakseneb.',
  },
  almost: {
    speaker: 'Ivar',
    avatar: '⚔️',
    text: 'Veel natuke! Meil on vaja 3 koostisosa.',
  },
};

const EPILOGUE: DialogueLine[] = [
  {
    speaker: 'Gunnar',
    avatar: '🛡️',
    text: 'Sööge kõhud täis. Björn... seekord lükkad sa laeva vette koos meiega. Sa oled meeskonnas.',
  },
  {
    speaker: 'Björn',
    avatar: '🧑',
    text: 'Lõpuks ometi! Ma juba kartsin, et pean jälle Sigridiga võid kloppima!',
  },
  {
    speaker: 'Haldor',
    avatar: '🧔',
    text: 'Ära kirtsuta nina, Björn. See võiklopsimine on su käevarred sitkeks teinud.',
  },
  {
    speaker: 'Ivar',
    avatar: '⚔️',
    text: 'Tõeline viiking on peremees, kes teab, millal põldu künda. Ta on strateeg, kes teab, millal rünnata ja millal taanduda. Ja ta on mees, kes on igal hetkel valmis astuma Valhalla väravatest sisse.',
  },
];

export function CookingGame({ isOpen, onClose, onComplete }: CookingGameProps) {
  const [collected, setCollected] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<DialogueLine>(DIALOGUES.start);
  const [shuffled, setShuffled] = useState<Ingredient[]>([]);
  const [shakePot, setShakePot] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [steamParticles, setSteamParticles] = useState<number[]>([]);
  const [epilogueIndex, setEpilogueIndex] = useState<number | null>(null);

  const resetGame = useCallback(() => {
    setShuffled([...INGREDIENTS].sort(() => Math.random() - 0.5));
    setCollected([]);
    setDialogue(DIALOGUES.start);
    setCompleted(false);
    setShakePot(false);
    setSuccessPulse(false);
    setSteamParticles([]);
    setEpilogueIndex(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen, resetGame]);

  useEffect(() => {
    if (collected.length > 0 && collected.length < 3) {
      const newParticles = Array.from({ length: 2 }, (_, i) => Date.now() + i);
      setSteamParticles(newParticles);
      const timer = setTimeout(() => setSteamParticles([]), 1300);
      return () => clearTimeout(timer);
    }
  }, [collected.length]);

  const handleDrop = useCallback(
    (ingredientId: string) => {
      if (collected.includes(ingredientId) || completed) return;

      const ingredient = INGREDIENTS.find((ing: Ingredient) => ing.id === ingredientId);
      if (!ingredient) return;

      if (ingredient.correct) {
        const newCollected = [...collected, ingredientId];
        setCollected(newCollected);
        setDialogue(DIALOGUES.correct);
        setSuccessPulse(true);
        setTimeout(() => setSuccessPulse(false), 600);

        if (newCollected.length >= 3) {
          setTimeout(() => {
            setCompleted(true);
            setEpilogueIndex(0);
            setDialogue(EPILOGUE[0]);
          }, 900);
        } else if (newCollected.length === 2) {
          setTimeout(() => setDialogue(DIALOGUES.almost), 1500);
        }
      } else {
        setShakePot(true);
        setTimeout(() => setShakePot(false), 500);
        if (ingredient.humor === 'ivar') {
          if (ingredient.id === 'arrow') setDialogue(DIALOGUES.wrong_arrow);
          else if (ingredient.id === 'bone') setDialogue(DIALOGUES.wrong_bone);
        } else {
          setDialogue(DIALOGUES.wrong_generic);
        }
      }
    },
    [collected, completed]
  );

  const handleAdvance = () => {
    if (epilogueIndex === null) return;

    if (epilogueIndex < EPILOGUE.length - 1) {
      const nextIndex = epilogueIndex + 1;
      setEpilogueIndex(nextIndex);
      setDialogue(EPILOGUE[nextIndex]);
    } else {
      onComplete();
      setTimeout(() => onClose(), 350);
    }
  };

  const isAdded = (id: string) => collected.includes(id);

  const getMainButtonLabel = () => {
    if (completed) {
      if (epilogueIndex === null) return '🎉 Supp on valmis!';
      return epilogueIndex < EPILOGUE.length - 1 ? 'Järgmine →' : '✅ Valmis';
    }
    return `🔥 Lisa koostisosad (${collected.length}/3)`;
  };

  if (!isOpen) return null;

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" onClick={onClose} />

      <div className="leather-panel">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="panel-content">
          <div className="panel-title">🍲 Björni Paun</div>
          <div className="panel-subtitle">Viikingi varustus</div>

          <div className="kitchen-section">
            <div className="kitchen-header">
              <span className="fire-icon">🔥</span>
              <h3>KÖÖK</h3>
            </div>

            <div className="recipe-info">
              <strong>Valmista retkele süüa!</strong> Lisa potti <strong>3 õiget</strong> koostisosa.
              <br />
              <span className="hint-text">
                💡 Vihje: Lohista koostisosad potti või klõpsa neile
              </span>
            </div>

            <div className="soup-progress">
              <span className="soup-pot-mini">🍲</span>
              <div className="progress-track">
                <div
                  className="progress-fill-soup"
                  style={{ width: `${Math.min((collected.length / 3) * 100, 100)}%` }}
                />
                <div className="progress-text-soup">{collected.length} / 3</div>
              </div>
            </div>

            <div className="pot-area">
              <DropZone
                zoneId="pot"
                className={`soup-pot ${shakePot ? 'shake' : ''} ${
                  successPulse ? 'pulse-success' : ''
                } ${completed ? 'completed' : ''}`}
                onDrop={(draggableId: string) => handleDrop(draggableId)}
              >
                <div className="pot-content">
                  <span className="pot-emoji">🍲</span>
                  {steamParticles.map((id, index) => (
                    <span
                      key={id}
                      className="steam-particle"
                      aria-hidden="true"
                      style={
                        {
                          '--steam-offset': `${index === 0 ? -14 : 14}px`,
                          '--steam-delay': `${index * 120}ms`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                  {completed && <span className="completion-check">✅</span>}
                </div>
                <span className="soup-pot-label">{completed ? 'Valmis!' : 'Aja suppi'}</span>
              </DropZone>
            </div>

            <div className="ingredients-title">🥘 Koostisosad</div>
            <div className="ingredients-grid">
              {shuffled.map((ing: Ingredient) => (
                <Draggable
                  key={ing.id}
                  id={ing.id}
                  className={`ingredient-item ${isAdded(ing.id) ? 'added' : ''}`}
                  disabled={isAdded(ing.id) || completed}
                >
                  <div
                    className="ingredient-inner"
                    onClick={() => !isAdded(ing.id) && !completed && handleDrop(ing.id)}
                  >
                    <span className="ingredient-emoji">{ing.emoji}</span>
                    <span className="ingredient-name">{ing.name}</span>
                    {isAdded(ing.id) && <span className="added-check">✓</span>}
                  </div>
                </Draggable>
              ))}
            </div>

            <button
              className={`cook-btn ${completed ? 'ready' : ''}`}
              onClick={completed ? handleAdvance : undefined}
              disabled={!completed}
            >
              {getMainButtonLabel()}
            </button>
          </div>

          <DialogueBox
            speaker={dialogue.speaker}
            avatar={dialogue.avatar}
            text={dialogue.text}
          />
        </div>
      </div>
    </div>
  );
}
