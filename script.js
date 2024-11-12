const apiKey = 'f33176ab';
let currentTrackIndex = 0;
let tracks = [];
let isRepeating = false; // For repeat functionality
const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('play-pause');
const shuffleButton = document.getElementById('shuffle-button');

// Function to fetch tracks from Jamendo
async function fetchTracks() {
  const response = await fetch(`https://api.jamendo.com/v3.0/tracks?client_id=${apiKey}&format=json&limit=200`);
  const data = await response.json();
  
  tracks = data.results;
  loadTrack(currentTrackIndex);
}


// Function to load a track
function loadTrack(index) {
  if (tracks.length === 0) return;
  const track = tracks[index];
  const songInfo = document.getElementById('song-info');

  const audioUrl = track.audio || track.audio_download;
  if (audioUrl) {
    audio.src = audioUrl;
    songInfo.textContent = `${track.name} - ${track.artist_name}`;
    playTrack(); // Automatically play the loaded track
  } else {
    console.error("No audio URL available for this track");
  }
}

// Function to toggle play/pause
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change icon to pause
  } else {
    audio.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change icon to play
  }
}

// Function to play the track and update button icon
function playTrack() {
  audio.play();
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
}

// Next track functionality
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
}

// Previous track functionality
function previousTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
}

// Shuffle tracks functionality
function shuffleTracks() {
  // Shuffle the tracks array using the Fisher-Yates algorithm
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]]; // Swap elements
  }
  
  currentTrackIndex = 0; // Reset to first track of the shuffled list
  loadTrack(currentTrackIndex);
}

// Repeat functionality
function toggleRepeat() {
  isRepeating = !isRepeating;
  if (isRepeating) {
    audio.loop = true;
  } else {
    audio.loop = false;
  }
  // Update repeat button icon
  document.getElementById('repeat-button').innerHTML = isRepeating
    ? '<i class="fas fa-redo-alt"></i>'
    : '<i class="fas fa-redo"></i>';
}

// Initialize and fetch tracks on load
document.addEventListener('DOMContentLoaded', fetchTracks);
