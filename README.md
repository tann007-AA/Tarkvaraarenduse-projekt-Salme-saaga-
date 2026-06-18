# Salme saaga

## Kuvatõmmised

![Avamenüü](images/mainmenu-screen.webp)

![Storymode](images/story-sweden-screen.webp)

![Hnefatafl](images/hnefatafl-screen.webp)

## Eesmärk ja lühikirjeldus

Salme saaga on viikingiteemaline õpimäng, mille eesmärk on arendada huvi ja teadmisi Eestis olnud viikingite ning nende ajaloo vastu. Mäng on mõeldud muuseumite ja koolide õppetöö muutmiseks interaktiivsemaks ja kaasahaaravamaks. Projekt lahendab probleemi, kus traditsiooniline ajalooõpe mäluasutustes ja koolides jääb õpilastele kaugeks ja vähe köitvaks, pakkudes selle asemel mängulist ja visuaalset viisi ajalooga tutvumiseks.

## Instituut ja projekti raamistik

Projekt on valminud Tallinna Ülikooli Digitehnoloogia Instituudi (DTI) ja ELU projekti raames, pealkirjaga "Tulevikuõpe ja loovtehnoloogiad: millist lugu jutustavad mäluasutused?".

## Kasutatud tehnoloogiad

**Frontend**
- Vite 6.3.5
- React 18.3.1
- TypeScript 5.x (kompilaator: `typescript` ^6.0.3)
- Tailwind CSS 4.1.12
- MUI (Material UI) 7.3.5
- Radix UI komponendid (v1–v2.x)
- Socket.IO Client 4.8.3

**Backend**
- Node.js (soovitatud LTS versioon, nt 20.x)
- NestJS 11.x (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/websockets` jt)
- TypeScript 5.7.3
- Drizzle ORM 0.45.2 (koos `drizzle-kit` 0.31.10)
- MariaDB / MySQL (ühendus läbi `mysql2` 3.22.5)
- Socket.IO 4.8.3
- Swagger / OpenAPI (`@nestjs/swagger` 11.4.4)

**Andmebaas**
- MariaDB (SQL)

## Projekti autorid

- Taaniel Tubin
- Karl-Kregor Keerles
- Patrick Jurs
- Remus-Markus Luht
- Rasmus Steinberg
- Markus Parts
- Maik Hellamaa
- Marko Rajang
- Martin Kullerkupp
- Kregor Veemaa

## Paigaldusjuhised ja arenduskeskkonna ülesseadmine

Projekt koosneb kahest osast: **frontend** (Vite + React + TypeScript) ja **backend** (NestJS + Drizzle + MariaDB). Mõlemad tuleb käima panna eraldi.

### Eeldused

- [Node.js](https://nodejs.org/) versioon 20.x või uuem (sisaldab npm-i)
- MariaDB server (lokaalne paigaldus või Docker-konteiner)
- Git

### 1. Projekti allalaadimine

```bash
git clone <repositooriumi-URL>
cd <projekti-kaust>
```

### 2. Andmebaasi ülesseadmine (MariaDB)

Looge MariaDB-s uus andmebaas ja kasutaja:

```sql
CREATE DATABASE salme_saaga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'salme_user'@'localhost' IDENTIFIED BY 'turvaline_parool';
GRANT ALL PRIVILEGES ON salme_saaga.* TO 'salme_user'@'localhost';
FLUSH PRIVILEGES;
```

> Tabelid luuakse automaatselt Drizzle migratsioonidega (vt allpool), eraldi SQL-skripti käsitsi käivitamine ei ole vajalik.

### 3. Backendi ülesseadmine

```bash
cd backend
npm install
```

Looge kausta `backend/` fail `.env` (vajadusel kasutage `.env.example` põhjana) ja täitke andmebaasi ühenduse andmed:

```env
DATABASE_URL="mysql://salme_user:turvaline_parool@localhost:3306/salme_saaga"
PORT=3000
```

Käivitage Drizzle migratsioonid, et luua andmebaasi tabelid:

```bash
npx drizzle-kit push
```

Käivitage backend arendusrežiimis:

```bash
npm run start:dev
```

Backend on vaikimisi kättesaadav aadressil `http://localhost:3000`.

### 4. Frontendi ülesseadmine

Avage uus terminaliaken:

```bash
cd frontend
npm install
```

Looge vajadusel kausta `frontend/` fail `.env`, kus on backendi aadress, näiteks:

```env
VITE_API_URL=http://localhost:3000
```

Käivitage frontend arendusrežiimis:

```bash
npm run dev
```

Vite annab terminalis lokaalse aadressi (vaikimisi tavaliselt `http://localhost:5173`), kus rakendus on brauseris avatav.

### 5. Tootmisversiooni (production) build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Kasulikud käsud

| Käsk | Asukoht | Kirjeldus |
|------|---------|-----------|
| `npm run dev` | frontend | Käivitab Vite arendusserveri |
| `npm run build` | frontend | Loob tootmisversiooni build'i |
| `npm run start:dev` | backend | Käivitab NestJS serveri watch-režiimis |
| `npm run test` | backend | Käivitab Jest testid |
| `npm run db:repair` | backend | Parandab arenduse andmebaasi (skript `scripts/repair-dev-db.js`) |

## Litsents

Projekt on litsenseeritud MIT litsentsi alusel. Vt täpsemalt failist [LICENSE](LICENSE).
