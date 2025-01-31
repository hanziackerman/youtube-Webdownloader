# YouTube Playlist Downloader 🎵

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/)

## 🇫🇷 Description en Français

Une application web moderne permettant de télécharger facilement les musiques d'une playlist YouTube individuellement.

### ✨ Fonctionnalités

- 📥 Téléchargement de playlists YouTube et YouTube Music
- 🎵 Conversion automatique en MP3 haute qualité
- 📝 Conservation des métadonnées (titre, artiste, miniature)
- 📁 Choix personnalisé du dossier de téléchargement
- 🎨 Interface utilisateur moderne et intuitive
- 🌐 Support des URLs YouTube et YouTube Music

### 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/hanziackerman/youtube-Webdownloader.git
cd youtube-Webdownloader
```

2. Installez les dépendances du backend :
```bash
cd backend
npm install
```

3. Installez les dépendances du frontend :
```bash
cd ../frontend
npm install
```

### 💻 Utilisation

1. Démarrez le backend :
```bash
cd backend
npm run dev
```

2. Démarrez le frontend dans un autre terminal :
```bash
cd frontend
npm run dev
```

3. Ouvrez votre navigateur sur http://localhost:8080

## 🇬🇧 English Description

A modern web application for easily downloading songs from YouTube playlists individually.

### ✨ Features

- 📥 Download from YouTube and YouTube Music playlists
- 🎵 Automatic high-quality MP3 conversion
- 📝 Metadata preservation (title, artist, thumbnail)
- 📁 Custom download directory selection
- 🎨 Modern and intuitive user interface
- 🌐 Support for both YouTube and YouTube Music URLs

### 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/hanziackerman/youtube-Webdownloader.git
cd youtube-Webdownloader
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 💻 Usage

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend in another terminal:
```bash
cd frontend
npm run dev
```

3. Open your browser at http://localhost:8080

## 🛠️ Technologies Utilisées / Technologies Used

- Backend:
  - Node.js
  - Express
  - yt-dlp
  - FFmpeg

- Frontend:
  - Vue.js 3
  - Tailwind CSS
  - Axios

## 📝 License

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails / See [LICENSE](LICENSE) file for details

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