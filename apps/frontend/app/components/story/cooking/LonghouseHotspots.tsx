import React, { useEffect, useState } from 'react';
import './CookingGame.css';

interface LonghouseHotspotsProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface LonghouseHotspot {
  id: string;
  icon: string;
  title: string;
  speaker: string;
  text: string;
  left: string;
  top: string;
}

interface LonghouseQuestion {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

const LONGHOUSE_HOTSPOTS: LonghouseHotspot[] = [
  {
    id: '1-11',
    icon: '🧶',
    title: 'Lõngakera',
    speaker: 'Sigrid',
    text: 'Ilma naiste käte ja kedveta poleks teil purjesid, mis teid kohale viiks, ega kuubesid, mis teid merel soojas hoiaks.',
    left: '23%',
    top: '67%',
  },
  {
    id: '1-12',
    icon: '🔑',
    title: 'Uksevõtmed',
    speaker: 'Sigrid',
    text: 'Võtmed minu vööl tähendavad, et mina valitsen seda vara. Kui peremees on merel, on naise sõna siin majas seadus.',
    left: '77%',
    top: '42%',
  },
  {
    id: '1-13',
    icon: '🌾',
    title: 'Kahlud seinal',
    speaker: 'Sigrid',
    text: 'Sool ja suits, Björn. Ilma toidutagavarata ei jõua te isegi poolele merele. Meie muudame suvise saagi talviseks ellujäämiseks.',
    left: '25%',
    top: '35%',
  },
  {
    id: '1-14',
    icon: '⚖️',
    title: 'Kirst ja kaalud',
    speaker: 'Sigrid',
    text: 'See pole lihtsalt sära. See on kaubandus. Viiking on pooleldi sõdalane, pooleldi kaupmees.',
    left: '76%',
    top: '74%',
  },
  {
    id: '1-15',
    icon: '🔥',
    title: 'Suitsuava ja kolle',
    speaker: 'Sigrid',
    text: 'Tuli on pikkmaja süda. Kui sa oled merel ligunenud ja külmunud, on see tuli ainus asi, mis su hinge kehas hoiab.',
    left: '50%',
    top: '54%',
  },
  {
    id: '1-16',
    icon: '🪣',
    title: 'Puidust küna',
    speaker: 'Sigrid',
    text: 'Vili ja humal. Meie põllud toidavad meid, mitte meri. Retk algab põllult ja lõpeb põllul.',
    left: '50%',
    top: '77%',
  },
];

const LONGHOUSE_QUESTIONS: LonghouseQuestion[] = [
  {
    id: '1-17-1',
    question: 'Kellel on õigus otsustada talu vara üle, kui mehed on merel?',
    answers: ['Vanimal sõdalasel', 'Talunaisel, kelle vööl on võtmed', 'Kõige nooremal pojal'],
    correctIndex: 1,
    explanation: 'Võtmed naise vööl näitasid vastutust majapidamise, vara ja toiduvarude üle.',
  },
  {
    id: '1-17-2',
    question: 'Mida pead laevale kõige rohkem kaasa võtma?',
    answers: ['Ehteid ja hõbedat', 'Värsket vilja', 'Kuivatatud kala ja soolatud liha'],
    correctIndex: 2,
    explanation: 'Pikal mereretkel pidasid vastu just soolatud, suitsutatud ja kuivatatud toiduvarud.',
  },
  {
    id: '1-17-3',
    question: 'Mis lükkab laeva edasi, kui tuult ei ole?',
    answers: ['Lohepea vööris', 'Aerud ja meeskonna ühine rütm', 'Kirstud laeva põhjas'],
    correctIndex: 1,
    explanation: 'Kui tuul vaibub, liigub pikklaev edasi sõudjate jõu ja ühise rütmi abil.',
  },
];

export function LonghouseHotspots({ isOpen, onClose, onComplete }: LonghouseHotspotsProps) {
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'hotspots' | 'quiz'>('hotspots');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const activeHotspot = LONGHOUSE_HOTSPOTS.find((hotspot) => hotspot.id === activeHotspotId);
  const allHotspotsVisited = visitedHotspots.length >= LONGHOUSE_HOTSPOTS.length;
  const currentQuestion = LONGHOUSE_QUESTIONS[questionIndex];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const quizComplete = Object.keys(selectedAnswers).length >= LONGHOUSE_QUESTIONS.length;
  const correctCount = LONGHOUSE_QUESTIONS.filter(
    (question) => selectedAnswers[question.id] === question.correctIndex
  ).length;

  useEffect(() => {
    if (isOpen) {
      setVisitedHotspots([]);
      setActiveHotspotId(null);
      setPhase('hotspots');
      setQuestionIndex(0);
      setSelectedAnswers({});
    }
  }, [isOpen]);

  const handleHotspotClick = (hotspot: LonghouseHotspot) => {
    setActiveHotspotId(hotspot.id);
    setVisitedHotspots((current) =>
      current.includes(hotspot.id) ? current : [...current, hotspot.id]
    );
  };

  const handleFinish = () => {
    if (phase === 'hotspots') {
      if (!allHotspotsVisited) return;
      setPhase('quiz');
      setQuestionIndex(0);
      return;
    }

    if (!quizComplete) return;
    onComplete();
    setTimeout(() => onClose(), 350);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!currentQuestion || selectedAnswer !== undefined) return;

    setSelectedAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === undefined) return;

    if (questionIndex < LONGHOUSE_QUESTIONS.length - 1) {
      setQuestionIndex((current) => current + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cooking-overlay">
      <div className="cooking-backdrop" onClick={onClose} />

      <div className="leather-panel">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="panel-content">
          <div className="panel-title">🗝️ Pikkmaja</div>
          <div className="panel-subtitle">
            {phase === 'hotspots' ? 'Sigridi õpetus' : 'Kontrolltest'}
          </div>

          <div className="longhouse-section">
            <div className="kitchen-header">
              <span className="fire-icon">🗝️</span>
              <h3>{phase === 'hotspots' ? 'PIKKMAJA' : 'KONTROLLTEST'}</h3>
            </div>

            {phase === 'hotspots' ? (
              <>
                <div className="recipe-info">
                  <strong>Sigridi õpetus.</strong> Klõpsa pikkmaja esemetel ja kuula, mida need viikingielu kohta räägivad.
                </div>

                <div className="hotspot-progress">
                  {visitedHotspots.length} / {LONGHOUSE_HOTSPOTS.length} leitud
                </div>

                <div className="longhouse-scene" aria-label="Pikkmaja klikitavad hotspotid">
                  <div className="longhouse-roof" aria-hidden="true" />
                  <div className="longhouse-wall" aria-hidden="true" />
                  <div className="longhouse-hearth" aria-hidden="true" />

                  {LONGHOUSE_HOTSPOTS.map((hotspot) => {
                    const isVisited = visitedHotspots.includes(hotspot.id);
                    const isActive = activeHotspotId === hotspot.id;

                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        className={`longhouse-hotspot ${isVisited ? 'visited' : ''} ${isActive ? 'active' : ''}`}
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

                <div className="hotspot-list" aria-label="Pikkmaja esemed">
                  {LONGHOUSE_HOTSPOTS.map((hotspot) => {
                    const isVisited = visitedHotspots.includes(hotspot.id);
                    const isActive = activeHotspotId === hotspot.id;

                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        className={`hotspot-list-item ${isVisited ? 'visited' : ''} ${isActive ? 'active' : ''}`}
                        onClick={() => handleHotspotClick(hotspot)}
                      >
                        <span className="hotspot-list-icon">{hotspot.icon}</span>
                        <span>{hotspot.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hotspot-fact-card">
                  {activeHotspot ? (
                    <>
                      <div className="hotspot-fact-title">{activeHotspot.title}</div>
                      <p>{activeHotspot.text}</p>
                    </>
                  ) : (
                    <>
                      <div className="hotspot-fact-title">Vali ese</div>
                      <p>Sigrid selgitab iga pikkmaja eseme tähendust ja miks kodu tarkus retke õnnestumiseks vajalik on.</p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="sigrid-quiz" aria-live="polite">
                <div className="quiz-count">
                  Küsimus {questionIndex + 1} / {LONGHOUSE_QUESTIONS.length}
                </div>

                {currentQuestion && (
                  <>
                    <div className="quiz-question">{currentQuestion.question}</div>

                    <div className="quiz-answer-grid">
                      {currentQuestion.answers.map((answer, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correctIndex;
                        const showResult = selectedAnswer !== undefined;

                        return (
                          <button
                            key={answer}
                            type="button"
                            className={`quiz-answer ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${showResult && isSelected && !isCorrect ? 'wrong' : ''}`}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={showResult}
                          >
                            <span className="quiz-answer-letter">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{answer}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswer !== undefined && (
                      <div className={`quiz-feedback ${selectedAnswer === currentQuestion.correctIndex ? 'correct' : 'wrong'}`}>
                        <strong>
                          {selectedAnswer === currentQuestion.correctIndex ? 'Õige!' : 'Vale.'}
                        </strong>{' '}
                        {currentQuestion.explanation}
                      </div>
                    )}
                  </>
                )}

                {quizComplete && (
                  <div className="quiz-result">
                    Tulemus: {correctCount} / {LONGHOUSE_QUESTIONS.length}
                  </div>
                )}
              </div>
            )}

            <button
              className={`cook-btn ${(phase === 'hotspots' && allHotspotsVisited) || quizComplete ? 'ready' : ''}`}
              onClick={phase === 'quiz' && selectedAnswer !== undefined && !quizComplete ? handleNextQuestion : handleFinish}
              disabled={
                phase === 'hotspots'
                  ? !allHotspotsVisited
                  : selectedAnswer === undefined || (!quizComplete && questionIndex >= LONGHOUSE_QUESTIONS.length - 1)
              }
            >
              {phase === 'hotspots'
                ? allHotspotsVisited ? '🧠 Alusta Sigridi kontrolltesti' : `🗝️ Uuri veel (${visitedHotspots.length}/${LONGHOUSE_HOTSPOTS.length})`
                : quizComplete ? '🎒 Võta Kodumulla paun kaasa' : 'Järgmine küsimus'}
            </button>
          </div>

          <div className="dialogue-box">
            <div className="dialogue-avatar">🗝️</div>
            <div className="dialogue-content">
              <div className="dialogue-speaker">{activeHotspot?.speaker ?? 'Sigrid'}</div>
              <div className="dialogue-text">
                "{phase === 'quiz'
                  ? selectedAnswer === undefined
                    ? 'Vaatame, kas sa kuulasid või ainult noogutasid.'
                    : selectedAnswer === currentQuestion?.correctIndex
                      ? 'Nii on. Pikkmajas jääb ellu see, kes märkab.'
                      : 'Mõtle veel, Björn. Tööriist räägib, kui sa teda kuulad.'
                  : activeHotspot?.text ?? 'Nüüd vaata ringi, Björn. Pikkmaja õpetab rohkem kui mõõk, kui sa oskad märgata.'}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
