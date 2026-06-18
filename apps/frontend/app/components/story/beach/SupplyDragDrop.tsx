import React, { useEffect, useState } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DIALOGUE_TRIGGERS } from '../dialogue/dialogues';
import { Draggable, DropZone } from '../Draggable';

interface SupplyDragDropProps {
  onComplete: () => void;
}

type ZoneId = 'bow' | 'stern' | 'port' | 'starboard' | 'center';

interface SupplyCrate {
  id: string;
  icon: string;
  title: string;
  dialogueId: string;
  weight: number;
  correctZone: ZoneId | ZoneId[];
}

const SUPPLY_CRATES: SupplyCrate[] = [
  {
    id: 'food',
    icon: '🐟',
    title: 'Toiduvarud',
    dialogueId: DIALOGUE_TRIGGERS.supplyFood,
    weight: 3,
    correctZone: 'center',
  },
  {
    id: 'weapons',
    icon: '⚔️',
    title: 'Relvad + kilbid',
    dialogueId: DIALOGUE_TRIGGERS.supplyWeapons,
    weight: 3,
    correctZone: ['port', 'starboard'],
  },
  {
    id: 'gaming',
    icon: '🎲',
    title: 'Mängunuppude kirst',
    dialogueId: DIALOGUE_TRIGGERS.supplyGaming,
    weight: 3,
    correctZone: ['port', 'starboard', 'stern', 'center'],
  },
  {
    id: 'amulets',
    icon: '🔨',
    title: 'Amuletid / õnnistatud esemed',
    dialogueId: DIALOGUE_TRIGGERS.supplyAmulets,
    weight: 1,
    correctZone: 'bow',
  },
];

const ZONE_LABELS: Record<ZoneId, string> = {
  bow: 'Vöör',
  stern: 'Ahtri',
  port: 'Vasak pardas',
  starboard: 'Parem pardas',
  center: 'Masti juures',
};

export function SupplyDragDrop({ onComplete }: SupplyDragDropProps) {
  const [placements, setPlacements] = useState<Record<string, ZoneId | null>>({});
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(DIALOGUE_TRIGGERS.supplyIntro);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setPlacements({});
    setActiveDialogueId(DIALOGUE_TRIGGERS.supplyIntro);
    setAttempted(false);
  }, []);

  const handleDrop = (crateId: string, zoneId: ZoneId) => {
    setPlacements((current) => ({ ...current, [crateId]: zoneId }));
    const crate = SUPPLY_CRATES.find((c) => c.id === crateId) ?? null;
    if (crate) {
      setActiveDialogueId(crate.dialogueId);
    }
  };

  const zoneWeight = (zoneId: ZoneId) => {
    return SUPPLY_CRATES.reduce((sum, crate) => {
      return placements[crate.id] === zoneId ? sum + crate.weight : sum;
    }, 0);
  };

  const isCorrectlyPlaced = (crate: SupplyCrate) => {
    const zone = placements[crate.id];
    if (!zone) return false;
    return Array.isArray(crate.correctZone)
      ? crate.correctZone.includes(zone)
      : crate.correctZone === zone;
  };

  const allPlaced = SUPPLY_CRATES.every((crate) => placements[crate.id] !== undefined && placements[crate.id] !== null);
  const allCorrect = SUPPLY_CRATES.every(isCorrectlyPlaced);

  const portWeight = zoneWeight('port');
  const starboardWeight = zoneWeight('starboard');
  const bowWeight = zoneWeight('bow');
  const sternWeight = zoneWeight('stern');
  const centerWeight = zoneWeight('center');

  const sideDiff = Math.abs(portWeight - starboardWeight);
  const sidesBalanced = sideDiff <= 1;
  const endsBalanced = Math.abs(bowWeight - sternWeight) <= 2;
  const isBalanced = sidesBalanced && endsBalanced;

  const canContinue = allPlaced && allCorrect && isBalanced;

  const handleCheck = () => {
    setAttempted(true);
  };

  const handleReset = () => {
    setPlacements({});
    setActiveDialogueId(DIALOGUE_TRIGGERS.supplyIntro);
    setAttempted(false);
  };

  return (
    <div className="supply-overlay">
      <div className="supply-backdrop" />

      <div className="supply-panel">
        <div className="panel-content">
          <div className="panel-title">⚓ Laeva varustamine</div>
          <div className="panel-subtitle">Gunnar hoiab käes ruunipulka (nimekiri)</div>

          <div className="supply-section">
            <div className="recipe-info">
              <strong>Lohista kirstud laeva peale.</strong> Raskuskese peab olema
              madalal — vale paigutus tähendab laine puhul ümberkukkumist.
            </div>

            <div className="supply-zones-grid">
              <DropZone
                zoneId="bow"
                className="supply-zone bow-zone"
                onDrop={(id) => handleDrop(id, 'bow')}
              >
                <span className="supply-zone-name">{ZONE_LABELS.bow}</span>
                <span className="supply-zone-weight">{zoneWeight('bow')}</span>
              </DropZone>

              <div className="supply-zones-middle">
                <DropZone
                  zoneId="port"
                  className="supply-zone side-zone"
                  onDrop={(id) => handleDrop(id, 'port')}
                >
                  <span className="supply-zone-name">{ZONE_LABELS.port}</span>
                  <span className="supply-zone-weight">{zoneWeight('port')}</span>
                </DropZone>

                <DropZone
                  zoneId="center"
                  className="supply-zone center-zone"
                  onDrop={(id) => handleDrop(id, 'center')}
                >
                  <span className="supply-zone-name">{ZONE_LABELS.center}</span>
                  <span className="supply-zone-weight">{zoneWeight('center')}</span>
                </DropZone>

                <DropZone
                  zoneId="starboard"
                  className="supply-zone side-zone"
                  onDrop={(id) => handleDrop(id, 'starboard')}
                >
                  <span className="supply-zone-name">{ZONE_LABELS.starboard}</span>
                  <span className="supply-zone-weight">{zoneWeight('starboard')}</span>
                </DropZone>
              </div>

              <DropZone
                zoneId="stern"
                className="supply-zone stern-zone"
                onDrop={(id) => handleDrop(id, 'stern')}
              >
                <span className="supply-zone-name">{ZONE_LABELS.stern}</span>
                <span className="supply-zone-weight">{zoneWeight('stern')}</span>
              </DropZone>
            </div>

            {attempted && !canContinue && (
              <div className="supply-warning">
                ⚖️ Laev ei ole tasakaalus! Kontrolli, kas:<br />
                • Toiduvarud on masti juures<br />
                • Relvad ja kilbid on kummalgi pardal<br />
                • Amuletid on vööris<br />
                • Vasaku ja parema parda kaal on võrdne
              </div>
            )}

            <div className="supply-crates">
              {SUPPLY_CRATES.map((crate) => {
                const zone = placements[crate.id];
                return (
                  <Draggable
                    key={crate.id}
                    id={crate.id}
                    className={`supply-crate ${zone ? 'placed' : ''}`}
                  >
                    <span className="supply-crate-icon">{crate.icon}</span>
                    <span className="supply-crate-title">{crate.title}</span>
                    {zone && <span className="supply-crate-zone">{ZONE_LABELS[zone]}</span>}
                  </Draggable>
                );
              })}
            </div>

            <div className="supply-actions">
              <button
                className={`cook-btn ${canContinue ? 'ready' : ''}`}
                onClick={canContinue ? onComplete : handleCheck}
              >
                {canContinue
                  ? '✅ Laev on tasakaalus — jätkame'
                  : '⚖️ Kontrolli tasakaalu'}
              </button>

              <button
                className="cook-btn supply-reset-btn"
                onClick={handleReset}
                type="button"
              >
                🔄 Alusta uuesti
              </button>
            </div>
          </div>

          <DialogueBox
            dialogueId={activeDialogueId}
            onComplete={() => setActiveDialogueId(null)}
          />
        </div>
      </div>
    </div>
  );
}
