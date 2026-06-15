export const translations = {
  en: {
    // Main Menu
    mainMenu: {
      title: "Viking Quest",
      subtitle: "Journey through Myth and History",
      play: "Play",
      guide: "Guide",
      settings: "Settings"
    },

    // Login Modal
    login: {
      title: "Choose Your Path",
      subtitle: "Select how you'd like to embark on your Viking journey",
      singleplayer: "Singleplayer",
      singleplayerDesc: "Solo adventure through the islands",
      school: "School Mode",
      schoolDesc: "Join your class on this quest",
      enterName: "Enter your name",
      enterCode: "Enter class code",
      cancel: "Cancel",
      start: "Start Adventure"
    },

    // Settings Modal
    settings: {
      title: "Settings",
      subtitle: "Customize your Viking Quest experience",
      audio: "Audio",
      soundEffects: "Sound Effects",
      soundEffectsDesc: "Battle sounds and interactions",
      soundVolume: "Sound Volume",
      backgroundMusic: "Background Music",
      backgroundMusicDesc: "Viking themed soundtrack",
      musicVolume: "Music Volume",
      display: "Display",
      fullscreenMode: "Fullscreen Mode",
      fullscreenDesc: "Immersive gameplay experience",
      colorTheme: "Color Theme",
      default: "Default",
      dark: "Dark",
      light: "Light",
      animations: "Animations",
      animationsDesc: "Visual effects and transitions",
      languageAccessibility: "Language & Accessibility",
      language: "Language",
      textSize: "Text Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      saveClose: "Save & Close",
      reset: "Reset",
      savedLocally: "Settings are saved locally on this device",
      returnToMenu: "Return to Main Menu",
      confirmReturnToMenu: "Are you sure you want to return to the main menu? Your current progress will be lost."
    },

    // Start Screen
    start: {
      title: "The Viking's Journey",
      story: "Long ago, brave Vikings sailed across treacherous seas, seeking glory, knowledge, and new lands. You are a young Viking who must prove yourself by answering the challenges of four mystical islands.\n\nEach island holds ancient questions about Norse mythology, Viking ships, culture, and the legendary Salme warriors. Answer wisely, collect sacred artifacts, and earn your place in Valhalla!\n\nYour journey begins on Mjölnir Isle, where you must earn your ship by mastering the questions of the gods. Only then can you sail to the other islands.\n\nSkål! May Odin guide your path!",
      beginJourney: "Begin Your Journey"
    },

    // Tutorial Modal
    tutorial: {
      title: "How to Play",
      welcome: "Welcome, Viking Warrior!",
      objectives: "Your Objectives",
      objective1: "Explore each island by moving your Viking character",
      objective2: "Answer questions correctly to progress (70% to pass)",
      objective3: "Collect sacred artifacts to use as lifelines",
      objective4: "Complete all four islands to win the game",
      movement: "Movement",
      movementDesc: "Use arrow keys or WASD to move your Viking",
      questions: "Questions",
      questionsDesc: "Walk into question markers (?) to trigger quiz challenges",
      artifacts: "Artifacts",
      artifactsDesc: "Collect sword, shield, knife, dice, and gaming pieces to help you",
      lifelines: "Using Lifelines",
      lifeline1: "50/50: Remove two wrong answers",
      lifeline2: "Skip: Skip the current question",
      scoring: "Scoring",
      scoringDesc: "Get 70% or more correct to unlock the next island. If you fail, you'll retry the wrong questions.",
      tips: "Tips",
      tip1: "Explore thoroughly - artifacts are hidden across the island",
      tip2: "Use lifelines wisely - they're limited!",
      tip3: "Read questions carefully before answering",
      ready: "I'm Ready!",
      close: "Close"
    },

    // Quiz Screen
    quiz: {
      question: "Question",
      of: "of",
      inventory: "Inventory",
      fiftyFifty: "50/50",
      fiftyFiftyDesc: "Remove 2 wrong answers",
      skip: "Skip",
      skipDesc: "Skip this question",
      answer: "Answer",
      skipSuccess: "Question skipped! Move on to the next one.",
      skipFail: "No skip artifacts available!"
    },

    // Retry Modal
    retry: {
      title: "Almost There!",
      subtitle: "You need 70% to pass. Try these questions again:",
      retryQuestions: "Retry Questions",
      submitAnswers: "Submit Answers",
      question: "Question"
    },

    // Sailing Transition
    sailing: {
      title: "Setting Sail...",
      subtitle: "Navigating to the next island"
    },

    // End Screen
    end: {
      victoryTitle: "Glorious Victory!",
      victorySubtitle: "You have conquered all the islands!",
      victoryMessage: "Your knowledge of Viking lore is legendary! You have proven yourself worthy of Valhalla. The skalds will sing songs of your triumphs for generations to come!",
      defeatTitle: "Journey's End",
      defeatSubtitle: "The quest was too challenging",
      defeatMessage: "Fear not, brave warrior! Even the mightiest Vikings faced setbacks. Study the ancient tales, sharpen your knowledge, and return stronger!",
      islandsCompleted: "Islands Completed",
      playAgain: "Play Again"
    },

    // Progress Bar
    progress: {
      yourProgress: "Your Progress"
    },

    // Islands
    islands: {
      mjolnirIsle: "Mjölnir Isle",
      dragonshipBay: "Dragonship Bay",
      runeRock: "Rune Rock",
      salmeIsland: "Salme Island"
    },

    // Artifacts
    artifacts: {
      sword: "Battle Axe",
      swordDesc: "Cuts through wrong answers (50/50)",
      shield: "Odin's Shield",
      shieldDesc: "Protects from one wrong answer",
      knife: "Dagger",
      knifeDesc: "Reveals hidden hints",
      dice: "Fate Dice",
      diceDesc: "Skip a difficult question",
      gamingPiece: "Ancient Gaming Piece",
      gamingPieceDesc: "Tactical advantage in quiz"
    },

    // Questions - Island 1: Mjölnir Isle
    mjolnirQuestions: [
      {
        question: "Who is the father of Thor in Norse mythology?",
        answers: ["Odin", "Loki", "Freyr", "Balder"],
        correct: 0
      },
      {
        question: "What is the name of Thor's hammer?",
        answers: ["Gungnir", "Mjölnir", "Gram", "Tyrfing"],
        correct: 1
      },
      {
        question: "Which tree connects the nine worlds in Norse cosmology?",
        answers: ["Oak of Ages", "Yggdrasil", "World Pine", "Cosmic Ash"],
        correct: 1
      },
      {
        question: "Who is the trickster god in Norse mythology?",
        answers: ["Heimdall", "Tyr", "Loki", "Freyr"],
        correct: 2
      },
      {
        question: "What is Valhalla?",
        answers: ["A sacred forest", "Hall of the slain warriors", "A mountain", "A sacred ship"],
        correct: 1
      },
      {
        question: "Who guards the Bifrost bridge?",
        answers: ["Odin", "Thor", "Heimdall", "Freya"],
        correct: 2
      },
      {
        question: "What are the Valkyries?",
        answers: ["Female warriors who choose the slain", "Sea monsters", "Giant ravens", "Magic wolves"],
        correct: 0
      },
      {
        question: "What will bring about Ragnarök?",
        answers: ["The breaking of chains", "Fimbulwinter", "The death of Odin", "All of the above"],
        correct: 3
      },
      {
        question: "Who is the goddess of love and beauty?",
        answers: ["Freya", "Frigg", "Sif", "Idunn"],
        correct: 0
      },
      {
        question: "What creatures pull Thor's chariot?",
        answers: ["Wolves", "Eagles", "Goats", "Horses"],
        correct: 2
      }
    ],

    // Questions - Island 2: Dragonship Bay
    dragonshipQuestions: [
      {
        question: "What was the most famous type of Viking ship?",
        answers: ["Knarr", "Longship", "Karve", "Faering"],
        correct: 1
      },
      {
        question: "How did Vikings navigate at sea?",
        answers: ["Compasses", "Sun stones and stars", "Maps only", "Following birds"],
        correct: 1
      },
      {
        question: "What was a Viking ship's dragon head for?",
        answers: ["Navigation", "Intimidation and protection", "Decoration only", "Weather prediction"],
        correct: 1
      },
      {
        question: "Which wood was commonly used for Viking ships?",
        answers: ["Pine", "Oak", "Both oak and pine", "Birch"],
        correct: 2
      },
      {
        question: "What is a knarr?",
        answers: ["A war ship", "A merchant vessel", "A rowing boat", "A fishing boat"],
        correct: 1
      },
      {
        question: "How many oars did a typical longship have?",
        answers: ["10-20", "20-40", "40-60", "60-80"],
        correct: 1
      },
      {
        question: "What was the Viking ship's sail typically made of?",
        answers: ["Silk", "Cotton", "Wool", "Linen"],
        correct: 2
      },
      {
        question: "Vikings reached which distant land around 1000 CE?",
        answers: ["Australia", "North America", "Antarctica", "Japan"],
        correct: 1
      },
      {
        question: "What is clinker building?",
        answers: ["A type of sail", "Overlapping planks method", "A navigation technique", "A type of anchor"],
        correct: 1
      },
      {
        question: "What was the average length of a Viking longship?",
        answers: ["10-15 meters", "20-30 meters", "40-50 meters", "60-70 meters"],
        correct: 1
      }
    ],

    // Questions - Island 3: Rune Rock
    runeRockQuestions: [
      {
        question: "What alphabet did Vikings use?",
        answers: ["Latin", "Runic (Futhark)", "Cyrillic", "Greek"],
        correct: 1
      },
      {
        question: "What was a Viking's primary weapon?",
        answers: ["Sword", "Axe", "Spear", "Bow"],
        correct: 2
      },
      {
        question: "Vikings came from which regions?",
        answers: ["Scandinavia", "Germany", "Britain", "Russia"],
        correct: 0
      },
      {
        question: "What was a 'Thing' in Viking society?",
        answers: ["A weapon", "An assembly or council", "A ship", "A feast"],
        correct: 1
      },
      {
        question: "Viking Age is generally dated as:",
        answers: ["500-800 CE", "793-1066 CE", "1000-1200 CE", "600-900 CE"],
        correct: 1
      },
      {
        question: "What was a berserker?",
        answers: ["A type of ship", "A fierce warrior", "A merchant", "A craftsman"],
        correct: 1
      },
      {
        question: "Vikings were also known as:",
        answers: ["Norsemen", "Celts", "Saxons", "Picts"],
        correct: 0
      },
      {
        question: "What event marks the start of the Viking Age?",
        answers: ["Battle of Hastings", "Raid on Lindisfarne", "Discovery of Iceland", "Founding of Dublin"],
        correct: 1
      },
      {
        question: "Viking warriors sought to die in battle to reach:",
        answers: ["Hel", "Valhalla", "Niflheim", "Midgard"],
        correct: 1
      },
      {
        question: "What were skalds?",
        answers: ["Warriors", "Poets and storytellers", "Blacksmiths", "Farmers"],
        correct: 1
      }
    ],

    // Questions - Island 4: Salme Island
    salmeQuestions: [
      {
        question: "Where is Salme located?",
        answers: ["Norway", "Sweden", "Saaremaa, Estonia", "Iceland"],
        correct: 2
      },
      {
        question: "What was discovered in Salme in 2008?",
        answers: ["Viking treasure", "Viking ship burials", "A Viking settlement", "Runestones"],
        correct: 1
      },
      {
        question: "How many men were buried in the Salme ships?",
        answers: ["About 10", "About 20", "Over 40", "Over 100"],
        correct: 2
      },
      {
        question: "The Salme ships date to approximately:",
        answers: ["600 CE", "750 CE", "900 CE", "1000 CE"],
        correct: 1
      },
      {
        question: "The Salme warriors likely came from:",
        answers: ["Norway", "Sweden", "Denmark", "Finland"],
        correct: 1
      },
      {
        question: "What makes the Salme find unique?",
        answers: ["Oldest Viking ship", "Only ship burial in Estonia", "Best preserved ship", "Largest Viking treasure"],
        correct: 1
      },
      {
        question: "Saaremaa is the largest island of:",
        answers: ["Norway", "Sweden", "Estonia", "Latvia"],
        correct: 2
      },
      {
        question: "The Salme warriors were likely on a:",
        answers: ["Trading mission", "Raid or military expedition", "Peaceful settlement", "Religious pilgrimage"],
        correct: 1
      },
      {
        question: "What happened to the Salme warriors?",
        answers: ["They settled peacefully", "They died in battle", "They returned home", "They founded a village"],
        correct: 1
      },
      {
        question: "The Salme find included:",
        answers: ["Gold coins", "Gaming pieces and weapons", "Manuscripts", "Jewelry only"],
        correct: 1
      }
    ]
  },

  et: {
    // Main Menu
    mainMenu: {
      title: "Viikingite Seiklus",
      subtitle: "Teekond läbi müütide ja ajaloo",
      play: "Mängi",
      guide: "Juhend",
      settings: "Seaded"
    },

    // Login Modal
    login: {
      title: "Vali oma tee",
      subtitle: "Vali, kuidas soovid alustada oma viikingite teekonda",
      singleplayer: "Üksik mängija",
      singleplayerDesc: "Üksik seiklus läbi saarte",
      school: "Koolirežiim",
      schoolDesc: "Liitu oma klassiga sellel seiklusel",
      enterName: "Sisesta oma nimi",
      enterCode: "Sisesta klassi kood",
      cancel: "Tühista",
      start: "Alusta seiklust"
    },

    // Settings Modal
    settings: {
      title: "Seaded",
      subtitle: "Kohanda oma viikingite seiklust",
      audio: "Heli",
      soundEffects: "Heliefektid",
      soundEffectsDesc: "Lahingu helid ja interaktsioonid",
      soundVolume: "Heli tugevus",
      backgroundMusic: "Taustamuusika",
      backgroundMusicDesc: "Viikingite teemaline muusika",
      musicVolume: "Muusika tugevus",
      display: "Ekraan",
      fullscreenMode: "Täisekraani režiim",
      fullscreenDesc: "Süvitsi mängukogemus",
      colorTheme: "Värviteema",
      default: "Vaikimisi",
      dark: "Tume",
      light: "Hele",
      animations: "Animatsioonid",
      animationsDesc: "Visuaalsed efektid ja üleminekud",
      languageAccessibility: "Keel ja juurdepääsetavus",
      language: "Keel",
      textSize: "Teksti suurus",
      small: "Väike",
      medium: "Keskmine",
      large: "Suur",
      saveClose: "Salvesta ja sulge",
      reset: "Lähtesta",
      savedLocally: "Seaded salvestatakse selles seadmes",
      returnToMenu: "Tagasi peamenüüsse",
      confirmReturnToMenu: "Kas oled kindel, et soovid minna peamenüüsse tagasi? Sinu praegune progress läheb kaotsi."
    },

    // Start Screen
    start: {
      title: "Viikingite teekond",
      story: "Ammu aega tagasi sõitsid vaprad viikingid üle ohtlike merede, otsides kuulsust, teadmisi ja uusi maid. Sa oled noor viiking, kes peab end tõestama, vastates nelja müstilise saare väljakutsetele.\n\nIga saar hoiab endas iidseid küsimusi Skandinaavia mütoloogia, viikingite laevade, kultuuri ja legendaarsete Salme sõdalaste kohta. Vasta targalt, kogu pühitsused ja teeni oma koht Valhallas!\n\nSinu teekond algab Mjölniri saarelt, kus pead teenima oma laeva, valdades jumalate küsimusi. Alles siis saad sõita teistele saartele.\n\nSkål! Las Odin juhib sinu teed!",
      beginJourney: "Alusta teekonda"
    },

    // Tutorial Modal
    tutorial: {
      title: "Kuidas mängida",
      welcome: "Tere tulemast, viikingite sõdalane!",
      objectives: "Sinu eesmärgid",
      objective1: "Uuri igat saart, liigutades oma viikingit",
      objective2: "Vasta küsimustele õigesti, et edasi liikuda (70% möödumiseks)",
      objective3: "Kogu pühitsusi, mida kasutada abivahendina",
      objective4: "Lõpeta kõik neli saart, et võita mäng",
      movement: "Liikumine",
      movementDesc: "Kasuta nooleklahve või WASD oma viikingit liigutamiseks",
      questions: "Küsimused",
      questionsDesc: "Kõnni küsimuste märkide (?) juurde, et käivitada viktoriin",
      artifacts: "Pühitsused",
      artifactsDesc: "Kogu mõõk, kilp, nuga, täringud ja mängunupud, et sind aidata",
      lifelines: "Abivahendite kasutamine",
      lifeline1: "50/50: Eemalda kaks valet vastust",
      lifeline2: "Jäta vahele: Jäta praegune küsimus vahele",
      scoring: "Punktiarvestus",
      scoringDesc: "Saa 70% või rohkem õigeid vastuseid, et avada järgmine saar. Kui ebaõnnestud, proovid valesti vastatud küsimusi uuesti.",
      tips: "Näpunäited",
      tip1: "Uuri põhjalikult - pühitsused on peidetud üle saare",
      tip2: "Kasuta abivahendeid targalt - neid on piiratud arv!",
      tip3: "Loe küsimusi hoolikalt enne vastamist",
      ready: "Olen valmis!",
      close: "Sulge"
    },

    // Quiz Screen
    quiz: {
      question: "Küsimus",
      of: "/",
      inventory: "Varustus",
      fiftyFifty: "50/50",
      fiftyFiftyDesc: "Eemalda 2 valet vastust",
      skip: "Jäta vahele",
      skipDesc: "Jäta see küsimus vahele",
      answer: "Vasta",
      skipSuccess: "Küsimus vahele jäetud! Liigu järgmise juurde.",
      skipFail: "Vahele jätmise pühitsusi pole saadaval!"
    },

    // Retry Modal
    retry: {
      title: "Peaaegu seal!",
      subtitle: "Vajad 70% möödumiseks. Proovi neid küsimusi uuesti:",
      retryQuestions: "Proovi uuesti",
      submitAnswers: "Saada vastused",
      question: "Küsimus"
    },

    // Sailing Transition
    sailing: {
      title: "Purjetame...",
      subtitle: "Liigume järgmise saare juurde"
    },

    // End Screen
    end: {
      victoryTitle: "Hiilgav võit!",
      victorySubtitle: "Oled vallutanud kõik saared!",
      victoryMessage: "Sinu teadmised viikingite pärimusest on legendaarsed! Oled tõestanud end Valhalla vääriliseks. Skaaldid laulavad su triumfidest põlvest põlve!",
      defeatTitle: "Teekonna lõpp",
      defeatSubtitle: "Seiklus oli liiga keeruline",
      defeatMessage: "Ära karda, vapper sõdalane! Isegi võimsamad viikingid kogesid tagasilööke. Õpi iidseid lugusid, teriterita oma teadmisi ja naase tugevamana!",
      islandsCompleted: "Läbitud saared",
      playAgain: "Mängi uuesti"
    },

    // Progress Bar
    progress: {
      yourProgress: "Sinu progress"
    },

    // Islands
    islands: {
      mjolnirIsle: "Mjölniri saar",
      dragonshipBay: "Draakonlaeva laht",
      runeRock: "Ruunikivi",
      salmeIsland: "Salme saar"
    },

    // Artifacts
    artifacts: {
      sword: "Valküüri mõõk",
      swordDesc: "Lõikab läbi valede vastuste (50/50)",
      shield: "Odini kilp",
      shieldDesc: "Kaitseb ühe vale vastuse eest",
      knife: "Ruuninuga",
      knifeDesc: "Paljastab peidetud vihjed",
      dice: "Saatuse täring",
      diceDesc: "Jäta raske küsimus vahele",
      gamingPiece: "Iidne mängunupp",
      gamingPieceDesc: "Taktiline eelis viktoriinis"
    },

    // Questions - Island 1: Mjölnir Isle
    mjolnirQuestions: [
      {
        question: "Kes on Thori isa Skandinaavia mütoloogias?",
        answers: ["Odin", "Loki", "Freyr", "Balder"],
        correct: 0
      },
      {
        question: "Mis on Thori haamri nimi?",
        answers: ["Gungnir", "Mjölnir", "Gram", "Tyrfing"],
        correct: 1
      },
      {
        question: "Milline puu ühendab üheksat maailma Skandinaavia kosmoloogias?",
        answers: ["Aegade tamm", "Yggdrasil", "Maailma mänd", "Kosmose saar"],
        correct: 1
      },
      {
        question: "Kes on pettur-jumal Skandinaavia mütoloogias?",
        answers: ["Heimdall", "Tyr", "Loki", "Freyr"],
        correct: 2
      },
      {
        question: "Mis on Valhalla?",
        answers: ["Püha mets", "Langenud sõdalaste saal", "Mägi", "Püha laev"],
        correct: 1
      },
      {
        question: "Kes valvab Bifrosti silda?",
        answers: ["Odin", "Thor", "Heimdall", "Freya"],
        correct: 2
      },
      {
        question: "Kes on Valkürjad?",
        answers: ["Naissodalased, kes valivad langenuid", "Merehirmed", "Hiiglaslikud kaarnad", "Võluhundid"],
        correct: 0
      },
      {
        question: "Mis toob kaasa Ragnaröki?",
        answers: ["Ahelate katkemine", "Fimbulwinter", "Odini surm", "Kõik eelnevad"],
        correct: 3
      },
      {
        question: "Kes on armastuse ja ilu jumalanna?",
        answers: ["Freya", "Frigg", "Sif", "Idunn"],
        correct: 0
      },
      {
        question: "Millised loomad tõmbavad Thori vankrit?",
        answers: ["Hundid", "Kotkad", "Kitsed", "Hobused"],
        correct: 2
      }
    ],

    // Questions - Island 2: Dragonship Bay
    dragonshipQuestions: [
      {
        question: "Milline oli kuulsaim viikingite laeva tüüp?",
        answers: ["Knarr", "Pikalaev", "Karve", "Faering"],
        correct: 1
      },
      {
        question: "Kuidas viikingid merel navigeerisid?",
        answers: ["Kompassid", "Päikesekivid ja tähed", "Ainult kaardid", "Linde jälgides"],
        correct: 1
      },
      {
        question: "Milleks oli viikingite laeva draakonipea?",
        answers: ["Navigeerimine", "Hirmutamine ja kaitse", "Ainult kaunistus", "Ilmaennustus"],
        correct: 1
      },
      {
        question: "Millist puitu kasutati tavaliselt viikingite laevade ehitamiseks?",
        answers: ["Mänd", "Tamm", "Nii tamm kui mänd", "Kask"],
        correct: 2
      },
      {
        question: "Mis on knarr?",
        answers: ["Sõjalaev", "Kaubalaev", "Sõudepaat", "Kalapaat"],
        correct: 1
      },
      {
        question: "Mitu aaret oli tüüpilisel pikalaeval?",
        answers: ["10-20", "20-40", "40-60", "60-80"],
        correct: 1
      },
      {
        question: "Millest oli viikingite laeva puri tavaliselt tehtud?",
        answers: ["Siid", "Puuvill", "Vill", "Lina"],
        correct: 2
      },
      {
        question: "Millisele kaugele maale jõudsid viikingid umbes 1000. aastal?",
        answers: ["Austraalia", "Põhja-Ameerika", "Antarktika", "Jaapan"],
        correct: 1
      },
      {
        question: "Mis on klingri-ehitus?",
        answers: ["Purje tüüp", "Kattuvate lautade meetod", "Navigeerimistehnika", "Ankru tüüp"],
        correct: 1
      },
      {
        question: "Milline oli viikingite pikalaeva keskmine pikkus?",
        answers: ["10-15 meetrit", "20-30 meetrit", "40-50 meetrit", "60-70 meetrit"],
        correct: 1
      }
    ],

    // Questions - Island 3: Rune Rock
    runeRockQuestions: [
      {
        question: "Millist tähestikku kasutasid viikingid?",
        answers: ["Ladina", "Ruuniline (Futhark)", "Kirillitsa", "Kreeka"],
        correct: 1
      },
      {
        question: "Milline oli viikingite peamine relv?",
        answers: ["Mõõk", "Kirves", "Oda", "Vibu"],
        correct: 2
      },
      {
        question: "Millistest piirkondadest pärinevad viikingid?",
        answers: ["Skandinaavia", "Saksamaa", "Britannia", "Venemaa"],
        correct: 0
      },
      {
        question: "Mis oli 'Thing' viikingite ühiskonnas?",
        answers: ["Relv", "Kogu või nõukogu", "Laev", "Pidusöök"],
        correct: 1
      },
      {
        question: "Viikingite ajastu on üldiselt dateeritud kui:",
        answers: ["500-800 pKr", "793-1066 pKr", "1000-1200 pKr", "600-900 pKr"],
        correct: 1
      },
      {
        question: "Kes oli berserk?",
        answers: ["Laeva tüüp", "Julm sõdalane", "Kaupmees", "Käsitööline"],
        correct: 1
      },
      {
        question: "Viikingid olid tuntud ka kui:",
        answers: ["Norralased", "Keldid", "Saksid", "Piktid"],
        correct: 0
      },
      {
        question: "Milline sündmus märgib viikingite ajastu algust?",
        answers: ["Hastingsi lahing", "Lindisfarne'i rüüstamine", "Islandi avastamine", "Dublini asutamine"],
        correct: 1
      },
      {
        question: "Viikingite sõdalased püüdsid lahingus surra, et jõuda:",
        answers: ["Hel", "Valhalla", "Niflheim", "Midgard"],
        correct: 1
      },
      {
        question: "Kes olid skaaldid?",
        answers: ["Sõdalased", "Luuletajad ja jutustajad", "Sepad", "Põllumehed"],
        correct: 1
      }
    ],

    // Questions - Island 4: Salme Island
    salmeQuestions: [
      {
        question: "Kus asub Salme?",
        answers: ["Norras", "Rootsis", "Saaremaal, Eestis", "Islandil"],
        correct: 2
      },
      {
        question: "Mis avastati Salmes 2008. aastal?",
        answers: ["Viikingite aare", "Viikingite laevmatused", "Viikingite asula", "Ruunikivid"],
        correct: 1
      },
      {
        question: "Mitu meest oli Salme laevadesse maetud?",
        answers: ["Umbes 10", "Umbes 20", "Üle 40", "Üle 100"],
        correct: 2
      },
      {
        question: "Salme laevad pärinevad ligikaudu:",
        answers: ["600 pKr", "750 pKr", "900 pKr", "1000 pKr"],
        correct: 1
      },
      {
        question: "Salme sõdalased tulid tõenäoliselt:",
        answers: ["Norrast", "Rootsist", "Taanist", "Soomest"],
        correct: 1
      },
      {
        question: "Mis teeb Salme leiu ainulaadseks?",
        answers: ["Vanim viikingite laev", "Ainus laevmatus Eestis", "Kõige paremini säilinud laev", "Suurim viikingite aare"],
        correct: 1
      },
      {
        question: "Saaremaa on suurim saar:",
        answers: ["Norras", "Rootsis", "Eestis", "Lätis"],
        correct: 2
      },
      {
        question: "Salme sõdalased olid tõenäoliselt:",
        answers: ["Kaubandusmissioonil", "Rüüsteretkel või sõjakaval", "Rahumeelsel asustamieel", "Usupühimused"],
        correct: 1
      },
      {
        question: "Mis juhtus Salme sõdalastega?",
        answers: ["Nad asustasid rahumeelselt", "Nad surid lahingus", "Nad naasid koju", "Nad asutasid küla"],
        correct: 1
      },
      {
        question: "Salme leid sisaldas:",
        answers: ["Kuldmünte", "Mängunuppe ja relvi", "Käsikirju", "Ainult ehteid"],
        correct: 1
      }
    ]
  },

  no: {
    // Main Menu
    mainMenu: {
      title: "Vikingeventyret",
      subtitle: "Reise gjennom myte og historie",
      play: "Spill",
      guide: "Guide",
      settings: "Innstillinger"
    },

    // Login Modal
    login: {
      title: "Velg din vei",
      subtitle: "Velg hvordan du vil starte vikingereisen",
      singleplayer: "Enkeltspiller",
      singleplayerDesc: "Solo eventyr gjennom øyene",
      school: "Skolemodus",
      schoolDesc: "Bli med klassen på dette eventyret",
      enterName: "Skriv inn navnet ditt",
      enterCode: "Skriv inn klassekode",
      cancel: "Avbryt",
      start: "Start eventyr"
    },

    // Settings Modal
    settings: {
      title: "Innstillinger",
      subtitle: "Tilpass ditt vikingeventyr",
      audio: "Lyd",
      soundEffects: "Lydeffekter",
      soundEffectsDesc: "Kamplyder og interaksjoner",
      soundVolume: "Lydvolum",
      backgroundMusic: "Bakgrunnsmusikk",
      backgroundMusicDesc: "Vikingtema musikk",
      musicVolume: "Musikkvolum",
      display: "Skjerm",
      fullscreenMode: "Fullskjermmodus",
      fullscreenDesc: "Oppslukende spillopplevelse",
      colorTheme: "Fargetema",
      default: "Standard",
      dark: "Mørk",
      light: "Lys",
      animations: "Animasjoner",
      animationsDesc: "Visuelle effekter og overganger",
      languageAccessibility: "Språk og tilgjengelighet",
      language: "Språk",
      textSize: "Tekststørrelse",
      small: "Liten",
      medium: "Medium",
      large: "Stor",
      saveClose: "Lagre og lukk",
      reset: "Tilbakestill",
      savedLocally: "Innstillinger lagres lokalt på denne enheten",
      returnToMenu: "Gå tilbake til hovedmenyen",
      confirmReturnToMenu: "Er du sikker på at du vil gå tilbake til hovedmenyen? Din nåværende fremgang vil gå tapt."
    },

    // Start Screen
    start: {
      title: "Vikingens reise",
      story: "For lenge siden seilte modige vikinger over farlige hav, på jakt etter ære, kunnskap og nye land. Du er en ung viking som må bevise seg selv ved å besvare utfordringene på fire mystiske øyer.\n\nHver øy holder gamle spørsmål om norrøn mytologi, vikingskip, kultur og de legendariske Salme-krigerne. Svar klokt, samle hellige gjenstander, og fortjen din plass i Valhall!\n\nReisen din begynner på Mjølner-øya, hvor du må fortjene skipet ditt ved å mestre gudenes spørsmål. Først da kan du seile til de andre øyene.\n\nSkål! Måtte Odin lede din vei!",
      beginJourney: "Begynn reisen"
    },

    // Tutorial Modal
    tutorial: {
      title: "Hvordan spille",
      welcome: "Velkommen, vikingkriger!",
      objectives: "Dine mål",
      objective1: "Utforsk hver øy ved å flytte vikingkarakteren din",
      objective2: "Svar riktig på spørsmål for å komme videre (70% for å bestå)",
      objective3: "Samle hellige gjenstander til bruk som livliner",
      objective4: "Fullfør alle fire øyene for å vinne spillet",
      movement: "Bevegelse",
      movementDesc: "Bruk piltaster eller WASD for å flytte vikingen din",
      questions: "Spørsmål",
      questionsDesc: "Gå inn i spørsmålsmarkører (?) for å utløse quizutfordringer",
      artifacts: "Gjenstander",
      artifactsDesc: "Samle sverd, skjold, kniv, terninger og spillbrikker for å hjelpe deg",
      lifelines: "Bruke livliner",
      lifeline1: "50/50: Fjern to feil svar",
      lifeline2: "Hopp over: Hopp over gjeldende spørsmål",
      scoring: "Poengsum",
      scoringDesc: "Få 70% eller mer riktig for å låse opp neste øy. Hvis du mislykkes, prøver du de feil spørsmålene igjen.",
      tips: "Tips",
      tip1: "Utforsk grundig - gjenstander er skjult over hele øya",
      tip2: "Bruk livliner klokt - de er begrenset!",
      tip3: "Les spørsmål nøye før du svarer",
      ready: "Jeg er klar!",
      close: "Lukk"
    },

    // Quiz Screen
    quiz: {
      question: "Spørsmål",
      of: "av",
      inventory: "Inventar",
      fiftyFifty: "50/50",
      fiftyFiftyDesc: "Fjern 2 feil svar",
      skip: "Hopp over",
      skipDesc: "Hopp over dette spørsmålet",
      answer: "Svar",
      skipSuccess: "Spørsmål hoppet over! Gå videre til neste.",
      skipFail: "Ingen gjenstander tilgjengelig for å hoppe over!"
    },

    // Retry Modal
    retry: {
      title: "Nesten der!",
      subtitle: "Du trenger 70% for å bestå. Prøv disse spørsmålene igjen:",
      retryQuestions: "Prøv igjen",
      submitAnswers: "Send inn svar",
      question: "Spørsmål"
    },

    // Sailing Transition
    sailing: {
      title: "Seiler...",
      subtitle: "Navigerer til neste øy"
    },

    // End Screen
    end: {
      victoryTitle: "Strålende seier!",
      victorySubtitle: "Du har erobret alle øyene!",
      victoryMessage: "Din kunnskap om vikingarv er legendarisk! Du har bevist deg verdig Valhall. Skaldene vil synge sanger om dine triumfer i generasjoner!",
      defeatTitle: "Reisens slutt",
      defeatSubtitle: "Oppdraget var for utfordrende",
      defeatMessage: "Frykt ikke, modig kriger! Selv de mektigste vikingene møtte motgang. Studer de gamle fortellingene, slipe kunnskapen din, og kom tilbake sterkere!",
      islandsCompleted: "Øyer fullført",
      playAgain: "Spill igjen"
    },

    // Progress Bar
    progress: {
      yourProgress: "Din fremgang"
    },

    // Islands
    islands: {
      mjolnirIsle: "Mjølner-øya",
      dragonshipBay: "Drakeskip-bukta",
      runeRock: "Runeklippen",
      salmeIsland: "Salme-øya"
    },

    // Artifacts
    artifacts: {
      sword: "Valkyriesverd",
      swordDesc: "Skjærer gjennom feil svar (50/50)",
      shield: "Odins skjold",
      shieldDesc: "Beskytter mot ett feil svar",
      knife: "Runekniv",
      knifeDesc: "Avslører skjulte hint",
      dice: "Skjebne-terning",
      diceDesc: "Hopp over et vanskelig spørsmål",
      gamingPiece: "Gammel spillbrikke",
      gamingPieceDesc: "Taktisk fordel i quiz"
    },

    // Questions - Island 1: Mjölnir Isle
    mjolnirQuestions: [
      {
        question: "Hvem er Thors far i norrøn mytologi?",
        answers: ["Odin", "Loki", "Freyr", "Balder"],
        correct: 0
      },
      {
        question: "Hva heter Thors hammer?",
        answers: ["Gungnir", "Mjølner", "Gram", "Tyrfing"],
        correct: 1
      },
      {
        question: "Hvilket tre forbinder de ni verdener i norrøn kosmologi?",
        answers: ["Tidsaldersek", "Yggdrasil", "Verdensfuru", "Kosmisk Ask"],
        correct: 1
      },
      {
        question: "Hvem er lureguden i norrøn mytologi?",
        answers: ["Heimdall", "Tyr", "Loki", "Freyr"],
        correct: 2
      },
      {
        question: "Hva er Valhall?",
        answers: ["En hellig skog", "Hallen for falne krigere", "Et fjell", "Et hellig skip"],
        correct: 1
      },
      {
        question: "Hvem vokter Bifrostbroen?",
        answers: ["Odin", "Thor", "Heimdall", "Frøya"],
        correct: 2
      },
      {
        question: "Hva er valkyriene?",
        answers: ["Kvinnelige krigere som velger de falne", "Sjøuhyrer", "Gigantiske ravner", "Magiske ulver"],
        correct: 0
      },
      {
        question: "Hva vil føre til Ragnarok?",
        answers: ["Brudd av lenker", "Fimbulvinter", "Odins død", "Alle de ovennevnte"],
        correct: 3
      },
      {
        question: "Hvem er gudinnen for kjærlighet og skjønnhet?",
        answers: ["Frøya", "Frigg", "Sif", "Idunn"],
        correct: 0
      },
      {
        question: "Hvilke skapninger trekker Thors vogn?",
        answers: ["Ulver", "Ørner", "Geiter", "Hester"],
        correct: 2
      }
    ],

    // Questions - Island 2: Dragonship Bay
    dragonshipQuestions: [
      {
        question: "Hva var den mest kjente typen vikingskip?",
        answers: ["Knarr", "Langskip", "Karve", "Faering"],
        correct: 1
      },
      {
        question: "Hvordan navigerte vikingene til havs?",
        answers: ["Kompass", "Solsteiner og stjerner", "Bare kart", "Ved å følge fugler"],
        correct: 1
      },
      {
        question: "Hva var et vikingskips dragehode til?",
        answers: ["Navigering", "Skremsels og beskyttelse", "Bare dekorasjon", "Værprediksjon"],
        correct: 1
      },
      {
        question: "Hvilket tre ble vanligvis brukt til vikingskip?",
        answers: ["Furu", "Eik", "Både eik og furu", "Bjørk"],
        correct: 2
      },
      {
        question: "Hva er en knarr?",
        answers: ["Et krigsskip", "Et kjøpmannsskip", "En robåt", "En fiskebåt"],
        correct: 1
      },
      {
        question: "Hvor mange årer hadde et typisk langskip?",
        answers: ["10-20", "20-40", "40-60", "60-80"],
        correct: 1
      },
      {
        question: "Hva var vikingskipets seil vanligvis laget av?",
        answers: ["Silke", "Bomull", "Ull", "Lin"],
        correct: 2
      },
      {
        question: "Hvilket fjerntliggende land nådde vikingene rundt år 1000?",
        answers: ["Australia", "Nord-Amerika", "Antarktis", "Japan"],
        correct: 1
      },
      {
        question: "Hva er klinkebygging?",
        answers: ["En type seil", "Overlappende planker-metode", "En navigasjonsteknikk", "En type anker"],
        correct: 1
      },
      {
        question: "Hva var gjennomsnittslengden på et vikingskip?",
        answers: ["10-15 meter", "20-30 meter", "40-50 meter", "60-70 meter"],
        correct: 1
      }
    ],

    // Questions - Island 3: Rune Rock
    runeRockQuestions: [
      {
        question: "Hvilket alfabet brukte vikingene?",
        answers: ["Latin", "Runer (Futhark)", "Kyrillisk", "Gresk"],
        correct: 1
      },
      {
        question: "Hva var en vikings primære våpen?",
        answers: ["Sverd", "Øks", "Spyd", "Bue"],
        correct: 2
      },
      {
        question: "Vikingene kom fra hvilke regioner?",
        answers: ["Skandinavia", "Tyskland", "Storbritannia", "Russland"],
        correct: 0
      },
      {
        question: "Hva var et 'Thing' i vikingsamfunnet?",
        answers: ["Et våpen", "En forsamling eller råd", "Et skip", "Et festmåltid"],
        correct: 1
      },
      {
        question: "Vikingtiden er generelt datert som:",
        answers: ["500-800 e.Kr.", "793-1066 e.Kr.", "1000-1200 e.Kr.", "600-900 e.Kr."],
        correct: 1
      },
      {
        question: "Hva var en berserk?",
        answers: ["En type skip", "En vill kriger", "En kjøpmann", "En håndverker"],
        correct: 1
      },
      {
        question: "Vikingene var også kjent som:",
        answers: ["Nordmenn", "Kelter", "Sakser", "Pikter"],
        correct: 0
      },
      {
        question: "Hvilken hendelse markerer starten av vikingtiden?",
        answers: ["Slaget ved Hastings", "Raid på Lindisfarne", "Oppdagelsen av Island", "Grunnleggelsen av Dublin"],
        correct: 1
      },
      {
        question: "Vikingkrigere søkte å dø i kamp for å nå:",
        answers: ["Hel", "Valhall", "Niflheim", "Midgard"],
        correct: 1
      },
      {
        question: "Hva var skalder?",
        answers: ["Krigere", "Poeter og historiefortellere", "Smeder", "Bønder"],
        correct: 1
      }
    ],

    // Questions - Island 4: Salme Island
    salmeQuestions: [
      {
        question: "Hvor ligger Salme?",
        answers: ["Norge", "Sverige", "Saaremaa, Estland", "Island"],
        correct: 2
      },
      {
        question: "Hva ble oppdaget i Salme i 2008?",
        answers: ["Vikingskatt", "Vikingskipgraver", "En vikingbosetning", "Runesteiner"],
        correct: 1
      },
      {
        question: "Hvor mange menn ble begravet i Salme-skipene?",
        answers: ["Omtrent 10", "Omtrent 20", "Over 40", "Over 100"],
        correct: 2
      },
      {
        question: "Salme-skipene dateres til omtrent:",
        answers: ["600 e.Kr.", "750 e.Kr.", "900 e.Kr.", "1000 e.Kr."],
        correct: 1
      },
      {
        question: "Salme-krigerne kom sannsynligvis fra:",
        answers: ["Norge", "Sverige", "Danmark", "Finland"],
        correct: 1
      },
      {
        question: "Hva gjør Salme-funnet unikt?",
        answers: ["Eldste vikingskip", "Eneste skipgrav i Estland", "Best bevarte skip", "Største vikingskatt"],
        correct: 1
      },
      {
        question: "Saaremaa er den største øya i:",
        answers: ["Norge", "Sverige", "Estland", "Latvia"],
        correct: 2
      },
      {
        question: "Salme-krigerne var sannsynligvis på:",
        answers: ["Handelsoppdrag", "Raid eller militærtokt", "Fredelig bosetting", "Religiøs pilegrimsreise"],
        correct: 1
      },
      {
        question: "Hva skjedde med Salme-krigerne?",
        answers: ["De bosatte seg fredelig", "De døde i kamp", "De returnerte hjem", "De grunnla en landsby"],
        correct: 1
      },
      {
        question: "Hva inkluderte Salme-funnet?",
        answers: ["Gullmynter", "Spillbrikker og våpen", "Manuskripter", "Bare smykker"],
        correct: 1
      }
    ]
  },

  sv: {
    // Main Menu
    mainMenu: {
      title: "Vikingaäventyret",
      subtitle: "Resa genom myt och historia",
      play: "Spela",
      guide: "Guide",
      settings: "Inställningar"
    },

    // Login Modal
    login: {
      title: "Välj din väg",
      subtitle: "Välj hur du vill påbörja din vikingafarande",
      singleplayer: "Ensam spelare",
      singleplayerDesc: "Solo äventyr genom öarna",
      school: "Skolläge",
      schoolDesc: "Gå med din klass på detta uppdrag",
      enterName: "Ange ditt namn",
      enterCode: "Ange klasskod",
      cancel: "Avbryt",
      start: "Starta äventyr"
    },

    // Settings Modal
    settings: {
      title: "Inställningar",
      subtitle: "Anpassa din vikingaupplevelse",
      audio: "Ljud",
      soundEffects: "Ljudeffekter",
      soundEffectsDesc: "Stridsljud och interaktioner",
      soundVolume: "Ljudvolym",
      backgroundMusic: "Bakgrundsmusik",
      backgroundMusicDesc: "Vikingatema musik",
      musicVolume: "Musikvolym",
      display: "Skärm",
      fullscreenMode: "Helskärmsläge",
      fullscreenDesc: "Uppslukande spelupplevelse",
      colorTheme: "Färgtema",
      default: "Standard",
      dark: "Mörk",
      light: "Ljus",
      animations: "Animationer",
      animationsDesc: "Visuella effekter och övergångar",
      languageAccessibility: "Språk och tillgänglighet",
      language: "Språk",
      textSize: "Textstorlek",
      small: "Liten",
      medium: "Medium",
      large: "Stor",
      saveClose: "Spara och stäng",
      reset: "Återställ",
      savedLocally: "Inställningar sparas lokalt på denna enhet",
      returnToMenu: "Återgå till huvudmenyn",
      confirmReturnToMenu: "Är du säker på att du vill återgå till huvudmenyn? Din nuvarande framsteg kommer att förloras."
    },

    // Start Screen
    start: {
      title: "Vikingens resa",
      story: "För länge sedan seglade modiga vikingar över förrädiska hav, sökande ära, kunskap och nya länder. Du är en ung viking som måste bevisa dig själv genom att besvara utmaningarna på fyra mystiska öar.\n\nVarje ö rymmer gamla frågor om nordisk mytologi, vikingaskepp, kultur och de legendariska Salme-krigarna. Svara klokt, samla heliga föremål och förtjäna din plats i Valhall!\n\nDin resa börjar på Mjölners ö, där du måste förtjäna ditt skepp genom att bemästra gudarnas frågor. Först då kan du segla till de andra öarna.\n\nSkål! Må Oden leda din väg!",
      beginJourney: "Påbörja resan"
    },

    // Tutorial Modal
    tutorial: {
      title: "Hur man spelar",
      welcome: "Välkommen, vikingakrigare!",
      objectives: "Dina mål",
      objective1: "Utforska varje ö genom att flytta din vikingakaraktär",
      objective2: "Svara rätt på frågor för att komma vidare (70% för att klara)",
      objective3: "Samla heliga föremål att använda som livlinor",
      objective4: "Slutför alla fyra öar för att vinna spelet",
      movement: "Rörelse",
      movementDesc: "Använd piltangenter eller WASD för att flytta din viking",
      questions: "Frågor",
      questionsDesc: "Gå in i frågemarkörerna (?) för att utlösa frågesportutmaningar",
      artifacts: "Föremål",
      artifactsDesc: "Samla svärd, sköld, kniv, tärningar och spelpjäser för att hjälpa dig",
      lifelines: "Använda livlinor",
      lifeline1: "50/50: Ta bort två fel svar",
      lifeline2: "Hoppa över: Hoppa över nuvarande fråga",
      scoring: "Poäng",
      scoringDesc: "Få 70% eller mer rätt för att låsa upp nästa ö. Om du misslyckas kommer du att försöka igen med fel frågor.",
      tips: "Tips",
      tip1: "Utforska noggrant - föremål är gömda över hela ön",
      tip2: "Använd livlinor klokt - de är begränsade!",
      tip3: "Läs frågor noggrant innan du svarar",
      ready: "Jag är redo!",
      close: "Stäng"
    },

    // Quiz Screen
    quiz: {
      question: "Fråga",
      of: "av",
      inventory: "Inventarie",
      fiftyFifty: "50/50",
      fiftyFiftyDesc: "Ta bort 2 fel svar",
      skip: "Hoppa över",
      skipDesc: "Hoppa över denna fråga",
      answer: "Svara",
      skipSuccess: "Fråga överhoppad! Gå vidare till nästa.",
      skipFail: "Inga föremål tillgängliga för att hoppa över!"
    },

    // Retry Modal
    retry: {
      title: "Nästan där!",
      subtitle: "Du behöver 70% för att klara. Försök dessa frågor igen:",
      retryQuestions: "Försök igen",
      submitAnswers: "Skicka in svar",
      question: "Fråga"
    },

    // Sailing Transition
    sailing: {
      title: "Segling...",
      subtitle: "Navigerar till nästa ö"
    },

    // End Screen
    end: {
      victoryTitle: "Härlig seger!",
      victorySubtitle: "Du har erövrat alla öar!",
      victoryMessage: "Din kunskap om vikingaarv är legendarisk! Du har bevisat dig värdig Valhall. Skalderna kommer att sjunga sånger om dina triumfer i generationer!",
      defeatTitle: "Resans slut",
      defeatSubtitle: "Uppdraget var för utmanande",
      defeatMessage: "Frukta inte, modig krigare! Även de mäktigaste vikingarna mötte motgångar. Studera de gamla berättelserna, vässa din kunskap och återvänd starkare!",
      islandsCompleted: "Öar slutförda",
      playAgain: "Spela igen"
    },

    // Progress Bar
    progress: {
      yourProgress: "Din framsteg"
    },

    // Islands
    islands: {
      mjolnirIsle: "Mjölners ö",
      dragonshipBay: "Drakskeppsviken",
      runeRock: "Runklippan",
      salmeIsland: "Salme-ön"
    },

    // Artifacts
    artifacts: {
      sword: "Valkyriesvärd",
      swordDesc: "Skär igenom fel svar (50/50)",
      shield: "Odens sköld",
      shieldDesc: "Skyddar mot ett fel svar",
      knife: "Runkniv",
      knifeDesc: "Avslöjar dolda ledtrådar",
      dice: "Ödetstärning",
      diceDesc: "Hoppa över en svår fråga",
      gamingPiece: "Gammal spelpjäs",
      gamingPieceDesc: "Taktisk fördel i frågesport"
    }
  },

  da: {
    // Main Menu
    mainMenu: {
      title: "Vikingeeventyret",
      subtitle: "Rejse gennem myte og historie",
      play: "Spil",
      guide: "Guide",
      settings: "Indstillinger"
    },

    // Login Modal
    login: {
      title: "Vælg din vej",
      subtitle: "Vælg hvordan du vil begynde din vikingereise",
      singleplayer: "Enkeltspiller",
      singleplayerDesc: "Solo eventyr gennem øerne",
      school: "Skoletilstand",
      schoolDesc: "Deltag i din klasses opdrag",
      enterName: "Indtast dit navn",
      enterCode: "Indtast klassekode",
      cancel: "Annuller",
      start: "Start eventyr"
    },

    // Settings Modal
    settings: {
      title: "Indstillinger",
      subtitle: "Tilpas din vikingeoplevelse",
      audio: "Lyd",
      soundEffects: "Lydeffekter",
      soundEffectsDesc: "Kampens lyde og interaktioner",
      soundVolume: "Lydstyrke",
      backgroundMusic: "Baggrundsmusik",
      backgroundMusicDesc: "Vikingetema musik",
      musicVolume: "Musikstyrke",
      display: "Skærm",
      fullscreenMode: "Fuldskærmstilstand",
      fullscreenDesc: "Fordybende spiloplevelse",
      colorTheme: "Farvetema",
      default: "Standard",
      dark: "Mørk",
      light: "Lys",
      animations: "Animationer",
      animationsDesc: "Visuelle effekter og overgange",
      languageAccessibility: "Sprog og tilgængelighed",
      language: "Sprog",
      textSize: "Tekststørrelse",
      small: "Lille",
      medium: "Medium",
      large: "Stor",
      saveClose: "Gem og luk",
      reset: "Nulstil",
      savedLocally: "Indstillinger gemmes lokalt på denne enhed",
      returnToMenu: "Gå tilbage til hovedmenuen",
      confirmReturnToMenu: "Er du sikker på, at du vil gå tilbage til hovedmenuen? Din nuværende fremgang vil gå tabt."
    },

    // Start Screen
    start: {
      title: "Vikingens rejse",
      story: "For længe siden sejlede modige vikinger over forræderiske have, søgende ære, viden og nye lande. Du er en ung viking, der skal bevise dig selv ved at besvare udfordringerne på fire mystiske øer.\n\nHver ø rummer gamle spørgsmål om nordisk mytologi, vikingeskibe, kultur og de legendariske Salme-krigere. Svar klogt, indsaml hellige genstande og fortjen din plads i Valhalla!\n\nDin rejse begynder på Mjølners ø, hvor du skal fortjene dit skib ved at mestre gudernes spørgsmål. Først da kan du sejle til de andre øer.\n\nSkål! Må Odin lede din vej!",
      beginJourney: "Begynd rejsen"
    },

    // Tutorial Modal
    tutorial: {
      title: "Sådan spiller du",
      welcome: "Velkommen, vikingekrigere!",
      objectives: "Dine mål",
      objective1: "Udforsk hver ø ved at flytte din vikingekarakter",
      objective2: "Svar rigtigt på spørgsmål for at komme videre (70% for at bestå)",
      objective3: "Indsaml hellige genstande til brug som livliner",
      objective4: "Fuldfør alle fire øer for at vinde spillet",
      movement: "Bevægelse",
      movementDesc: "Brug piletaster eller WASD til at flytte din viking",
      questions: "Spørgsmål",
      questionsDesc: "Gå ind i spørgsmålsmarkører (?) for at udløse quizudfordringer",
      artifacts: "Genstande",
      artifactsDesc: "Indsaml sværd, skjold, kniv, terninger og spilbrikker for at hjælpe dig",
      lifelines: "Brug af livliner",
      lifeline1: "50/50: Fjern to forkerte svar",
      lifeline2: "Spring over: Spring det nuværende spørgsmål over",
      scoring: "Scoring",
      scoringDesc: "Få 70% eller mere rigtigt for at låse op for næste ø. Hvis du fejler, vil du prøve de forkerte spørgsmål igen.",
      tips: "Tips",
      tip1: "Udforsk grundigt - genstande er skjult over hele øen",
      tip2: "Brug livliner klogt - de er begrænsede!",
      tip3: "Læs spørgsmål omhyggeligt før du svarer",
      ready: "Jeg er klar!",
      close: "Luk"
    },

    // Quiz Screen
    quiz: {
      question: "Spørgsmål",
      of: "af",
      inventory: "Inventar",
      fiftyFifty: "50/50",
      fiftyFiftyDesc: "Fjern 2 forkerte svar",
      skip: "Spring over",
      skipDesc: "Spring dette spørgsmål over",
      answer: "Svar",
      skipSuccess: "Spørgsmål sprunget over! Gå videre til næste.",
      skipFail: "Ingen genstande tilgængelige til at springe over!"
    },

    // Retry Modal
    retry: {
      title: "Næsten der!",
      subtitle: "Du skal bruge 70% for at bestå. Prøv disse spørgsmål igen:",
      retryQuestions: "Prøv igen",
      submitAnswers: "Indsend svar",
      question: "Spørgsmål"
    },

    // Sailing Transition
    sailing: {
      title: "Sejler...",
      subtitle: "Navigerer til næste ø"
    },

    // End Screen
    end: {
      victoryTitle: "Strålende sejr!",
      victorySubtitle: "Du har erobret alle øerne!",
      victoryMessage: "Din viden om vikingearv er legendarisk! Du har bevist dig værdig til Valhalla. Skalderne vil synge sange om dine triumfer i generationer!",
      defeatTitle: "Rejsens slutning",
      defeatSubtitle: "Opgaven var for udfordrende",
      defeatMessage: "Frygt ikke, modig kriger! Selv de mægtigste vikinger mødte modgang. Studer de gamle fortællinger, skærp din viden og vend tilbage stærkere!",
      islandsCompleted: "Øer fuldført",
      playAgain: "Spil igen"
    },

    // Progress Bar
    progress: {
      yourProgress: "Din fremgang"
    },

    // Islands
    islands: {
      mjolnirIsle: "Mjølners ø",
      dragonshipBay: "Drakeskibsbugten",
      runeRock: "Runeklippen",
      salmeIsland: "Salme-øen"
    },

    // Artifacts
    artifacts: {
      sword: "Valkyriesværd",
      swordDesc: "Skærer gennem forkerte svar (50/50)",
      shield: "Odins skjold",
      shieldDesc: "Beskytter mod ét forkert svar",
      knife: "Runekniv",
      knifeDesc: "Afslører skjulte spor",
      dice: "Skæbneterning",
      diceDesc: "Spring et svært spørgsmål over",
      gamingPiece: "Gammel spilbrik",
      gamingPieceDesc: "Taktisk fordel i quiz"
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.en;
