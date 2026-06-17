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

  'e1_hotspot_thread': {
    id: 'e1_hotspot_thread',
    lines: [
      { speaker: 'Sigrid', text: 'Ilma naiste käte ja kedveta poleks teil purjesid, mis teid kohale viiks, ega kuubesid, mis teid merel soojas hoiaks.' },
    ],
  },

  'e1_hotspot_keys': {
    id: 'e1_hotspot_keys',
    lines: [
      { speaker: 'Sigrid', text: 'Võtmed minu vööl tähendavad, et mina valitsen seda vara. Kui peremees on merel, on naise sõna siin majas seadus.' },
    ],
  },

  'e1_hotspot_salted': {
    id: 'e1_hotspot_salted',
    lines: [
      { speaker: 'Sigrid', text: 'Sool ja suits, Björn. Ilma toidutagavarata ei jõua te isegi poolele merele. Meie muudame suvise saagi talviseks ellujäämiseks.' },
    ],
  },

  'e1_hotspot_chest': {
    id: 'e1_hotspot_chest',
    lines: [
      { speaker: 'Sigrid', text: 'See pole lihtsalt sära. See on kaubandus. Viiking on pooleldi sõdalane, pooleldi kaupmees.' },
    ],
  },

  'e1_hotspot_fire': {
    id: 'e1_hotspot_fire',
    lines: [
      { speaker: 'Sigrid', text: 'Tuli on pikkmaja süda. Kui sa oled merel ligunenud ja külmunud, on see tuli ainus asi, mis su hinge kehas hoiab.' },
    ],
  },

  'e1_hotspot_trough': {
    id: 'e1_hotspot_trough',
    lines: [
      { speaker: 'Sigrid', text: 'Vili ja humal. Meie põllud toidavad meid, mitte meri. Retk algab põllult ja lõpeb põllul.' },
    ],
  },

  'e1_suur_teadaanne': {
    id: 'e1_suur_teadaanne',
    lines: [
      { speaker: 'Gunnar', text: 'Sööge kõhud täis. Björn... seekord lükkad sa laeva vette koos meiega. Sa oled meeskonnas.' },
      { speaker: 'Björn', text: 'Lõpuks ometi! Ma juba kartsin, et pean jälle Sigridiga võid kloppima!' },
      { speaker: 'Haldor', text: 'Ära kirtsuta nina, Björn. See võiklopsimine on su käevarred sitkeks teinud.' },
    ],
    nextId: 'e1_ivari_monoloog',
  },

  'e1_cooking_start': {
    id: 'e1_cooking_start',
    lines: [
      { speaker: 'Haldor', text: 'Björn, see leem on sul täna kuidagi õhuke... Aja suppi! Viska potti 3 õiget koostisosa.' },
    ],
  },

  'e1_cooking_hint': {
    id: 'e1_cooking_hint',
    lines: [
      { speaker: 'Ivar', text: 'Viska sinna midagi rammusat sisse, muidu me ei jaksa homme isegi aeru tõsta.' },
    ],
  },

  'e1_cooking_wrong_arrow': {
    id: 'e1_cooking_wrong_arrow',
    lines: [
      { speaker: 'Ivar', text: 'Hei! Kas sa proovid meid nooleotsadega toita? Hoia need vaenlaste jaoks!' },
    ],
  },

  'e1_cooking_wrong_bone': {
    id: 'e1_cooking_wrong_bone',
    lines: [
      { speaker: 'Ivar', text: 'See luu on juba korjatud puhtaks. Midagi söödavat seal pole!' },
    ],
  },

  'e1_cooking_wrong_generic': {
    id: 'e1_cooking_wrong_generic',
    lines: [
      { speaker: 'Haldor', text: 'See ei sobi suppi. Midagi tugevamat on vaja!' },
    ],
  },

  'e1_cooking_correct': {
    id: 'e1_cooking_correct',
    lines: [
      { speaker: 'Haldor', text: 'Jah, just seda vajasime! Supp pakseneb.' },
    ],
  },

  'e1_cooking_almost': {
    id: 'e1_cooking_almost',
    lines: [
      { speaker: 'Ivar', text: 'Veel natuke! Meil on vaja 3 koostisosa.' },
    ],
  },

  
  'e1_ivari_monoloog': {
    id: 'e1_ivari_monoloog',
    lines: [
      { speaker: 'Ivar', text: 'Tõeline viiking on peremees, kes teab, millal põldu künda. Ta on strateeg, kes teab, millal rünnata ja millal taanduda. Ja ta on mees, kes on igal hetkel valmis astuma Valhalla väravatest sisse.' },
    ],
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
  },

  
  'e1_bjorn_ulbe': {
    id: 'e1_bjorn_ulbe',
    lines: [
      { speaker: 'Sigrid', text: 'Siis võid sa harjutada põranda nühkimist, enne kui minu pikkmajast jalga lased.' },
    ],
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

  'e2_mythology_intro': {
    id: 'e2_mythology_intro',
    lines: [
      { speaker: 'Narrator', text: 'Tuli on kustunud ja pikkmajas on pime. Vennad räägivad jumalatest ja Valhallast.' },
    ],
  },

  'e2_mythology_thor': {
    id: 'e2_mythology_thor',
    lines: [
      { speaker: 'Haldor', text: 'See on Mjölnir — mitte lihtsalt haamer, vaid looduse jõud ise. Thor kaitses sellega nii inimesi kui ka Asgardi. Kui ta seda heitis, läks see alati tagasi tema kätte.' },
      { speaker: 'Narrator', text: 'Fakt: Thori vasar Mjölnir oli üks tähtsamaid pühasid sümboleid. Seda kanti amuletina kaelas kogu Skandinaavias.' },
    ],
  },

  'e2_mythology_odin': {
    id: 'e2_mythology_odin',
    lines: [
      { speaker: 'Gunnar', text: 'Odin andis ühe silma ära, et saada tarkust. Ta teab, et Ragnarök tuleb — viimane sõda, kus suur osa maailmast hävib ja uus ajastu algab. Aga seni valmistume meie.' },
      { speaker: 'Narrator', text: 'Fakt: Ragnarök on skandinaavia mütoloogias ettekuulutatud maailmalõpp, mil paljud jumalad ja koletised hukkuvad.' },
    ],
  },

  'e2_mythology_valhalla': {
    id: 'e2_mythology_valhalla',
    lines: [
      { speaker: 'Ivar', text: 'Need kilbid kuuluvad neile, kes langenuksid au sees lahingus. Valhalla uksed on neile lahti. Kas sina, Björn, oled valmis oma kohta seal välja teenima?' },
      { speaker: 'Narrator', text: 'Fakt: Valhalla on Odini saal, kuhu pääsevad langenud sõdalased. Seal valmistutakse viimaseks sõjaks Ragnaröki ajal.' },
    ],
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

  'e3_beach_intro': {
    id: 'e3_beach_intro',
    lines: [
      { speaker: 'Narrator', text: 'Koidik. Tuul puhub idast — märk, et meri kutsub Eysysla poole. Ees seisab poolenisti vees suur pikklaev.' },
    ],
  },

  'e3_ship_prow': {
    id: 'e3_ship_prow',
    lines: [
      { speaker: 'Gunnar', text: 'See hirmutab maavaime ja näitab vaenlasele, kes on merede isand.' },
      { speaker: 'Narrator', text: 'Fakt: Viikingilaevade madal süvis (0,5–1 m) võimaldas randuda otse liivarandadel ja tungida madalatesse jõgedesse, kuhu suured kaubalaevad ei pääsenud.' },
    ],
  },

  'e3_ship_mast': {
    id: 'e3_ship_mast',
    lines: [
      { speaker: 'Haldor', text: 'Selle purje kudusid küla naised terve talve. Kui tuul tõuseb, on see puri meie mootor.' },
      { speaker: 'Narrator', text: 'Fakt: Villane puri vilditi ja määriti rasva/tõrvaga. Ühe purje valmistamiseks kulus ~200 lamba vill — sageli kallim kui laeva puitkere.' },
    ],
  },

  'e3_ship_planks': {
    id: 'e3_ship_planks',
    lines: [
      { speaker: 'Ivar', text: 'Need needid hoiavad lauda koos, aga lasevad kerel painduda. Jäik laev murdub tormis, meie "Lohetapja" paindub koos lainega.' },
      { speaker: 'Narrator', text: 'Fakt: Salme laevadest leiti tuhandeid raudneete. Klinker-ehitusviis andis laevale uskumatu elastsuse.' },
    ],
  },

  'e3_ship_oars': {
    id: 'e3_ship_oars',
    lines: [
      { speaker: 'Haldor', text: 'Kui tuul meid reedab, on need aerud meie ainus lootus. Sõudmine on meeskonna ühine rütm.' },
      { speaker: 'Narrator', text: 'Fakt: Salme I laevalt leiti märke 12 sõudjapaarist (24 sõudjat). Aerud toetusid tullidele ja sai sekunditega sisse tõmmata.' },
    ],
  },

  'e3_ship_rudder': {
    id: 'e3_ship_rudder',
    lines: [
      { speaker: 'Gunnar', text: 'Üks mees ja üks mõla juhivad tervet seda lohet. Me hoiame tüüri alati paremal pool.' },
      { speaker: 'Narrator', text: 'Fakt: Tüür alati paremas pardas (starboard / stjornbori — "juhtimispool").' },
    ],
  },

  'e3_supply_intro': {
    id: 'e3_supply_intro',
    lines: [
      { speaker: 'Narrator', text: 'Gunnar hoiab käes ruunipulka. Iga ese tuleb paigutada nii, et laev püsiks tasakaalus.' },
    ],
  },

  'e3_supply_food': {
    id: 'e3_supply_food',
    lines: [
      { speaker: 'Haldor', text: 'Soolakala ja kuivatatud liha lähevad masti lähedale keskele.' },
      { speaker: 'Narrator', text: 'Fakt: Salme laevadest leiti loomaluid (veised, sead, lambad). Peamine toit pikal retkel: kuivatatud kala (tursk) ja herned — säilisid kuid.' },
    ],
  },

  'e3_supply_weapons': {
    id: 'e3_supply_weapons',
    lines: [
      { speaker: 'Ivar', text: 'Mõõgad ja kirved jäävad kirstudesse, aga kilbid kinnitame parda külge.' },
      { speaker: 'Narrator', text: 'Fakt: Salme II laevast leiti kümneid kilbikuplaid ja luksuslikke mõõku. Kilbid parda välisküljele (shield-rack) — vabastas ruumi ja andis kaitsekihi.' },
    ],
  },

  'e3_supply_gaming': {
    id: 'e3_supply_gaming',
    lines: [
      { speaker: 'Haldor', text: 'Ivar ei lähe kuhugi ilma oma luust nuppudeta.' },
      { speaker: 'Narrator', text: 'Fakt: Salme laevadest leiti üle 100 vaalaluust ja sarvest mängunupu — viikingid mängisid strateegimänge pika merereisi ajal.' },
    ],
  },

  'e3_supply_amulets': {
    id: 'e3_supply_amulets',
    lines: [
      { speaker: 'Gunnar', text: 'Aseta see raudne vits vööri. Jumalate pilk ei tee paha.' },
      { speaker: 'Narrator', text: 'Fakt: Viikingid kandsid Thori vasaraid, ruunidega esemeid. Salme laevadest leiti ka koerte ja pistrike luid — ohvriannid või staatusesümbolid.' },
    ],
  },

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
  cookingStart: 'e1_cooking_start',
  cookingHint: 'e1_cooking_hint',
  cookingWrongArrow: 'e1_cooking_wrong_arrow',
  cookingWrongBone: 'e1_cooking_wrong_bone',
  cookingWrongGeneric: 'e1_cooking_wrong_generic',
  cookingCorrect: 'e1_cooking_correct',
  cookingAlmost: 'e1_cooking_almost',
  sigridChoice: 'e1_sigrid_sisse',
  hotspotThread: 'e1_hotspot_thread',
  hotspotKeys: 'e1_hotspot_keys',
  hotspotSalted: 'e1_hotspot_salted',
  hotspotChest: 'e1_hotspot_chest',
  hotspotFire: 'e1_hotspot_fire',
  hotspotTrough: 'e1_hotspot_trough',

  hnefataflIntro: 'e2_tuli_madalaks',
  mythologyIntro: 'e2_mythology_intro',
  mythologyThor: 'e2_mythology_thor',
  mythologyOdin: 'e2_mythology_odin',
  mythologyValhalla: 'e2_mythology_valhalla',

  hnefataflRisky: 'e2_hnefatafl_riskantne',
  hnefataflCautious: 'e2_hnefatafl_ettevaatlik',
  hnefataflDecisive: 'e2_hnefatafl_otsustav',
  hnefataflLoop: 'e2_hnefatafl_mangimise_ajal',

  beachIntro: 'e3_beach_intro',
  shipProw: 'e3_ship_prow',
  shipMast: 'e3_ship_mast',
  shipPlanks: 'e3_ship_planks',
  shipOars: 'e3_ship_oars',
  shipRudder: 'e3_ship_rudder',
  supplyIntro: 'e3_supply_intro',
  supplyFood: 'e3_supply_food',
  supplyWeapons: 'e3_supply_weapons',
  supplyGaming: 'e3_supply_gaming',
  supplyAmulets: 'e3_supply_amulets',

  ormarArrival: 'e3_ormar_saabub',
  pushOff: 'e3_ulemin_merele',

  openSea: 'e4_avameri',

  nightWatch: 'e5_valvekord',
} as const;
