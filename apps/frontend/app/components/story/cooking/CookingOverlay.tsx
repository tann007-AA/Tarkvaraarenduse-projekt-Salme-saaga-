// apps/frontend/app/components/story/cooking/CookingGame.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  { id: 'bread', emoji: '🍞', name: 'Leib', correct: false },
  { id: 'cheese', emoji: '🧀', name: 'Juust', correct: false },
  { id: 'fish', emoji: '🐟', name: 'Heeringas', correct: true },
  { id: 'apple', emoji: '🍎', name: 'Õun', correct: false },
];

const DIALOGUES: Record<string, { speaker: string; avatar: string; text: string }> = {
  start: { speaker: 'Haldor', avatar: '🧔', text: 'Björn, see leem on sul täna kuidagi õhuke... Aja suppi! Viska potti 3 õiget koostisosa.' },
  hint: { speaker: 'Ivar', avatar: '⚔️', text: 'Viska sinna midagi rammusat sisse, muidu me ei jaksa homme isegi aeru tõsta.' },
  wrong_arrow: { speaker: 'Ivar', avatar: '⚔️', text: 'Hei! Kas sa proovid meid nooleotsadega toita? Hoia need vaenlaste jaoks!' },
  wrong_bone: { speaker: 'Ivar', avatar: '⚔️', text: 'See luu on juba korjatud puhtaks. Midagi söödavat seal pole!' },
  wrong_generic: { speaker: 'Haldor', avatar: '🧔', text: 'See ei sobi suppi. Midagi tugevamat on vaja!' },
  correct: { speaker: 'Haldor', avatar: '🧔', text: 'Jah, just seda vajasime! Supp pakseneb.' },
  ready: { speaker: 'Gunnar', avatar: '🛡️', text: 'Supp on valmis! Mehed, söök ja siis laevale – Gotland ootab!' },
  almost: { speaker: 'Ivar', avatar: '⚔️', text: 'Veel natuke! Meil on vaja 3 koostisosa.' },
};

export function CookingGame({ isOpen, onClose, onComplete }: CookingGameProps) {
  const [collected, setCollected] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState(DIALOGUES.start);
  const [shuffled, setShuffled] = useState<Ingredient[]>([]);
  const [shakePot, setShakePot] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [steamParticles, setSteamParticles] = useState<number[]>([]);
  const potRef = useRef<HTMLDivElement>(null);

  // Shuffle ingredients on open
  useEffect(() => {
    if (isOpen) {
      setShuffled([...INGREDIENTS].sort(() => Math.random() - 0.5));
      setCollected([]);
      setDialogue(DIALOGUES.start);
      setCompleted(false);
      setShakePot(false);
      setSuccessPulse(false);
      setSteamParticles([]);
    }
  }, [isOpen]);

  // Add steam particles when ingredients added
  useEffect(() => {
    if (collected.length > 0 && collected.length < 3) {
      const newParticles = Array.from({ length: 5 }, (_, i) => Date.now() + i);
      setSteamParticles(newParticles);
      const timer = setTimeout(() => setSteamParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [collected.length]);

  const handleDrop = useCallback((ingredientId: string) => {
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
          setDialogue(DIALOGUES.ready);
          setCompleted(true);
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
  }, [collected, completed]);

  const handleFinish = () => {
    if (collected.length >= 3) {
      onComplete();
      setTimeout(() => onClose(), 500);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('ingredientId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePotDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('ingredientId');
    if (id) handleDrop(id);
  };

  const handlePotDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const isAdded = (id: string) => collected.includes(id);

  // Touch/mobile support
  const handleTouchStart = (e: React.TouchEvent, ingredient: Ingredient) => {
    if (isAdded(ingredient.id) || completed) return;
    const touch = e.touches[0];
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();

    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.left = (touch.clientX - rect.width / 2) + 'px';
    el.style.top = (touch.clientY - rect.height / 2) + 'px';
    el.classList.add('dragging-touch');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const el = e.currentTarget as HTMLElement;
    el.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
    el.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';
  };

  const handleTouchEnd = (e: React.TouchEvent, ingredient: Ingredient) => {
    const el = e.currentTarget as HTMLElement;
    el.style.position = '';
    el.style.zIndex = '';
    el.style.left = '';
    el.style.top = '';
    el.classList.remove('dragging-touch');

    const touch = e.changedTouches[0];
    const pot = potRef.current;
    if (pot) {
      const rect = pot.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        handleDrop(ingredient.id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" onClick={onClose} />

      <div className="leather-panel">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="panel-content">
          <div className="kitchen-section">
            <div className="kitchen-header">
              <span className="fire-icon">🔥</span>
              <h3>KÖÖK</h3>
            </div>

            <div className="recipe-info">
              <strong>Valmista retkele süüa!</strong> Lisa potti <strong>3 õiget</strong> koostisosa.
              <br />
              <span className="hint-text">💡 Vihje: Lohista koostisosad potti või klõpsa neile</span>
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
              <div 
                ref={potRef}
                className={`soup-pot ${shakePot ? 'shake' : ''} ${successPulse ? 'pulse-success' : ''} ${completed ? 'completed' : ''}`}
                onDrop={handlePotDrop}
                onDragOver={handlePotDragOver}
              >
                <div className="pot-content">
                  <span className="pot-emoji">🍲</span>
                  {steamParticles.map((id) => (
                    <span key={id} className="steam-particle">♨️</span>
                  ))}
                  {completed && <span className="completion-check">✅</span>}
                </div>
                <span className="soup-pot-label">
                  {completed ? 'Valmis!' : 'Aja suppi'}
                </span>
              </div>
            </div>

            <div className="ingredients-title">🥘 Koostisosad</div>
            <div className="ingredients-grid">
              {shuffled.map((ing: Ingredient) => (
                <div
                  key={ing.id}
                  className={`ingredient-item ${isAdded(ing.id) ? 'added' : ''}`}
                  draggable={!isAdded(ing.id) && !completed}
                  onDragStart={(e) => handleDragStart(e, ing.id)}
                  onClick={() => !isAdded(ing.id) && !completed && handleDrop(ing.id)}
                  onTouchStart={(e) => handleTouchStart(e, ing)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, ing)}
                >
                  <div className="ingredient-inner">
                    <span className="ingredient-emoji">{ing.emoji}</span>
                    <span className="ingredient-name">{ing.name}</span>
                    {isAdded(ing.id) && <span className="added-check">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className={`cook-btn ${collected.length >= 3 ? 'ready' : ''}`}
              onClick={handleFinish}
              disabled={collected.length < 3}
            >
              {collected.length >= 3 ? '🎉 Supp on valmis! Naudi!' : `🔥 Lisa koostisosad (${collected.length}/3)`}
            </button>
          </div>

          <div className="dialogue-box">
            <div className="dialogue-avatar">{dialogue.avatar}</div>
            <div className="dialogue-content">
              <div className="dialogue-speaker">{dialogue.speaker}</div>
              <div className="dialogue-text">"{dialogue.text}"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}