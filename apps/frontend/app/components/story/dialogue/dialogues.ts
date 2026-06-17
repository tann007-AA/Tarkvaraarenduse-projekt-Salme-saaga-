export type Speaker = 'Gunnar' | 'Ivar' | 'Haldor' | 'Björn' | 'Sigrid' | 'Ormar' | 'Knut' | 'Narrator';

export interface DialogueLine {
  speaker: Speaker;
  text: string;
}

export interface DialogueChoice {
  label: string;
  nextId: string;
}

export interface DialogueScene {
  id: string;
  lines: DialogueLine[];
  choices?: DialogueChoice[];
  nextId?: string; // automaatne jätk ilma valikuta
}

// ─────────────────────────────────────────────
// ETAPP 1 — Pikkmaja: Suur teadaanne ja edasi
// ─────────────────────────────────────────────

export const dialogues: Record<string, DialogueScene> = {

  
  'e1_suur_teadaanne': {
    id: 'e1_suur_teadaanne',
    lines: [
      { speaker: 'Gunnar', text: 'Sööge kõhud täis. Björn... seekord lükkad sa laeva vette koos meiega. Sa oled meeskonnas.' },
      { speaker: 'Björn', text: 'Lõpuks ometi! Ma juba kartsin, et pean jälle Sigridiga võid kloppima!' },
      { speaker: 'Haldor', text: 'Ära kirtsuta nina, Björn. See võiklopsimine on su käevarred sitkeks teinud.' },
    ],
    nextId: 'e1_ivari_monoloog',
  },

  
  'e1_ivari_monoloog': {
    id: 'e1_ivari_monoloog',
    lines: [
      { speaker: 'Ivar', text: 'Tõeline viiking on peremees, kes teab, millal põldu künda. Ta on strateeg, kes teab, millal rünnata ja millal taanduda. Ja ta on mees, kes on igal hetkel valmis astuma Valhalla väravatest sisse.' },
    ],
    nextId: 'e1_sigrid_sisse',
  },

  
  'e1_sigrid_sisse': {
    id: 'e1_sigrid_sisse',
    lines: [
      { speaker: 'Sigrid', text: 'Nii et mehed lähevad jälle merele au taga ajama? Aga kes siis Björnile selgeks teeb, et ilma meieta poleks teil kuskile tagasi tulla?' },
    ],
    choices: [
      { label: 'Lugupidav vastus', nextId: 'e1_bjorn_lugupidav' },
      { label: 'Ülbe vastus', nextId: 'e1_bjorn_ulbe' },
    ],
  },

  
  'e1_bjorn_lugupidav': {
    id: 'e1_bjorn_lugupidav',
    lines: [
      { speaker: 'Narrator', text: 'Sigrid noogutab heakskiitvalt.' },
    ],
    nextId: 'e2_tuli_madalaks',
  },

  
  'e1_bjorn_ulbe': {
    id: 'e1_bjorn_ulbe',
    lines: [
      { speaker: 'Sigrid', text: 'Siis võid sa harjutada põranda nühkimist, enne kui minu pikkmajast jalga lased.' },
    ],
    nextId: 'e2_tuli_madalaks',
  },

  // ─────────────────────────────────────────────
  // ETAPP 2 — Saatus, Valhalla ja Hnefatafl
  // ─────────────────────────────────────────────

  'e2_tuli_madalaks': {
    id: 'e2_tuli_madalaks',
    lines: [
      { speaker: 'Narrator', text: 'Tuli kolde keskel on madalaks jäänud. Vennad istuvad Björni ümber. Pikkmaja hämardub.' },
    ],
    nextId: 'e2_hnefatafl_algus',
  },

  
  'e2_hnefatafl_algus': {
    id: 'e2_hnefatafl_algus',
    lines: [
      { speaker: 'Ivar', text: 'Hnefatafl on nagu meie tulevane retk. Keskel on kuningas — see oleme meie, oma laevaga. Ümberringi on vaenlased, keda on alati rohkem.' },
    ],
    nextId: 'e2_hnefatafl_mangimise_ajal',
  },

  
  'e2_hnefatafl_riskantne': {
    id: 'e2_hnefatafl_riskantne',
    lines: [
      { speaker: 'Haldor', text: 'Kas sa tõesti arvad, et ründaja on pime? See käik on nagu purjeta tormi minemine.' },
    ],
  },

  'e2_hnefatafl_ettevaatlik': {
    id: 'e2_hnefatafl_ettevaatlik',
    lines: [
      { speaker: 'Ivar', text: 'Sa värised nagu haavaleht sügistuules. Saarlased piiravad su sisse enne, kui sa kilbi tõsta jõuad.' },
    ],
  },

  'e2_hnefatafl_otsustav': {
    id: 'e2_hnefatafl_otsustav',
    lines: [
      { speaker: 'Ivar', text: 'Kas see on Sinu otsus, Björn? Mitte minu, mitte Gunnari, vaid Sinu oma?' },
    ],
  },

  
  'e2_hnefatafl_mangimise_ajal': {
    id: 'e2_hnefatafl_mangimise_ajal',
    lines: [
      { speaker: 'Narrator', text: 'Mängija kogeb mõlema poole perspektiivi: valged (kuningas) ja mustad (ründajad).' },
    ],
    choices: [
      { label: 'Proovin uuesti', nextId: 'e2_hnefatafl_uuesti' },
      { label: 'Selleks korraks piisab', nextId: 'e2_ulemin_rannikule' },
      { label: 'Mida Gunnar arvab?', nextId: 'e2_gunnari_selgitus' },
    ],
  },

  'e2_hnefatafl_uuesti': {
    id: 'e2_hnefatafl_uuesti',
    lines: [
      { speaker: 'Narrator', text: 'Laud lähtestatakse.' },
    ],
    nextId: 'e2_hnefatafl_mangimise_ajal',
  },

  'e2_gunnari_selgitus': {
    id: 'e2_gunnari_selgitus',
    lines: [
      { speaker: 'Gunnar', text: 'Hnefatafl õpetab, et iga käik loeb. Meri on sama halastamatu kui see laud.' },
    ],
    nextId: 'e2_ulemin_rannikule',
  },

  
  'e2_ulemin_rannikule': {
    id: 'e2_ulemin_rannikule',
    lines: [
      { speaker: 'Narrator', text: 'Kaamera tõuseb aeglaselt pikkmaja katuselt kõrgemale. Suitsusammas jääb seljataha, puude vahelt ilmub vaade hallikassinisele Läänemerele.' },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPP 3 — Sveamaa rannik: laev ja Ormar
  // ─────────────────────────────────────────────

  // Pealik Ormar saabub
  'e3_ormar_saabub': {
    id: 'e3_ormar_saabub',
    lines: [
      { speaker: 'Ormar', text: 'Esimene retk on nagu esimene kord külma vette hüpata — hinge tõmbab kinni, aga pärast tunned, et oled elus. Ole nagu Garm — vali ja ustav.' },
    ],
    nextId: 'e3_ormar_taringud',
  },

  'e3_ormar_taringud': {
    id: 'e3_ormar_taringud',
    lines: [
      { speaker: 'Ormar', text: 'Kui meri muutub igavaks, siis veereta neid. Need toovad meelde, et elu on mäng õnne ja tarkusega.' },
      { speaker: 'Narrator', text: 'Ormar kingib Björnile vaalaluust täringud. (Saadud: vaalaluust täringud 🎲)' },
    ],
    nextId: 'e3_ulemin_merele',
  },

  
  'e3_ulemin_merele': {
    id: 'e3_ulemin_merele',
    lines: [
      { speaker: 'Ormar', text: 'LÜKKAME! Meie saatus ootab lainete taga!' },
      { speaker: 'Narrator', text: 'Puidu krigin, laev vette.' },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPP 4 — Avameri ja Saaremaa
  // ─────────────────────────────────────────────

  
  'e4_avameri': {
    id: 'e4_avameri',
    lines: [
      { speaker: 'Ivar', text: 'Meri on rahutu, aga tuul on meie poolel.' },
      { speaker: 'Haldor', text: 'Björn, sa ei värise enam. Hea märk.' },
    ],
    nextId: 'e4_maabumine',
  },

  
  'e4_maabumine': {
    id: 'e4_maabumine',
    lines: [
      { speaker: 'Narrator', text: 'Kauguses ilmub Saaremaa (Eysysla) madal rand. Laev rullitakse liivale.' },
    ],
    choices: [
      { label: 'Kaitstud metsaserv', nextId: 'e4_laager_mets' },
      { label: 'Avatud rand', nextId: 'e4_laager_rand' },
    ],
  },

  'e4_laager_mets': {
    id: 'e4_laager_mets',
    lines: [
      { speaker: 'Narrator', text: 'Metsaserv annab parema kaitse, aga halvema ülevaate merest.' },
    ],
    nextId: 'e4_vaskkatel',
  },

  'e4_laager_rand': {
    id: 'e4_laager_rand',
    lines: [
      { speaker: 'Narrator', text: 'Avatud rand annab parema ülevaate, aga olete tuulele ja vaenlase silmadele avatumad.' },
    ],
    nextId: 'e4_vaskkatel',
  },

  
  'e4_vaskkatel': {
    id: 'e4_vaskkatel',
    lines: [
      { speaker: 'Narrator', text: 'Björn süütab lõkke, kasutab Sigridi vaskkatelt. Esimene eine võõral maal tõstab meeskonna moraali.' },
    ],
    nextId: 'e4_kuld_voi_veri',
  },

  
  'e4_kuld_voi_veri': {
    id: 'e4_kuld_voi_veri',
    lines: [
      { speaker: 'Ormar', text: 'Sina oled noor ja su käed ei ole veel verised. Kas läheme nendega vahetuskaupa tegema või näitame neile Sveamaa rauda?' },
    ],
    choices: [
      { label: 'Diplomaatia', nextId: 'e4_diplomaatia' },
      { label: 'Rüüste', nextId: 'e4_ruuste' },
    ],
  },

  'e4_diplomaatia': {
    id: 'e4_diplomaatia',
    lines: [
      { speaker: 'Ivar', text: 'Ma lootsin, et mu kirves saab täna tööd.' },
      { speaker: 'Gunnar', text: 'Tark poiss. Täna saame nahku ja sõpru.' },
    ],
    nextId: 'e4_laagriloke',
  },

  'e4_ruuste': {
    id: 'e4_ruuste',
    lines: [
      { speaker: 'Ivar', text: 'Veri on punasem kui helmed! Aga vaata Haldorit — ta lonkab.' },
    ],
    nextId: 'e4_laagriloke',
  },

  
  'e4_laagriloke': {
    id: 'e4_laagriloke',
    lines: [
      { speaker: 'Gunnar', text: 'Vaata teda. Björn ei värise enam. Ta on näinud avamerd, hoidnud rütmi Ivari trummi järgi ja seisnud võõra rahva ees. See ongi esimene retk — see pole kulla, vaid mehe kasvatamise retk.' },
      { speaker: 'Ivar', text: 'Saak võib hallitada, aga see, kuidas sa laeva juhtisid, jääb sulle külge nagu tõrv puidule. Sa oled nüüd päriselt üks meist.' },
    ],
    nextId: 'e4_knut',
  },

  
  'e4_knut': {
    id: 'e4_knut',
    lines: [
      { speaker: 'Knut', text: 'Ormar lubas meile randa, kus veri voolab ja kuld särab. Selle asemel saime märjad jalad, hallitanud kala ja peotäie klaashelmeid.' },
      { speaker: 'Haldor', text: 'Vaata neid, Björn. On kerge neid vihata, aga püüa mõista — nad on väsinud. Pettumus on mürk, mis muudab ka kõige tugevama mehe meeled kibedaks.' },
      { speaker: 'Ivar', text: 'Empaatia on ilus asi, Haldor, aga see ei peata oda. Pettunud mees on nagu haavatud karu. Vaata nende käsi — nad ei hoia supilusikat, vaid mõõgapidet.' },
      { speaker: 'Gunnar', text: 'Mõlemal on õigus. Pead mõistma nende valu, et teada, mis neid juhib — aga jälgima nende liigutusi, et ellu jääda.' },
    ],
    nextId: 'e4_valvekord',
  },

  
  'e4_valvekord': {
    id: 'e4_valvekord',
    lines: [
      { speaker: 'Gunnar', text: 'Jagame öö neljaks. Haldor esimene, Ivar teine, mina kolmas.' },
      { speaker: 'Haldor', text: 'Ja noorim?' },
      { speaker: 'Gunnar', text: 'Björn võtab viimase vahetuse, enne koidikut. See on aeg, mil uni on kõige rängem ja ründaja kõige julgem. Björn, kui sa märkad kas või kivi liikumist — sa karjud nii, et Odin ise Valhallas üles ärkab.' },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPP 5 — Reetmine ja laevmatus
  // ─────────────────────────────────────────────

  
  'e5_valvekord': {
    id: 'e5_valvekord',
    lines: [
      { speaker: 'Narrator', text: 'Udu on paks, kaste märg. Björn istub üksinda kustuva lõkke ääres, kirves põlvedel. Järsku märkab ta liikumist — Knuti salk liigub varjudes Ormari telgi poole.' },
      { speaker: 'Björn', text: 'HÄIRE! REETMINE! MEHED, RELVADELE!' },
    ],
    nextId: 'e5_ormari_surm',
  },

  
  'e5_ormari_surm': {
    id: 'e5_ormari_surm',
    lines: [
      { speaker: 'Narrator', text: 'Knut sööstab otse Björni poole. Pealik Ormar astub vahele, tõrjub Knuti — aga saab teise mässulise oda läbi rüüst. Ormar langetab Knuti viimase löögiga, ent vajub ise liivale.' },
    ],
    nextId: 'e5_lahingujargne',
  },

  
  'e5_lahingujargne': {
    id: 'e5_lahingujargne',
    lines: [
      { speaker: 'Gunnar', text: 'Haldor? Ivar? Björn? Kas kõik liikmed on terved?' },
      { speaker: 'Haldor', text: 'Olen terve. Björn, sul vedas — see särk on katki, aga nahk terve.' },
      { speaker: 'Ivar', text: 'Mina olen terve, aga vaadake sinna... Garm ei vaiki.' },
    ],
    nextId: 'e5_laevmatus_otsus',
  },

  
  'e5_laevmatus_otsus': {
    id: 'e5_laevmatus_otsus',
    lines: [
      { speaker: 'Gunnar', text: 'Ta on läinud. Pooled mehed on kas surnud või reetnud meid. Meid on liiga vähe.' },
      { speaker: 'Haldor', text: 'Meil pole piisavalt mehi, et mõlema laevaga tagasi seilata.' },
      { speaker: 'Ivar', text: 'Siis on otsus tehtud. Me matame nad siia, nende enda laeva. See on suurim au, mida põhjalane saada võib.' },
      { speaker: 'Björn', text: 'Me jätame "Lohetapja" maha?' },
      { speaker: 'Gunnar', text: 'Me anname "Lohetapja" talle kaasa. See laev kannab nad Valhallasse.' },
    ],
    nextId: 'e5_laevmatus_rituaal',
  },

  
  'e5_laevmatus_rituaal': {
    id: 'e5_laevmatus_rituaal',
    lines: [
      { speaker: 'Narrator', text: 'Ormar asetatakse laeva ahtrisse, kilp rinnale. Ivari mängunupud pannakse pealiku käte juurde. Garm pealiku jalgade juurde.' },
      { speaker: 'Narrator', text: 'Ajaloofakt: Salme laevmatuses leiti 42 sõdalast, kes olid maetud oma laeva. Pealikud leiti sageli laeva tagaosast, ümbritsetuna luksuslikest relvadest, mängunuppudest ja ohverdatud loomadest.' },
    ],
    nextId: 'e5_epiloog',
  },

  
  'e5_epiloog': {
    id: 'e5_epiloog',
    lines: [
      { speaker: 'Gunnar', text: 'Ta on nüüd Valhallas, Odini lauas. Meie aga peame koju minema. Meie saaga on alles alguses.' },
      { speaker: 'Narrator', text: 'Aastal 2008 leidsid arheoloogid Saaremaalt Salme külast kaks laeva. Ühes neist puhkasid 42 sõdalast, ümbritsetuna luksuslikest relvadest ja mängunuppudest. See leid räägib meile loost, mis juhtus 1250 aastat tagasi — loost julgusest, reetmisest ja austusest, mis ületab sajandeid.' },
    ],
  },
};


export const DIALOGUE_TRIGGERS = {
  
  afterCooking: 'e1_suur_teadaanne',

  
  hnefataflIntro: 'e2_tuli_madalaks',

  
  hnefataflRisky: 'e2_hnefatafl_riskantne',
  hnefataflCautious: 'e2_hnefatafl_ettevaatlik',
  hnefataflDecisive: 'e2_hnefatafl_otsustav',

  
  ormarArrival: 'e3_ormar_saabub',

  
  openSea: 'e4_avameri',

  
  nightWatch: 'e5_valvekord',
} as const;
