// QuestionModal.tsx
import { useState } from 'react';
import './QuestionModal.css';

export interface Question {
  question: string;
  answers: string[];
  correct: number;
}

interface QuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onCorrect: () => void;
  onClose: () => void;
}

export function QuestionModal({ isOpen, question, onCorrect, onClose }: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!isOpen || !question) return null;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);

    if (index === question.correct) {
      setTimeout(() => {
        setSelected(null);
        setAnswered(false);
        onCorrect();
      }, 1200);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswered(false);
  };

  const isCorrect = answered && selected === question.correct;
  const isWrong = answered && selected !== question.correct;

  return (
    <div className="question-overlay" role="dialog" aria-modal="true">
      <div className="question-modal">

        <div className="question-header">
          <span className="question-rune">ᚠ</span>
          <h2 className="question-title">Küsimus</h2>
          <span className="question-rune">ᚠ</span>
        </div>

        <p className="question-text">{question.question}</p>

        <div className="question-answers">
          {question.answers.map((answer, index) => {
            let className = 'question-answer-btn';
            if (answered) {
              if (index === question.correct) className += ' correct';
              else if (index === selected) className += ' wrong';
              else className += ' dimmed';
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={answered}
              >
                <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                {answer}
              </button>
            );
          })}
        </div>

        {isCorrect && (
          <div className="question-feedback correct-feedback">
            ✓ Õige! Tubli, Björn!
          </div>
        )}

        {isWrong && (
          <div className="question-feedback wrong-feedback">
            ✗ Vale vastus.
            <button className="retry-btn" onClick={handleRetry}>
              Proovi uuesti
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
