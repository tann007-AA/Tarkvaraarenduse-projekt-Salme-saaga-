import { useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';

interface ShipHotspotsProps {
  onComplete: () => void;
}

interface ShipHotspot {
  id: string;
  icon: string;
  title: string;
  dialogueId: string;
  left: string;
  top: string;
}

const SHIP_HOTSPOTS: ShipHotspot[] = [
  {
    id: '3-2',
    icon: '🐉',
    title: 'Lohepea vöör',
    dialogueId: DIALOGUE_TRIGGERS.shipProw,
    left: '50%',
    top: '35%',
  },
  {
    id: '3-3',
    icon: '⛵',
    title: 'Mast + puri',
    dialogueId: DIALOGUE_TRIGGERS.shipMast,
    left: '50%',
    top: '52%',
  },
  {
    id: '3-4',
    icon: '🔩',
    title: 'Pardalauad + raudneedid',
    dialogueId: DIALOGUE_TRIGGERS.shipPlanks,
    left: '38%',
    top: '56%',
  },
  {
    id: '3-5',
    icon: '🚣',
    title: 'Aerud + tullid',
    dialogueId: DIALOGUE_TRIGGERS.shipOars,
    left: '62%',
    top: '56%',
  },
  {
    id: '3-6',
    icon: '🛶',
    title: 'Tüürimõla',
    dialogueId: DIALOGUE_TRIGGERS.shipRudder,
    left: '78%',
    top: '58%',
  },
];

export function ShipHotspots({ onComplete }: ShipHotspotsProps) {
  const [visited, setVisited] = useState<string[]>([]);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.beachIntro);
  const allVisited = visited.length >= SHIP_HOTSPOTS.length;

  const handleClick = (hotspot: ShipHotspot) => {
    setActiveDialogueId(hotspot.dialogueId);
    setVisited((current) =>
      current.includes(hotspot.id) ? current : [...current, hotspot.id]
    );
  };

  return (
    <div className="beach-hotspots-layer">
      <div className="beach-hotspots-progress">
        {visited.length} / {SHIP_HOTSPOTS.length}
      </div>

      {SHIP_HOTSPOTS.map((hotspot) => {
        const isVisited = visited.includes(hotspot.id);

        return (
          <button
            key={hotspot.id}
            type="button"
            className={`ship-hotspot ${isVisited ? 'visited' : ''}`}
            style={{ left: hotspot.left, top: hotspot.top }}
            onClick={() => handleClick(hotspot)}
            aria-label={hotspot.title}
            title={hotspot.title}
          >
            <span className="ship-hotspot-icon">{hotspot.icon}</span>
            <span className="ship-hotspot-label">{hotspot.title}</span>
          </button>
        );
      })}

      <DialogueBox
        dialogueId={activeDialogueId}
        onComplete={() => setActiveDialogueId(null)}
      />

      {allVisited && !activeDialogueId && (
        <button className="beach-phase-btn" onClick={onComplete}>
          ⚓ Lae laev varustusega
        </button>
      )}
    </div>
  );
}
