import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { dialogues, type DialogueLine, type DialogueScene } from './dialogues';
import './DialogueBox.css';
import GunnarPortree from '../character/Gunnar.png';
import BjornPortree from '../character/Bjorn.png';
import SigridPortree from '../character/Sigrid.png';
import IvarPortree from '../character/Ivar.png';
import HaldorPortree from '../character/Haldor.png';
import KnutPortree from '../character/Knut.png';
import OrmarPortree from '../character/Ormar.png';

const SPEAKER_COLORS: Record<string, string> = {
  Gunnar: '#e8c77a',
  Ivar: '#a3c4e8',
  Haldor: '#b8e8a3',
  Björn: '#f4ede1',
  Sigrid: '#e8a3c4',
  Ormar: '#e8b87a',
  Knut: '#c4a3e8',
  Narrator: '#9ca3af',
};

const SPEAKER_AVATARS: Record<string, string> = {
  Gunnar: GunnarPortree,
  Ivar: IvarPortree,
  Haldor: HaldorPortree,
  Björn: BjornPortree,
  Sigrid: SigridPortree,
  Ormar: OrmarPortree,
  Knut: KnutPortree,
  Narrator: '',
};

interface DialogueBoxProps {
  dialogueId: string | null;
  onComplete?: () => void;
  onChoice?: (choiceLabel: string, nextId: string) => void;
  className?: string;
}

export function DialogueBox({ dialogueId, onComplete, onChoice, className = '' }: DialogueBoxProps) {
  const [scene, setScene] = useState<DialogueScene | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLineRef = useRef<DialogueLine | null>(null);

  const TYPING_SPEED = 28; // ms per character

  
  useEffect(() => {
    if (!dialogueId) {
      setIsVisible(false);
      setScene(null);
      return;
    }

    const found = dialogues[dialogueId];
    if (!found) {
      console.warn(`DialogueBox: dialoog '${dialogueId}' ei leitud`);
      return;
    }

    setScene(found);
    setLineIndex(0);
    setDisplayedText('');
    setIsVisible(true);
  }, [dialogueId]);

  
  const startTyping = useCallback((text: string) => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setIsTyping(true);
    setDisplayedText('');

    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
        typingRef.current = setTimeout(type, TYPING_SPEED);
      } else {
        setIsTyping(false);
      }
    };
    type();
  }, []);

  
  useEffect(() => {
    if (!scene) return;
    const line = scene.lines[lineIndex];
    if (!line) return;
    currentLineRef.current = line;
    startTyping(line.text);
  }, [scene, lineIndex, startTyping]);

 
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  const skipOrAdvance = useCallback(() => {
    if (!scene) return;

    
    if (isTyping) {
      if (typingRef.current) clearTimeout(typingRef.current);
      setIsTyping(false);
      setDisplayedText(scene.lines[lineIndex].text);
      return;
    }

    const nextLineIndex = lineIndex + 1;

    
    if (nextLineIndex < scene.lines.length) {
      setLineIndex(nextLineIndex);
      return;
    }

   
    if (scene.choices && scene.choices.length > 0) {
      return;
    }

    
    if (scene.nextId) {
      const nextScene = dialogues[scene.nextId];
      if (nextScene) {
        setScene(nextScene);
        setLineIndex(0);
        setDisplayedText('');
        return;
      }
    }

    
    setIsVisible(false);
    setScene(null);
    onComplete?.();
  }, [scene, lineIndex, isTyping, onComplete]);

  const handleChoice = useCallback((label: string, nextId: string) => {
    onChoice?.(label, nextId);
    const nextScene = dialogues[nextId];
    if (nextScene) {
      setScene(nextScene);
      setLineIndex(0);
      setDisplayedText('');
    } else {
      setIsVisible(false);
      setScene(null);
      onComplete?.();
    }
  }, [onChoice, onComplete]);

  
  useEffect(() => {
    if (!isVisible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        
        if (isLastLine && scene?.choices?.length) return;
        skipOrAdvance();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isVisible, skipOrAdvance, scene]);

  if (!isVisible || !scene) return null;

  const currentLine = scene.lines[lineIndex];
  const isLastLine = lineIndex === scene.lines.length - 1;
  const showChoices = isLastLine && !isTyping && scene.choices && scene.choices.length > 0;
  const showNext = !isTyping && !(isLastLine && scene.choices?.length);

  const speakerColor = SPEAKER_COLORS[currentLine.speaker] ?? '#f4ede1';
  const speakerAvatar = SPEAKER_AVATARS[currentLine.speaker] ?? '💬';

  const content = (
    <div className={`dialogue-overlay ${className}`} aria-live="polite" aria-atomic="false">
      {/* Choice Buttons */}
      {showChoices && (
        <div className="dialogue-choices">
          {scene.choices!.map((choice) => (
            <button
              key={choice.nextId}
              className="dialogue-choice-btn"
              onClick={() => handleChoice(choice.label, choice.nextId)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Bar */}
      <div
        className="dialogue-bar"
        onClick={showChoices ? undefined : skipOrAdvance}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') skipOrAdvance();
        }}
        aria-label="Dialoog — klõpsa jätkamiseks"
      >
        {/* Avatar */}
        <div className="dialogue-avatar" style={{ borderColor: speakerColor }}>
          {speakerAvatar ? (
            <img src={speakerAvatar} alt={currentLine.speaker} className="dialogue-avatar-img" />
          ) : (
            <span className="dialogue-avatar-emoji">📜</span>
          )}
        </div>

        {/* Content */}
        <div className="dialogue-content">
          <span className="dialogue-speaker" style={{ color: speakerColor }}>
            {currentLine.speaker}
          </span>
          <p className="dialogue-text">
            {displayedText}
            {isTyping && <span className="dialogue-cursor">▌</span>}
          </p>
        </div>

        {/* Next Arrow */}
        {showNext && (
          <div className="dialogue-next-arrow" aria-hidden="true">
            ▼
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}
