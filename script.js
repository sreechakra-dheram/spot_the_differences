let config;
let found = [];
let score = 0;
let timer = 0;
let interval;

fetch('config.json')
  .then(res => res.json())
  .then(data => {
    config = data;
    document.getElementById('game-title').textContent = config.gameTitle;
    loadImages();
    startTimer();
  });

function loadImages() {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  img1.src = config.images.image1;
  img2.src = config.images.image2;

  img1.onload = () => setupCanvas('canvas1', img1);
  img2.onload = () => setupCanvas('canvas2', img2);

  document.getElementById('left-image').addEventListener('click', handleClick);
  document.getElementById('right-image').addEventListener('click', handleClick);
}

function setupCanvas(canvasId, image) {
  const canvas = document.getElementById(canvasId);
  canvas.width = image.width;
  canvas.height = image.height;
}

function handleClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  config.differences.forEach((diff, index) => {
    if (!found.includes(index) &&
        x >= diff.x && x <= diff.x + diff.width &&
        y >= diff.y && y <= diff.y + diff.height) {
      found.push(index);
      score++;
      document.getElementById('score').textContent = score;
      markDifference(diff);
      if (score === config.differences.length) {
        clearInterval(interval);
        document.getElementById('message').textContent = `All differences found in ${timer} seconds! 🎉`;
        playSound('success');
      } else {
        playSound('found');
      }
    }
  });
}

function playSound(type) {
  let audio = new Audio();
  if (type === 'success') {
    audio.src = 'sounds/success.mp3';
  } else if (type === 'found') {
    audio.src = 'sounds/found.mp3';
  }
  audio.play();
}

function markDifference(diff) {
  ['canvas1', 'canvas2'].forEach(canvasId => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeRect(diff.x, diff.y, diff.width, diff.height);
  });
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

  

