# YouTube Playlist Downloader

Une application web permettant de télécharger les musiques d'une playlist YouTube individuellement.

## Fonctionnalités

- Récupération des informations d'une playlist YouTube
- Téléchargement individuel des musiques au format MP3
- Interface utilisateur moderne et réactive

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Utilisation

1. Lancez le backend et le frontend
2. Ouvrez votre navigateur sur http://localhost:8080
3. Collez l'URL d'une playlist YouTube
4. Cliquez sur "Get Playlist Info" pour charger la liste des musiques
5. Utilisez les boutons "Download" pour télécharger chaque musique

## Structure du projet

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.vue
    │   ├── main.js
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Notes

- Les fichiers téléchargés sont sauvegardés dans le dossier `backend/downloads`
- L'application utilise ytdl-core pour le téléchargement des vidéos
- L'interface utilise Vue.js 3 avec Tailwind CSS pour le style 