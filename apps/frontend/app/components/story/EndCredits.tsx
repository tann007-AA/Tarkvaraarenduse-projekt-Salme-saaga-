import React, { useEffect } from 'react';
import './EndCredits.css';

interface EndCreditsProps {
  onComplete: () => void;
}

export function EndCredits({ onComplete }: EndCreditsProps) {
  useEffect(() => {
    // Auto-complete after animation finishes (~35s)
    const timer = setTimeout(() => {
      onComplete();
    }, 36000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="credits-screen">
      <div className="stars" aria-hidden="true" />

      <section className="crawl-wrapper">
        <div className="crawl">
          <h1 className="credits-title">Salme Saaga</h1>

          <div className="credit-block">
            <h2>Projekti autorid</h2>
            <p>Taaniel Tubin</p>
            <p>Karl-Kregor Keerles</p>
            <p>Patrick Jurs</p>
            <p>Remus-Markus Luht</p>
            <p>Rasmus Steinberg</p>
            <p>Markus Parts</p>
            <p>Maik Hellamaa</p>
            <p>Marko Rajang</p>
            <p>Martin Kullerkupp</p>
            <p>Kregor Veemaa</p>
          </div>

          <div className="credit-block">
            <h2>Instituut ja raamistik</h2>
            <p>Tallinna Ülikooli Digitehnoloogia Instituut (DTI)</p>
            <p>ELU projekt:</p>
            <p>"Tulevikuõpe ja loovtehnoloogiad: millist lugu jutustavad mäluasutused?"</p>
          </div>

          <div className="credit-block">
            <h2>Kasutatud Materjalid</h2>
            <p>Clockwork Raven Studios</p>
            <p>S Frisk</p>
            <p>Aivopiru</p>
            <p>Kenmi</p>
            <p>Free Game Assets (GUI, Sprite, Tilesets)</p>
            <p>Carbonova</p>
            <p>PIXEL_1992</p>
            <p>Alkakrab</p>
            <p>Flaticon - Freepik</p>
          </div>

          <div className="credit-block" style={{ marginTop: '100px' }}>
            <p>Täname mängimast!</p>
          </div>
        </div>
      </section>

      <button
        id="skipCreditsBtn"
        className="skip-credits-btn"
        onClick={onComplete}
      >
        Jäta vahele
      </button>
    </main>
  );
}
