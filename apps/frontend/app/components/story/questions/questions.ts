import { type Question } from './QuestionModal';

export const ISLAND_QUESTIONS: Record<'rootsi' | 'gotland' | 'saaremaa', Question[]> = {

  // Rootsi — viikingite ajalugu üldiselt (küsimused 1–8)
  rootsi: [
    {
      question: "Kes olid viikingid?",
      answers: ["Keldi hõimud", "Keskaegsed mungad", "Skandinaavia meresõitjad", "Rooma sõdurid"],
      correct: 2,
    },
    {
      question: "Mis oli peamine põhjus, miks viikingid Euroopat rüüstasid?",
      answers: ["Põgenemine kõrbest", "Põllumaa ja rikkuse puudus", "Püramiidide ehitamine", "Usuline pööramine"],
      correct: 1,
    },
    {
      question: "Mis oli \"jarl\" viikingite ühiskonnas?",
      answers: ["Ori", "Aadlik/pealik", "Kuningas", "Talupoeg"],
      correct: 1,
    },
    {
      question: "Mis oskus tegi viikingid eriti edukaks?",
      answers: ["Kiviraiumine", "Navigatsioon ja laevaehitus", "Hobuste aretamine", "Raamatute kirjutamine"],
      correct: 1,
    },
    {
      question: "Mida tegid enamik viikingeid peale rüüstamise?",
      answers: ["Pangandust", "Maali", "Põllumajandust", "Kosmoseuuringuid"],
      correct: 2,
    },
    {
      question: "Mis materjalist olid viikingite majad peamiselt ehitatud?",
      answers: ["Tellistest", "Jääst", "Puidust ja turbast", "Kivist"],
      correct: 2,
    },
    {
      question: "Mis oli \"thrall\" viikingite ühiskonnas?",
      answers: ["Ori", "Sõjapealik", "Preester", "Laevakapten"],
      correct: 0,
    },
    {
      question: "Mis lõpetas viikingite ajastu?",
      answers: ["Maavärinad", "Rooma invasioon", "Kristianiseerimine ja poliitilised muutused", "Tööstusrevolutsioon"],
      correct: 2,
    },
  ],

  // Gotland — laevad ja meresõit (küsimused 9–16)
  gotland: [
    {
      question: "Mis oli kõige kuulsam viikingite laeva tüüp?",
      answers: ["Knarr", "Pikklaev", "Karve", "Faering"],
      correct: 1,
    },
    {
      question: "Kuidas navigeerisid viikingid merel?",
      answers: ["Kompassiga", "Päikesekivi ja tähtedega", "Ainult kaartidega", "Lindude järgi"],
      correct: 1,
    },
    {
      question: "Mis puidust ehitati viikingite laevu peamiselt?",
      answers: ["Männipuit", "Tammepuit", "Nii tamme- kui männipuit", "Kasepuit"],
      correct: 2,
    },
    {
      question: "Mis on knarr?",
      answers: ["Sõjalaev", "Kaubalaev", "Sõudepaat", "Kalapaat"],
      correct: 1,
    },
    {
      question: "Millest oli viikingite laeva puri tavaliselt tehtud?",
      answers: ["Siidist", "Puuvillast", "Villast", "Linasest"],
      correct: 2,
    },
    {
      question: "Millisele kaugele maale jõudsid viikingid umbes aastal 1000 pKr?",
      answers: ["Austraaliasse", "Põhja-Ameerikasse", "Antarktikasse", "Jaapanisse"],
      correct: 1,
    },
    {
      question: "Mis on klinkerdamine laevanduses?",
      answers: ["Purjetüüp", "Kattuvate laudade meetod", "Navigatsioonitehnika", "Ankrutüüp"],
      correct: 1,
    },
    {
      question: "Kui pikk oli viikingite pikalaev keskmiselt?",
      answers: ["10–15 meetrit", "20–30 meetrit", "40–50 meetrit", "60–70 meetrit"],
      correct: 1,
    },
  ],

  // Saaremaa — norroni mütoloogia ja Salme laevmatused (küsimused 17–24)
  saaremaa: [
    {
      question: "Kes on norroni mütoloogia peajumal?",
      answers: ["Loki", "Thor", "Freyr", "Odin"],
      correct: 3,
    },
    {
      question: "Mis on Ragnarök?",
      answers: ["Viikingite laev", "Püha festival", "Maailmalõpu lahing", "Relv"],
      correct: 2,
    },
    {
      question: "Mis relv on tihedalt seotud jumal Thoriga?",
      answers: ["Oda", "Mõõk", "Haamer", "Kirves"],
      correct: 2,
    },
    {
      question: "Milleks kasutasid viikingid ruune?",
      answers: ["Toiduvalmistamiseks", "Kirjutamiseks ja maagiaks", "Maalimiseks", "Navigatsiooniks"],
      correct: 1,
    },
    {
      question: "Mis on Salme laevmatused?",
      answers: ["Keskaegne kindlus", "Viikingite festival", "Lahingu taaslavastus", "Kaks iidset laevmatust Eestis"],
      correct: 3,
    },
    {
      question: "Mida leidsid arheoloogid Salme haudadest?",
      answers: ["Kullatäis kirste", "Relvi ja sõdalaste varustust", "Palju keraamikat", "Viljaga laevu"],
      correct: 1,
    },
    {
      question: "Miks on Salme leid tähtis?",
      answers: ["See näitab varast viikingite sõjategevust Läänemere piirkonnas", "See on Euroopa vanim kindlus", "See tõestab, et viikingid ei seilanud", "See näitab Rooma kaubateid"],
      correct: 0,
    },
    {
      question: "Mida näitavad Salme leiud viikingite kohta?",
      answers: ["Nad olid oskuslikud põllumehed", "Nad vältisid sõjategevust", "Nad ei lahkunud Skandinaaviast", "Nad olid aktiivsemad varem, kui arvati"],
      correct: 3,
    },
  ],
};

// Konfiguratsioon — millise saare peal on küsimused aktiveeritud
export const QUESTIONS_ENABLED: Record<'rootsi' | 'gotland' | 'saaremaa', boolean> = {
  rootsi: false,  // ← muuda true kui tahad küsimused sisse lülitada
  gotland: true,
  saaremaa: true,
};