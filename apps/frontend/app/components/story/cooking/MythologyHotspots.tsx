import React, { useEffect, useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';
import './CookingGame.css';

interface MythologyHotspotsProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface MythologyHotspot {
  id: string;
  icon: string;
  title: string;
  dialogueId: string;
  left: string;
  top: string;
}

const MYTHOLOGY_HOTSPOTS: MythologyHotspot[] = [
  {
    id: '2-2',
    icon: '🔨',
    title: 'Thori vasar',
    dialogueId: DIALOGUE_TRIGGERS.mythologyThor,
    left: '28%',
    top: '62%',
  },
  {
    id: '2-3',
    icon: '👁️',
    title: 'Odini kuju',
    dialogueId: DIALOGUE_TRIGGERS.mythologyOdin,
    left: '72%',
    top: '38%',
  },
  {
    id: '2-4',
    icon: '🛡️',
    title: 'Valhalla kilbid',
    dialogueId: DIALOGUE_TRIGGERS.mythologyValhalla,
    left: '50%',
    top: '28%',
  },
];

export function MythologyHotspots({ isOpen, onClose, onComplete }: MythologyHotspotsProps) {
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([]);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'intro' | 'hotspots'>('intro');

  const allHotspotsVisited = visitedHotspots.length >= MYTHOLOGY_HOTSPOTS.length;

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setVisitedHotspots([]);
      setActiveDialogueId(DIALOGUE_TRIGGERS.mythologyIntro);
    }
  }, [isOpen]);

  const handleHotspotClick = (hotspot: MythologyHotspot) => {
    setActiveDialogueId(hotspot.dialogueId);
    setVisitedHotspots((current) =>
      current.includes(hotspot.id) ? current : [...current, hotspot.id]
    );
  };

  const handleFinish = () => {
    if (phase === 'intro') {
      setPhase('hotspots');
      setActiveDialogueId(null);
      return;
    }

    if (!allHotspotsVisited) return;

    onComplete();
    setTimeout(() => onClose(), 350);
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
          ×
        </button>

        <div className="panel-content">
          <div className="panel-title">🌙 Öine pikkmaja</div>
          <div className="panel-subtitle">
            {phase === 'intro' ? 'Jumalate jutud' : 'Müütoloogia'}
          </div>

          <div className="longhouse-section mythology-section">
            <div className="kitchen-header">
              <span className="fire-icon">⚡</span>
              <h3>
                {phase === 'intro'
                  ? 'JUMALAD JA SAATUS'
                  : 'PIKKMAJA MÜÜDID'}
              </h3>
            </div>

            {phase === 'intro' && (
              <div className="recipe-info">
                <strong>Tuli on kustunud ja pikkmajas on pime.</strong> Vennad
                räägivad jumalatest ja Valhallast. Kuula, mida pühapaikadel öelda on.
              </div>
            )}

            {phase === 'hotspots' && (
              <>
                <div className="recipe-info">
                  <strong>Vali ese</strong> ja kuule, mida Haldor, Gunnar ja Ivar
                  Skandinaavia jumalate kohta räägivad.
                </div>

                <div className="hotspot-progress">
                  {visitedHotspots.length} / {MYTHOLOGY_HOTSPOTS.length} leitud
                </div>

                <div
                  className="longhouse-scene mythology-scene"
                  aria-label="Pikkmaja mütoloogilised hotspotid"
                >
                  <div className="longhouse-roof" aria-hidden="true" />
                  <div className="longhouse-wall mythology-wall" aria-hidden="true" />
                  <div className="longhouse-hearth mythology-hearth" aria-hidden="true" />

                  {MYTHOLOGY_HOTSPOTS.map((hotspot) => {
                    const isVisited = visitedHotspots.includes(hotspot.id);

                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        className={`longhouse-hotspot mythology-hotspot ${isVisited ? 'visited' : ''}`}
                        style={{ left: hotspot.left, top: hotspot.top }}
                        onClick={() => handleHotspotClick(hotspot)}
                        aria-pressed={isVisited}
                        aria-label={hotspot.title}
                        title={hotspot.title}
                      >
                        <span className="hotspot-icon">{hotspot.icon}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hotspot-list" aria-label="Mütoloogilised esemed">
                  {MYTHOLOGY_HOTSPOTS.map((hotspot) => {
                    const isVisited = visitedHotspots.includes(hotspot.id);

                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        className={`hotspot-list-item ${isVisited ? 'visited' : ''}`}
                        onClick={() => handleHotspotClick(hotspot)}
                      >
                        <span className="hotspot-list-icon">{hotspot.icon}</span>
                        <span>{hotspot.title}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <DialogueBox
              dialogueId={activeDialogueId}
              onComplete={() => setActiveDialogueId(null)}
            />

            <button
              className={`cook-btn ${phase === 'hotspots' && allHotspotsVisited ? 'ready' : ''}`}
              onClick={handleFinish}
              disabled={phase === 'hotspots' ? !allHotspotsVisited : false}
            >
              {phase === 'intro'
                ? 'Kuula jutte'
                : allHotspotsVisited
                  ? '⚔️ Mängi hnefataflit'
                  : `⚡ Uuri veel (${visitedHotspots.length}/${MYTHOLOGY_HOTSPOTS.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
