const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');

// Get playlist information
router.get('/info', playlistController.getPlaylistInfo);

// Download a single song
router.post('/download', playlistController.downloadSong);

// Set download directory
router.post('/set-directory', playlistController.setDownloadDirectory);

module.exports = router; 