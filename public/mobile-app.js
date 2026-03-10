const tracks = [
  {
    title: '清晨电台',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: '午后微风',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: '夜晚漫步',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const timeText = document.getElementById('timeText');
const playlist = document.getElementById('playlist');

let currentIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

function renderPlaylist() {
  playlist.innerHTML = '';

  tracks.forEach((track, index) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = `track-btn ${index === currentIndex ? 'active' : ''}`;
    btn.innerHTML = `<strong>${track.title}</strong><span>${track.artist}</span>`;
    btn.addEventListener('click', async () => {
      loadTrack(index);
      await audio.play();
      playBtn.textContent = '暂停';
    });
    li.appendChild(btn);
    playlist.appendChild(li);
  });
}

function loadTrack(index) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];

  audio.src = track.url;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  progress.value = '0';
  timeText.textContent = '00:00 / 00:00';
  renderPlaylist();
}

playBtn.addEventListener('click', async () => {
  if (!audio.src) {
    loadTrack(currentIndex);
  }

  if (audio.paused) {
    await audio.play();
    playBtn.textContent = '暂停';
  } else {
    audio.pause();
    playBtn.textContent = '播放';
  }
});

prevBtn.addEventListener('click', async () => {
  loadTrack(currentIndex - 1);
  await audio.play();
  playBtn.textContent = '暂停';
});

nextBtn.addEventListener('click', async () => {
  loadTrack(currentIndex + 1);
  await audio.play();
  playBtn.textContent = '暂停';
});

audio.addEventListener('timeupdate', () => {
  const value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progress.value = String(Math.floor(value));
  timeText.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

progress.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value) / 100;
});

audio.addEventListener('ended', async () => {
  loadTrack(currentIndex + 1);
  await audio.play();
  playBtn.textContent = '暂停';
});

audio.addEventListener('error', () => {
  timeText.textContent = '当前歌曲加载失败，请切换下一首重试。';
  playBtn.textContent = '播放';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

loadTrack(currentIndex);
audio.volume = Number(volume.value) / 100;
