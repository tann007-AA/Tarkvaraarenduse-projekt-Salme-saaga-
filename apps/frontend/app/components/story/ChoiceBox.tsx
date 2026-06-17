import type { ReactNode } from 'react';
import './ChoiceBox.css';

export interface ChoiceOption {
  id: string;
  label: ReactNode;
}

export interface ChoiceBoxProps {
  options: ChoiceOption[];
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectedId?: string | null;
}

export function ChoiceBox({ options, onSelect, disabled, selectedId }: ChoiceBoxProps) {
  return (
    <div className="choice-box" role="group" aria-label="Valikud">
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const isDisabled = disabled || (selectedId !== undefined && selectedId !== null);

        return (
          <button
            key={option.id}
            type="button"
            className={`choice-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(option.id)}
            disabled={isDisabled}
          >
            <span className="choice-letter" aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
