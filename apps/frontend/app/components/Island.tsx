import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ship } from 'lucide-react';
import type { ArtifactType } from '../App';
import { toast } from 'sonner';
import { TutorialModal } from './TutorialModal';

interface IslandProps {
  island: {
    id: number;
    name: string;
    theme: string;
    questions: any[];
  };
  hasShip: boolean;
  isFirstIsland: boolean;
  answeredQuestions: number[];
  onQuestionTrigger: (questionIdx: number, playerPos: { x: number; y: number }) => void;
  collectedArtifacts: number[];
  onArtifactCollect: (artifactIdx: number, artifactType: ArtifactType) => void;
  inventory: ArtifactType[];
  score?: number;
  showTutorial: boolean;
  onTutorialComplete: () => void;
  savedPosition: { x: number; y: number } | null;
}

// Question marker positions (10 questions scattered around the island)
const QUESTION_POSITIONS = [
  { x: 150, y: 200 },
  { x: 350, y: 180 },
  { x: 250, y: 300 },
  { x: 450, y: 250 },
  { x: 550, y: 200 },
  { x: 200, y: 400 },
  { x: 400, y: 380 },
  { x: 500, y: 450 },
  { x: 300, y: 500 },
  { x: 600, y: 380 },
];

// Artifact positions (5 artifacts scattered around the island)
const ARTIFACT_POSITIONS = [
  { x: 180, y: 250, type: 'sword' as ArtifactType },
  { x: 420, y: 220, type: 'shield' as ArtifactType },
  { x: 320, y: 350, type: 'knife' as ArtifactType },
  { x: 530, y: 320, type: 'dice' as ArtifactType },
  { x: 260, y: 450, type: 'gaming-piece' as ArtifactType },
];

export function Island({
  island,
  hasShip,
  isFirstIsland,
  answeredQuestions,
  onQuestionTrigger,
  collectedArtifacts,
  onArtifactCollect,
  inventory,
  score,
  showTutorial,
  onTutorialComplete,
  savedPosition
}: IslandProps) {
  // Initialize player position - use saved position if available, otherwise default
  const [playerPos, setPlayerPos] = useState(savedPosition || { x: 400, y: 550 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [showInstructions, setShowInstructions] = useState(true);

  // Reset player position only when island ID changes (new island), or restore saved position
  useEffect(() => {
    if (savedPosition) {
      setPlayerPos(savedPosition);
    } else {
      setPlayerPos({ x: 400, y: 550 });
    }
  }, [island.id, savedPosition]);

  // Hide instructions after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        setKeysPressed(prev => new Set(prev).add(key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement loop
  useEffect(() => {
    const moveSpeed = 3;
    const interval = setInterval(() => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (keysPressed.has('w') || keysPressed.has('arrowup')) newY -= moveSpeed;
        if (keysPressed.has('s') || keysPressed.has('arrowdown')) newY += moveSpeed;
        if (keysPressed.has('a') || keysPressed.has('arrowleft')) newX -= moveSpeed;
        if (keysPressed.has('d') || keysPressed.has('arrowright')) newX += moveSpeed;

        // Keep player within bounds
        newX = Math.max(50, Math.min(750, newX));
        newY = Math.max(100, Math.min(600, newY));

        return { x: newX, y: newY };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [keysPressed]);

  // Check for question collisions
  useEffect(() => {
    const triggerDistance = 40;

    QUESTION_POSITIONS.forEach((pos, idx) => {
      if (answeredQuestions.includes(idx)) return;

      const distance = Math.sqrt(
        Math.pow(playerPos.x - pos.x, 2) + Math.pow(playerPos.y - pos.y, 2)
      );

      if (distance < triggerDistance) {
        onQuestionTrigger(idx, playerPos); // Pass current position
      }
    });
  }, [playerPos, answeredQuestions, onQuestionTrigger]);

  // Check for artifact collisions
  useEffect(() => {
    const triggerDistance = 40;

    ARTIFACT_POSITIONS.forEach((pos, idx) => {
      if (collectedArtifacts.includes(idx)) return;

      const distance = Math.sqrt(
        Math.pow(playerPos.x - pos.x, 2) + Math.pow(playerPos.y - pos.y, 2)
      );

      if (distance < triggerDistance) {
        onArtifactCollect(idx, pos.type);
        
        // Show notification with artifact info
        const artifactNames: Record<ArtifactType, string> = {
          'sword': '⚔️ One-Edged Sword',
          'shield': '🛡️ Viking Shield',
          'knife': '🔪 Seax Knife',
          'dice': '🎲 Bone Dice',
          'gaming-piece': '♟️ Gaming Piece'
        };
        
        toast.success(artifactNames[pos.type] + ' collected!', {
          description: 'Use this artifact as a lifeline in quiz questions!',
          duration: 3000,
        });
      }
    });
  }, [playerPos, collectedArtifacts, onArtifactCollect]);

  const allQuestionsAnswered = answeredQuestions.length === island.questions.length;

  return (
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#3d7a8f] via-[#2a5c6f] to-[#1e4d5f]">
      {/* Tutorial modal for first island */}
      {showTutorial && (
        <TutorialModal onClose={onTutorialComplete} />
      )}
      {/* Ocean background with animated waves */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.1) 20px,
            rgba(255,255,255,0.1) 40px
          )`
        }}
        animate={{
          backgroundPositionY: ['0px', '40px']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Island info - repositioned to avoid overlap with progress bar */}
      <div className="absolute top-5 left-8 text-left z-20">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4a574] to-[#b8860b] rounded-lg transform rotate-1" />
          <div className="relative bg-[#f4ede1] px-5 py-3 rounded-lg border-4 border-[#8b6f47] shadow-xl">
            <h1
              className="text-2xl text-[#1e4d5f]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {island.name}
            </h1>
            <p className="text-xs text-[#6b7280] italic">{island.theme}</p>
            <p className="text-sm mt-1 text-[#8b6f47] font-bold">
              {answeredQuestions.length} / {island.questions.length} Questions
            </p>
          </div>
        </div>
      </div>

      {/* Inventory display */}
      {inventory.length > 0 && (
        <div className="absolute top-20 right-4 md:right-8 z-20">
          <div className="bg-[#f4ede1] px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 md:border-4 border-[#8b6f47] shadow-xl">
            <p className="text-xs md:text-sm text-[#8b6f47] mb-2 font-bold">Artifacts:</p>
            <div className="flex gap-2">
              {inventory.map((artifact, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#d4a574] to-[#b8860b] rounded-md md:rounded-lg border-2 border-[#8b6f47] flex items-center justify-center shadow-md"
                  title={artifact}
                >
                  <span className="text-base md:text-lg">
                    {artifact === 'sword' && '⚔️'}
                    {artifact === 'shield' && '🛡️'}
                    {artifact === 'knife' && '🔪'}
                    {artifact === 'dice' && '🎲'}
                    {artifact === 'gaming-piece' && '♟️'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showInstructions ? 1 : 0 }}
        className="absolute top-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="bg-black/70 text-white px-6 py-3 rounded-lg border-2 border-[#d4a574]">
          <p className="text-center">Use WASD or Arrow Keys to explore the island and find questions!</p>
        </div>
      </motion.div>

      {/* Game area */}
      <div className="relative w-[800px] h-[700px]">
        {/* Island terrain - More realistic */}
        <svg
          width="800"
          height="700"
          viewBox="0 0 800 700"
          className="absolute inset-0"
        >
          {/* Water ripples around island */}
          <ellipse cx="400" cy="400" rx="380" ry="270" fill="none" stroke="#2a5c6f" strokeWidth="2" opacity="0.3" />
          <ellipse cx="400" cy="400" rx="365" ry="260" fill="none" stroke="#3d7a8f" strokeWidth="1" opacity="0.2" />
          
          {/* Island main ground - irregular shape */}
          <path
            d="M 100,350 Q 80,300 120,250 Q 160,200 220,180 Q 280,160 350,155 Q 420,150 490,160 Q 560,170 620,200 Q 680,230 710,280 Q 730,330 720,380 Q 710,430 680,470 Q 640,510 580,530 Q 520,550 450,555 Q 380,560 310,545 Q 240,530 180,490 Q 120,450 100,380 Z"
            fill="#5a7a42"
            stroke="#4a6638"
            strokeWidth="3"
          />
          
          {/* Darker grass areas */}
          <ellipse cx="250" cy="300" rx="80" ry="60" fill="#4d6b35" opacity="0.6" />
          <ellipse cx="500" cy="320" rx="90" ry="70" fill="#4d6b35" opacity="0.6" />
          <ellipse cx="380" cy="450" rx="70" ry="50" fill="#4d6b35" opacity="0.6" />
          
          {/* Sandy beach areas */}
          <path
            d="M 130,360 Q 150,310 200,260 Q 250,220 310,200 L 320,215 Q 270,235 230,270 Q 180,310 160,360 Z"
            fill="#d4c4a0"
            opacity="0.8"
          />
          <path
            d="M 650,280 Q 680,320 690,370 L 675,375 Q 665,330 640,295 Z"
            fill="#d4c4a0"
            opacity="0.8"
          />
          <path
            d="M 200,480 Q 260,520 330,540 L 325,550 Q 250,530 190,485 Z"
            fill="#d4c4a0"
            opacity="0.8"
          />

          {/* Rocky outcrops */}
          <g opacity="0.9">
            <ellipse cx="180" cy="280" rx="35" ry="25" fill="#7a7a7a" />
            <ellipse cx="185" cy="275" rx="30" ry="20" fill="#8b8b8b" />
            <ellipse cx="175" cy="283" rx="25" ry="18" fill="#6b6b6b" />
            
            <ellipse cx="520" cy="310" rx="40" ry="28" fill="#7a7a7a" />
            <ellipse cx="525" cy="305" rx="35" ry="23" fill="#8b8b8b" />
            <ellipse cx="515" cy="313" rx="30" ry="20" fill="#6b6b6b" />
            
            <ellipse cx="340" cy="470" rx="30" ry="20" fill="#7a7a7a" />
            <ellipse cx="345" cy="467" rx="25" ry="17" fill="#8b8b8b" />
            
            <ellipse cx="580" cy="490" rx="35" ry="23" fill="#7a7a7a" />
            <ellipse cx="585" cy="487" rx="30" ry="20" fill="#8b8b8b" />
          </g>

          {/* Varied trees - Pine/Conifer style */}
          <g>
            {/* Tree 1 - Large pine */}
            <rect x="145" y="200" width="12" height="90" fill="#654321" rx="1" />
            <polygon points="151,140 125,170 177,170" fill="#2d5016" />
            <polygon points="151,160 130,185 172,185" fill="#3d6b26" />
            <polygon points="151,180 135,200 167,200" fill="#2d5016" />

            {/* Tree 2 - Medium tree */}
            <rect x="345" y="170" width="10" height="75" fill="#654321" rx="1" />
            <polygon points="350,130 328,160 372,160" fill="#3d6b26" />
            <polygon points="350,150 333,173 367,173" fill="#4a7a35" />
            <polygon points="350,165 338,183 362,183" fill="#3d6b26" />

            {/* Tree 3 - Tall pine */}
            <rect x="545" y="185" width="11" height="95" fill="#654321" rx="1" />
            <polygon points="550,145 527,175 573,175" fill="#2d5016" />
            <polygon points="550,165 532,190 568,190" fill="#3d6b26" />
            <polygon points="550,185 537,205 563,205" fill="#2d5016" />

            {/* Tree 4 - Clustered trees */}
            <rect x="195" y="390" width="9" height="70" fill="#654321" rx="1" />
            <polygon points="200,350 180,385 220,385" fill="#3d6b26" />
            <polygon points="200,370 185,395 215,395" fill="#4a7a35" />
            
            <rect x="215" y="385" width="8" height="65" fill="#654321" rx="1" />
            <polygon points="219,345 202,375 236,375" fill="#2d5016" />

            {/* Tree 5 - Large clustered pines */}
            <rect x="595" y="365" width="10" height="85" fill="#654321" rx="1" />
            <polygon points="600,325 578,355 622,355" fill="#2d5016" />
            <polygon points="600,345 583,370 617,370" fill="#3d6b26" />
            
            <rect x="615" y="370" width="9" height="75" fill="#654321" rx="1" />
            <polygon points="620,335 602,365 638,365" fill="#3d6b26" />
          </g>

          {/* Bushes and undergrowth */}
          <g opacity="0.8">
            <ellipse cx="280" cy="250" rx="20" ry="15" fill="#4a7a35" />
            <ellipse cx="295" cy="255" rx="18" ry="13" fill="#5a8a45" />
            
            <ellipse cx="430" cy="275" rx="22" ry="16" fill="#4a7a35" />
            <ellipse cx="445" cy="280" rx="19" ry="14" fill="#5a8a45" />
            
            <ellipse cx="320" cy="420" rx="24" ry="17" fill="#4a7a35" />
            <ellipse cx="470" cy="430" rx="21" ry="15" fill="#5a8a45" />
            
            <ellipse cx="550" cy="360" rx="20" ry="14" fill="#4a7a35" />
          </g>

          {/* Grass tufts scattered */}
          <g opacity="0.6" stroke="#3d5a28" strokeWidth="1" fill="none">
            <path d="M 240,310 Q 242,305 244,310" />
            <path d="M 245,312 Q 247,307 249,312" />
            <path d="M 250,308 Q 252,303 254,308" />
            
            <path d="M 380,350 Q 382,345 384,350" />
            <path d="M 385,352 Q 387,347 389,352" />
            
            <path d="M 460,380 Q 462,375 464,380" />
            <path d="M 465,382 Q 467,377 469,382" />
            
            <path d="M 510,420 Q 512,415 514,420" />
            <path d="M 280,460 Q 282,455 284,460" />
          </g>

          {/* Dirt paths */}
          <path
            d="M 400,560 Q 380,480 360,420 Q 340,360 320,300"
            stroke="#a0826d"
            strokeWidth="8"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 360,420 Q 420,400 480,390"
            stroke="#a0826d"
            strokeWidth="7"
            fill="none"
            opacity="0.4"
          />
        </svg>

        {/* Question markers */}
        {QUESTION_POSITIONS.map((pos, idx) => {
          const isAnswered = answeredQuestions.includes(idx);

          return (
            <motion.div
              key={idx}
              className="absolute"
              style={{
                left: pos.x - 20,
                top: pos.y - 20,
              }}
              animate={{
                scale: isAnswered ? 1 : [1, 1.1, 1],
                opacity: isAnswered ? 0.4 : 1,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              {/* Rune stone */}
              <svg width="40" height="50" viewBox="0 0 40 50">
                <ellipse
                  cx="20"
                  cy="45"
                  rx="15"
                  ry="4"
                  fill="rgba(0,0,0,0.2)"
                />
                <rect
                  x="10"
                  y="10"
                  width="20"
                  height="35"
                  rx="3"
                  fill={isAnswered ? "#6b7280" : "#8b7280"}
                  stroke="#4a4a4a"
                  strokeWidth="2"
                />
                {!isAnswered && (
                  <text
                    x="20"
                    y="30"
                    fontSize="20"
                    fill="#f4ede1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ?
                  </text>
                )}
                {isAnswered && (
                  <text
                    x="20"
                    y="30"
                    fontSize="20"
                    fill="#2d5016"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    ✓
                  </text>
                )}
              </svg>
            </motion.div>
          );
        })}

        {/* Artifact markers */}
        {ARTIFACT_POSITIONS.map((pos, idx) => {
          const isCollected = collectedArtifacts.includes(idx);

          return (
            <motion.div
              key={idx}
              className="absolute"
              style={{
                left: pos.x - 20,
                top: pos.y - 20,
              }}
              animate={{
                scale: isCollected ? 1 : [1, 1.15, 1],
                opacity: isCollected ? 0 : 1,
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              {/* Artifact chest */}
              <svg width="40" height="50" viewBox="0 0 40 50">
                <ellipse
                  cx="20"
                  cy="45"
                  rx="15"
                  ry="4"
                  fill="rgba(0,0,0,0.2)"
                />
                {/* Golden chest */}
                <rect
                  x="8"
                  y="20"
                  width="24"
                  height="20"
                  rx="2"
                  fill="#d4a574"
                  stroke="#b8860b"
                  strokeWidth="2"
                />
                {/* Chest lid */}
                <path
                  d="M8,20 Q20,10 32,20"
                  fill="#c9a574"
                  stroke="#b8860b"
                  strokeWidth="2"
                />
                {/* Lock */}
                <circle
                  cx="20"
                  cy="28"
                  r="3"
                  fill="#8b6f47"
                  stroke="#654321"
                  strokeWidth="1"
                />
                {/* Sparkles */}
                {!isCollected && (
                  <>
                    <circle cx="10" cy="15" r="1.5" fill="#fff" opacity="0.8" />
                    <circle cx="30" cy="15" r="1.5" fill="#fff" opacity="0.8" />
                    <circle cx="15" cy="10" r="1" fill="#fff" opacity="0.6" />
                    <circle cx="25" cy="10" r="1" fill="#fff" opacity="0.6" />
                  </>
                )}
              </svg>
            </motion.div>
          );
        })}

        {/* Player character (Viking) */}
        <motion.div
          className="absolute z-10"
          style={{
            left: playerPos.x - 25,
            top: playerPos.y - 35,
          }}
          animate={{
            rotate: keysPressed.size > 0 ? [0, -2, 2, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            repeat: keysPressed.size > 0 ? Infinity : 0,
          }}
        >
          {/* Viking character - Enhanced */}
          <svg width="50" height="70" viewBox="0 0 50 70">
            {/* Shadow */}
            <ellipse cx="25" cy="65" rx="15" ry="5" fill="rgba(0,0,0,0.3)" />

            {/* Legs with fur boots */}
            <rect x="18" y="50" width="6" height="12" fill="#654321" rx="2" />
            <rect x="26" y="50" width="6" height="12" fill="#654321" rx="2" />
            <rect x="17" y="58" width="7" height="6" fill="#8b6f47" rx="1" />
            <rect x="26" y="58" width="7" height="6" fill="#8b6f47" rx="1" />

            {/* Chainmail/Tunic body */}
            <path
              d="M18,32 L18,50 Q25,52 32,50 L32,32 Z"
              fill="#8b2e2e"
              stroke="#654321"
              strokeWidth="1"
            />
            
            {/* Belt */}
            <rect x="16" y="48" width="18" height="3" fill="#654321" />
            <circle cx="25" cy="49.5" r="2" fill="#d4a574" stroke="#8b6f47" strokeWidth="0.5" />

            {/* Shield on back */}
            <circle cx="12" cy="38" r="6" fill="#8b6f47" stroke="#654321" strokeWidth="1.5" />
            <circle cx="12" cy="38" r="3" fill="#d4a574" />

            {/* Arms with bracers */}
            <rect x="10" y="34" width="5" height="14" fill="#e8b896" rx="2" />
            <rect x="35" y="34" width="5" height="14" fill="#e8b896" rx="2" />
            <rect x="10" y="42" width="5" height="4" fill="#654321" rx="1" />
            <rect x="35" y="42" width="5" height="4" fill="#654321" rx="1" />
            
            {/* Right hand holding axe */}
            <circle cx="38" cy="48" r="2" fill="#e8b896" />
            {/* Axe */}
            <rect x="40" y="44" width="2" height="12" fill="#654321" rx="0.5" />
            <path
              d="M42,44 L47,42 L48,48 L42,48 Z"
              fill="#6b7280"
              stroke="#4a4a4a"
              strokeWidth="1"
            />

            {/* Shoulders/armor */}
            <ellipse cx="18" cy="32" rx="4" ry="3" fill="#6b7280" />
            <ellipse cx="32" cy="32" rx="4" ry="3" fill="#6b7280" />

            {/* Neck */}
            <rect x="22" y="26" width="6" height="4" fill="#e8b896" />

            {/* Head/Face */}
            <circle cx="25" cy="20" r="9" fill="#e8b896" />
            
            {/* Beard - longer and more prominent */}
            <ellipse cx="25" cy="27" rx="8" ry="6" fill="#8b6f47" />
            <ellipse cx="25" cy="29" rx="7" ry="5" fill="#a0826d" />
            
            {/* Mustache */}
            <ellipse cx="20" cy="22" rx="3" ry="2" fill="#8b6f47" />
            <ellipse cx="30" cy="22" rx="3" ry="2" fill="#8b6f47" />

            {/* Eyes */}
            <circle cx="21" cy="18" r="1.5" fill="#2d4a5c" />
            <circle cx="29" cy="18" r="1.5" fill="#2d4a5c" />
            <circle cx="21.5" cy="17.5" r="0.5" fill="#fff" />
            <circle cx="29.5" cy="17.5" r="0.5" fill="#fff" />

            {/* Nose */}
            <line x1="25" y1="20" x2="25" y2="23" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" />

            {/* Viking helmet - detailed */}
            <ellipse cx="25" cy="14" rx="10" ry="8" fill="#6b7280" />
            <ellipse cx="25" cy="14" rx="9" ry="7" fill="#7d8794" />
            
            {/* Helmet nose guard */}
            <rect x="24" y="14" width="2" height="6" fill="#6b7280" rx="0.5" />
            
            {/* Helmet ridge */}
            <path
              d="M25,6 L25,14"
              stroke="#8b9aa8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Helmet side details */}
            <circle cx="16" cy="16" r="2" fill="#6b7280" />
            <circle cx="34" cy="16" r="2" fill="#6b7280" />
            
            {/* Helmet decorative bands */}
            <ellipse cx="25" cy="13" rx="10" ry="1" fill="#8b9aa8" opacity="0.7" />

            {/* Cape flowing behind */}
            <path
              d="M18,32 Q12,40 14,48"
              fill="#8b2e2e"
              opacity="0.6"
              stroke="#654321"
              strokeWidth="1"
            />
            <path
              d="M32,32 Q38,40 36,48"
              fill="#8b2e2e"
              opacity="0.6"
              stroke="#654321"
              strokeWidth="1"
            />
          </svg>
        </motion.div>

        {/* Ship (if unlocked) */}
        {hasShip && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute bottom-8 right-8 z-5"
          >
            <Ship className="w-16 h-16 text-[#8b6f47]" strokeWidth={1.5} />
          </motion.div>
        )}

        {/* Completion message */}
        {allQuestionsAnswered && score !== undefined && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] max-w-lg"
          >
            <div className="bg-gradient-to-br from-[#d4a574] to-[#b8860b] px-6 md:px-12 py-6 md:py-8 rounded-xl md:rounded-2xl border-3 md:border-4 border-[#8b6f47] shadow-2xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-6xl mb-3 md:mb-4"
              >
                {score >= 70 ? '🏆' : '⚔️'}
              </motion.div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white mb-2 md:mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {score >= 70 ? 'Victory!' : 'Island Conquered!'}
              </h2>
              <p className="text-2xl md:text-3xl text-white font-bold mb-2">
                Score: {Math.round(score)}%
              </p>
              <p className="text-base md:text-lg lg:text-xl text-white/90">
                {score >= 70 ? 'Sailing to the next island...' : 'Review your answers...'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}