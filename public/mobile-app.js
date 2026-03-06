const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapshot = document.getElementById('snapshot');
const statusEl = document.getElementById('status');
const resultList = document.getElementById('results');
const startBtn = document.getElementById('startBtn');
const captureBtn = document.getElementById('captureBtn');
const retryBtn = document.getElementById('retryBtn');

let stream;
let model;

async function loadModel() {
  statusEl.textContent = '正在加载识别模型...';
  model = await cocoSsd.load();
  statusEl.textContent = '模型已加载，点击“开启摄像头”。';
}

function renderPredictions(predictions) {
  resultList.innerHTML = '';
  if (!predictions.length) {
    const li = document.createElement('li');
    li.textContent = '未识别到明显物体，请换个角度再试。';
    resultList.appendChild(li);
    return;
  }

  predictions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.class}（置信度 ${(item.score * 100).toFixed(1)}%）`;
      resultList.appendChild(li);
    });
}

startBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    video.srcObject = stream;
    captureBtn.disabled = false;
    statusEl.textContent = '摄像头已开启，请点击“拍照识别”。';
  } catch (error) {
    statusEl.textContent = `无法开启摄像头：${error.message}`;
  }
});

captureBtn.addEventListener('click', async () => {
  if (!model) {
    statusEl.textContent = '模型尚未加载完成，请稍后。';
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  snapshot.src = canvas.toDataURL('image/jpeg', 0.9);

  video.classList.add('hidden');
  snapshot.classList.remove('hidden');
  retryBtn.classList.remove('hidden');

  statusEl.textContent = '识别中...';
  const predictions = await model.detect(canvas);
  statusEl.textContent = '识别完成：';
  renderPredictions(predictions);
});

retryBtn.addEventListener('click', () => {
  snapshot.classList.add('hidden');
  video.classList.remove('hidden');
  retryBtn.classList.add('hidden');
  resultList.innerHTML = '';
  statusEl.textContent = '请再次拍照。';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

loadModel().catch((error) => {
  statusEl.textContent = `模型加载失败：${error.message}`;
});
