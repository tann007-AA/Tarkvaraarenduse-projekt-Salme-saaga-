import React, { useEffect, useState } from 'react';
import { DialogueBox } from '../DialogueBox';

interface ShipHotspotsProps {
  onComplete: () => void;
}

interface ShipHotspot {
  id: string;
  icon: string;
  title: string;
  speaker: string;
  avatar: string;
  dialogue: string;
  fact: string;
  left: string;
  top: string;
}

const SHIP_HOTSPOTS: ShipHotspot[] = [
  {
    id: '3-2',
    icon: '🐉',
    title: 'Lohepea vöör',
    speaker: 'Gunnar',
    avatar: '🛡️',
    dialogue: 'See hirmutab maavaime ja näitab vaenlasele, kes on merede isand.',
    fact: 'Viikingilaevade madal süvis (0,5–1 m) võimaldas randuda otse liivarandadel ja tungida madalatesse jõgedesse, kuhu suured kaubalaevad ei pääsenud.',
    left: '50%',
    top: '35%',
  },
  {
    id: '3-3',
    icon: '⛵',
    title: 'Mast + puri',
    speaker: 'Haldor',
    avatar: '🧔',
    dialogue: 'Selle purje kudusid küla naised terve talve. Kui tuul tõuseb, on see puri meie mootor.',
    fact: 'Villane puri vilditi ja määriti rasva/tõrvaga. Ühe purje valmistamiseks kulus ~200 lamba vill — sageli kallim kui laeva puitkere.',
    left: '50%',
    top: '52%',
  },
  {
    id: '3-4',
    icon: '🔩',
    title: 'Pardalauad + raudneedid',
    speaker: 'Ivar',
    avatar: '⚔️',
    dialogue: 'Need needid hoiavad lauda koos, aga lasevad kerel painduda. Jäik laev murdub tormis, meie "Lohetapja" paindub koos lainega.',
    fact: 'Salme laevadest leiti tuhandeid raudneete. Klinker-ehitusviis andis laevale uskumatu elastsuse.',
    left: '38%',
    top: '56%',
  },
  {
    id: '3-5',
    icon: '🚣',
    title: 'Aerud + tullid',
    speaker: 'Haldor',
    avatar: '🧔',
    dialogue: 'Kui tuul meid reedab, on need aerud meie ainus lootus. Sõudmine on meeskonna ühine rütm.',
    fact: 'Salme I laevalt leiti märke 12 sõudjapaarist (24 sõudjat). Aerud toetusid tullidele ja sai sekunditega sisse tõmmata.',
    left: '62%',
    top: '56%',
  },
  {
    id: '3-6',
    icon: '🛶',
    title: 'Tüürimõla',
    speaker: 'Gunnar',
    avatar: '🛡️',
    dialogue: 'Üks mees ja üks mõla juhivad tervet seda lohet. Me hoiame tüüri alati paremal pool.',
    fact: 'Tüür alati paremas pardas (starboard / stjornbori — "juhtimispool").',
    left: '78%',
    top: '58%',
  },
];

export function ShipHotspots({ onComplete }: ShipHotspotsProps) {
  const [visited, setVisited] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const allVisited = visited.length >= SHIP_HOTSPOTS.length;

  const active = SHIP_HOTSPOTS.find((h) => h.id === activeId);

  const handleClick = (hotspot: ShipHotspot) => {
    setActiveId(hotspot.id);
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
        const isActive = activeId === hotspot.id;

        return (
          <button
            key={hotspot.id}
            type="button"
            className={`ship-hotspot ${isVisited ? 'visited' : ''} ${isActive ? 'active' : ''}`}
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

      <div className="beach-dialogue-wrap">
        {active ? (
          <DialogueBox
            speaker={active.speaker}
            avatar={active.avatar}
            text={
              <>
                {active.dialogue}
                <br />
                <br />
                <em className="beach-fact">{active.fact}</em>
              </>
            }
          />
        ) : (
          <DialogueBox
            speaker="Gunnar"
            avatar="🛡️"
            text="Koidik. Tuul puhub idast — märk, et meri kutsub Eysysla poole. Vaata ringi, Björn. Lohetapja ootab."
          />
        )}
      </div>

      {allVisited && (
        <button className="beach-phase-btn" onClick={onComplete}>
          ⚓ Lae laev varustusega
        </button>
      )}
    </div>
  );
}
