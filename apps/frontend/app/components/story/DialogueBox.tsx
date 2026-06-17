import type { ReactNode } from 'react';
import './DialogueBox.css';

export interface DialogueBoxProps {
  speaker: string;
  avatar?: ReactNode;
  text: ReactNode;
}

export function DialogueBox({ speaker, avatar, text }: DialogueBoxProps) {
  return (
    <div className="dialogue-box">
      <div className="dialogue-avatar" aria-hidden="true">
        {avatar ?? '🗣️'}
      </div>
      <div className="dialogue-content">
        <div className="dialogue-speaker">{speaker}</div>
        <div className="dialogue-text">"{text}"</div>
      </div>
    </div>
  );
}
