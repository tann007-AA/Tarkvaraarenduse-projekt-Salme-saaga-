import { useState, useCallback, useRef } from 'react';
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
];

const DIALOGUES: Record<string, { speaker: string; avatar: string; text: string }> = {
  start: { speaker: 'Haldor', avatar: '🧔', text: 'Björn, see leem on sul täna kuidagi õhuke...' },
  hint: { speaker: 'Ivar', avatar: '⚔️', text: 'Viska sinna midagi rammusat sisse, muidu me ei jaksa homme isegi aeru tõsta.' },
  wrong_arrow: { speaker: 'Ivar', avatar: '⚔️', text: 'Hei! Kas sa proovid meid nooleotsadega toita? Hoia need vaenlaste jaoks!' },
  wrong_bone: { speaker: 'Ivar', avatar: '⚔️', text: 'See luu on juba korjatud puhtaks. Midagi söödavat seal pole!' },
  wrong_generic: { speaker: 'Haldor', avatar: '🧔', text: 'See ei sobi suppi. Midagi tugevamat on vaja!' },
  correct: { speaker: 'Haldor', avatar: '🧔', text: 'Jah, just seda vajasime! Supp pakseneb.' },
  ready: { speaker: 'Gunnar', avatar: '🛡️', text: 'Supp on valmis! Mehed, söök ja siis laevale – Gotland ootab!' },
};

export function CookingGame({ isOpen, onClose, onComplete }: CookingGameProps) {
  const [collected, setCollected] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState(DIALOGUES.start);
  const [shuffled] = useState(() => [...INGREDIENTS].sort(() => Math.random() - 0.5));
  const [shakePot, setShakePot] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const potRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((ingredient: Ingredient) => {
    if (collected.includes(ingredient.id) || completed) return;

    if (ingredient.correct) {
      setCollected(prev => [...prev, ingredient.id]);
      setDialogue(DIALOGUES.correct);
      setSuccessPulse(true);
      setTimeout(() => setSuccessPulse(false), 600);

      if (collected.length + 1 >= 3) {
        setTimeout(() => {
          setDialogue(DIALOGUES.ready);
          setCompleted(true);
        }, 900);
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
      onClose();
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('ingredientId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePotDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('ingredientId');
    const ingredient = INGREDIENTS.find(ing => ing.id === id);
    if (ingredient) handleDrop(ingredient);
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
    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
    el.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';
    el.classList.add('dragging-touch');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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
        handleDrop(ingredient);
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
          <div className="panel-title">Björni Paun</div>
          <div className="panel-subtitle">Viikingi varustus</div>

          <div className="kitchen-section">
            <div className="kitchen-header">
              <span className="fire-icon">🔥</span>
              <h3>KÖÖK</h3>
            </div>

            <div className="recipe-info">
              <strong>Valmista retkele süüa!</strong> Lisa potti <strong>3 õiget</strong> koostisosa.
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
                className={`soup-pot ${shakePot ? 'shake' : ''} ${successPulse ? 'pulse-success' : ''}`}
                onDrop={handlePotDrop}
                onDragOver={handlePotDragOver}
              >
                🍲
                <span className="soup-pot-label">Aja suppi</span>
              </div>
            </div>

            <div className="ingredients-title">Koostisosad</div>
            <div className="ingredients-grid">
              {shuffled.map(ing => (
                <div
                  key={ing.id}
                  className={`ingredient-item ${isAdded(ing.id) ? 'added' : ''}`}
                  draggable={!isAdded(ing.id) && !completed}
                  onDragStart={(e) => handleDragStart(e, ing.id)}
                  onClick={() => !isAdded(ing.id) && !completed && handleDrop(ing)}
                  onTouchStart={(e) => handleTouchStart(e, ing)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, ing)}
                >
                  <span className="ingredient-emoji">{ing.emoji}</span>
                  <span className="ingredient-name">{ing.name}</span>
                </div>
              ))}
            </div>

            <button 
              className={`cook-btn ${collected.length >= 3 ? 'ready' : ''}`}
              onClick={handleFinish}
              disabled={collected.length < 3}
            >
              {collected.length >= 3 ? '✅ Supp on valmis!' : `Lisa koostisosad (${collected.length}/3)`}
            </button>
          </div>

          <div className="dialogue-box">
            <div className="dialogue-avatar">{dialogue.avatar}</div>
            <div className="sdialogue-content">
              <div className="dialogue-speaker">{dialogue.speaker}</div>
              <div className="dialogue-text">"{dialogue.text}"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}