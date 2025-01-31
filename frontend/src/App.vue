<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        YouTube Playlist Downloader
      </h1>
      
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <!-- Sélection du dossier de téléchargement -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Download Directory
          </label>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              v-model="downloadDirectory"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter download directory path"
            />
            <button
              @click="setDownloadDirectory"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              :disabled="loading"
            >
              Set Directory
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Current directory: {{ currentDirectory || 'Default' }}
          </p>
        </div>

        <div class="mb-6">
          <label for="playlist-url" class="block text-sm font-medium text-gray-700 mb-2">
            Playlist URL
          </label>
          <input
            id="playlist-url"
            v-model="playlistUrl"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.youtube.com/playlist?list=..."
          />
        </div>

        <button
          @click="getPlaylistInfo"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-6"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Get Playlist Info' }}
        </button>

        <!-- Liste des chansons -->
        <div v-if="songs.length" class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Songs in Playlist</h2>
          <div v-for="song in songs" :key="song.url" class="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <span class="flex-1 text-gray-700">{{ song.title }}</span>
            <button
              @click="downloadSong(song)"
              class="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="song.downloading"
            >
              {{ song.downloading ? 'Downloading...' : 'Download' }}
            </button>
          </div>
        </div>

        <!-- Messages d'état -->
        <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {{ error }}
        </div>
        <div v-if="success" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
const playlistUrl = ref('');
const downloadDirectory = ref('');
const currentDirectory = ref('');
const songs = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

async function setDownloadDirectory() {
  if (!downloadDirectory.value) {
    error.value = 'Please enter a directory path';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await axios.post(`${API_URL}/playlist/set-directory`, {
      directory: downloadDirectory.value
    });
    currentDirectory.value = response.data.directory;
    success.value = response.data.message;
    downloadDirectory.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Error setting download directory';
  } finally {
    loading.value = false;
  }
}

async function getPlaylistInfo() {
  if (!playlistUrl.value) {
    error.value = 'Please enter a playlist URL';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await axios.get(`${API_URL}/playlist/info`, {
      params: { url: playlistUrl.value }
    });
    songs.value = response.data.data.map(song => ({
      ...song,
      downloading: false
    }));
  } catch (err) {
    error.value = err.response?.data?.message || 'Error fetching playlist information';
  } finally {
    loading.value = false;
  }
}

async function downloadSong(song) {
  song.downloading = true;
  error.value = '';
  success.value = '';

  try {
    const response = await axios.post(`${API_URL}/playlist/download`, {
      url: song.url
    });
    success.value = `Downloaded "${response.data.title}" to ${response.data.directory}`;
    console.log('Download complete:', response.data);
  } catch (err) {
    error.value = `Error downloading ${song.title}`;
  } finally {
    song.downloading = false;
  }
}
</script> 