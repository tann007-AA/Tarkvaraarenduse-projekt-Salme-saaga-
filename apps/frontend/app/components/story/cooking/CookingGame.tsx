import React, { useState, useCallback, useEffect } from 'react';
import { Draggable, DropZone } from '../Draggable';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';
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

export function CookingGame({ isOpen, onClose, onComplete }: CookingGameProps) {
  const [collected, setCollected] = useState<string[]>([]);
  const [dialogueId, setDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.cookingStart);
  const [shuffled, setShuffled] = useState<Ingredient[]>([]);
  const [shakePot, setShakePot] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [steamParticles, setSteamParticles] = useState<number[]>([]);

  const resetGame = useCallback(() => {
    setShuffled([...INGREDIENTS].sort(() => Math.random() - 0.5));
    setCollected([]);
    setDialogueId(DIALOGUE_TRIGGERS.cookingStart);
    setCompleted(false);
    setShakePot(false);
    setSuccessPulse(false);
    setSteamParticles([]);
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
        setDialogueId(DIALOGUE_TRIGGERS.cookingCorrect);
        setSuccessPulse(true);
        setTimeout(() => setSuccessPulse(false), 600);

        if (newCollected.length >= 3) {
          setTimeout(() => {
            setCompleted(true);
            setDialogueId(DIALOGUE_TRIGGERS.afterCooking);
          }, 900);
        } else if (newCollected.length === 2) {
          setTimeout(() => setDialogueId(DIALOGUE_TRIGGERS.cookingAlmost), 1500);
        }
      } else {
        setShakePot(true);
        setTimeout(() => setShakePot(false), 500);
        if (ingredient.humor === 'ivar') {
          if (ingredient.id === 'arrow') setDialogueId(DIALOGUE_TRIGGERS.cookingWrongArrow);
          else if (ingredient.id === 'bone') setDialogueId(DIALOGUE_TRIGGERS.cookingWrongBone);
        } else {
          setDialogueId(DIALOGUE_TRIGGERS.cookingWrongGeneric);
        }
      }
    },
    [collected, completed]
  );

  const isAdded = (id: string) => collected.includes(id);

  const getMainButtonLabel = () => {
    if (completed) return '✅ Valmis';
    return `🔥 Lisa koostisosad (${collected.length}/3)`;
  };

  if (!isOpen) return null;

  return (
    <div className="cooking-overlay">
      <div
        className="cooking-backdrop"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div className="leather-panel">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="panel-content">
          <div className="kitchen-section">
            <div className="kitchen-header">
              <span className="fire-icon">🔥</span>
              <h3>KÖÖK</h3>
            </div>

            <div className="recipe-info">
              <strong>Valmista retkele süüa!</strong> Pane potti <strong>3 õiget</strong> koostisosa.
              <br />
              <span className="hint-text">
                Lohista koostisosad potti või klõpsa neile
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

            <div className="cooking-game-layout">
              <div className="pot-side">
                <div className="pot-side-title">🍲 Pott</div>
                <div className="pot-area">
                  <DropZone
                    zoneId="pot"
                    className={`soup-pot ${shakePot ? 'shake' : ''} ${successPulse ? 'pulse-success' : ''
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
              </div>

              <div className="ingredients-side">
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
              </div>
            </div>

            <button
              className={`cook-btn ${completed ? 'ready' : ''}`}
              onClick={completed ? onComplete : undefined}
              disabled={!completed}
            >
              {collected.length >= 3
                ? '♨️ Keeda!'
                : `Lisa koostisosad (${collected.length}/3)`}
            </button>
          </div>

          <DialogueBox
            dialogueId={dialogueId}
            onComplete={() => {
              if (completed) {
                onComplete();
                setTimeout(() => onClose(), 350);
              } else {
                setDialogueId(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
