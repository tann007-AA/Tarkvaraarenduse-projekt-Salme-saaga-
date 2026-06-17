import React, { useEffect, useState } from 'react';
import { DialogueBox } from '../DialogueBox';
import { Draggable, DropZone } from '../Draggable';

interface SupplyDragDropProps {
  onComplete: () => void;
}

type ZoneId = 'bow' | 'stern' | 'port' | 'starboard' | 'center';

interface SupplyCrate {
  id: string;
  icon: string;
  title: string;
  speaker: string;
  avatar: string;
  dialogue: string;
  fact: string;
  weight: number;
  correctZone: ZoneId | ZoneId[];
}

const SUPPLY_CRATES: SupplyCrate[] = [
  {
    id: 'food',
    icon: '🐟',
    title: 'Toiduvarud',
    speaker: 'Haldor',
    avatar: '🧔',
    dialogue: 'Soolakala ja kuivatatud liha lähevad masti lähedale keskele.',
    fact: 'Salme laevadest leiti loomaluid (veised, sead, lambad). Peamine toit pikal retkel: kuivatatud kala (tursk) ja herned — säilisid kuid.',
    weight: 3,
    correctZone: 'center',
  },
  {
    id: 'weapons',
    icon: '⚔️',
    title: 'Relvad + kilbid',
    speaker: 'Ivar',
    avatar: '⚔️',
    dialogue: 'Mõõgad ja kirved jäävad kirstudesse, aga kilbid kinnitame parda külge.',
    fact: 'Salme II laevast leiti kümneid kilbikuplaid ja luksuslikke mõõku. Kilbid parda välisküljele (shield-rack) — vabastas ruumi ja andis kaitsekihi.',
    weight: 3,
    correctZone: ['port', 'starboard'],
  },
  {
    id: 'gaming',
    icon: '🎲',
    title: 'Mängunuppude kirst',
    speaker: 'Haldor',
    avatar: '🧔',
    dialogue: 'Ivar ei lähe kuhugi ilma oma luust nuppudeta.',
    fact: 'Salme laevadest leiti üle 100 vaalaluust ja sarvest mängunupu — viikingid mängisid strateegimänge pika merereisi ajal.',
    weight: 2,
    correctZone: ['port', 'starboard', 'stern', 'center'],
  },
  {
    id: 'amulets',
    icon: '🔨',
    title: 'Amuletid / õnnistatud esemed',
    speaker: 'Gunnar',
    avatar: '🛡️',
    dialogue: 'Aseta see raudne vits vööri. Jumalate pilk ei tee paha.',
    fact: 'Viikingid kandsid Thori vasaraid, ruunidega esemeid. Salme laevadest leiti ka koerte ja pistrike luid — ohvriannid või staatusesümbolid.',
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
  const [activeCrate, setActiveCrate] = useState<SupplyCrate | null>(null);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setPlacements({});
    setActiveCrate(null);
    setAttempted(false);
  }, []);

  const handleDrop = (crateId: string, zoneId: ZoneId) => {
    setPlacements((current) => ({ ...current, [crateId]: zoneId }));
    const crate = SUPPLY_CRATES.find((c) => c.id === crateId) ?? null;
    setActiveCrate(crate);
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
  const endsBalanced = bowWeight + centerWeight / 2 <= sternWeight + centerWeight / 2 + 2;
  const isBalanced = sidesBalanced && endsBalanced;

  const canContinue = allPlaced && allCorrect && isBalanced;

  const handleCheck = () => {
    setAttempted(true);
  };

  const handleReset = () => {
    setPlacements({});
    setActiveCrate(null);
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

          <div className="beach-dialogue-wrap">
            {activeCrate ? (
              <DialogueBox
                speaker={activeCrate.speaker}
                avatar={activeCrate.avatar}
                text={
                  <>
                    {activeCrate.dialogue}
                    <br />
                    <br />
                    <em className="beach-fact">{activeCrate.fact}</em>
                  </>
                }
              />
            ) : (
              <DialogueBox
                speaker="Gunnar"
                avatar="🛡️"
                text="Lohista iga kirst õigesse kohta. Mäletad, mida vennad õpetasid: madal raskuskese, tasakaalunud pardad."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
