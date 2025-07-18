const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const message = document.getElementById('message');


let score = 0;
let timeLeft = 30;
let gameTimer;
let moleTimer;
let moleInterval = 800;
let moleSpeedTimer;
let activeMole = null;
let gameActive = false;

// INFO modal
document.getElementById("info-btn").addEventListener("click", () => {
  document.getElementById("info-box").classList.remove("hidden");
});

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("info-box").classList.add("hidden");
});

const difficultyButtons = document.querySelectorAll('.difficulty-btn');

difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' from all buttons
    difficultyButtons.forEach(btn => btn.classList.remove('active'));

    // Add 'active' to the clicked one
    button.classList.add('active');

    // Optional: you can also update a speed variable if needed
    const selectedSpeed = parseInt(button.dataset.speed);
    gameSpeed = selectedSpeed; // Use this variable in your mole logic
  });
});

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('data-id', i);
    grid.appendChild(square);
  }
}

function randomMole() {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => square.innerHTML = '');
  const index = Math.floor(Math.random() * 9);
  const mole = document.createElement('div');
  mole.classList.add('mole');
  squares[index].appendChild(mole);
  activeMole = index;
}
function startGame() {
  score = 0;
  timeLeft = 30;
  const gameArea = document.getElementById("game-area");
if (gameArea.requestFullscreen) {
  gameArea.requestFullscreen();
} else if (gameArea.webkitRequestFullscreen) { // Safari
  gameArea.webkitRequestFullscreen();
} else if (gameArea.msRequestFullscreen) { // IE11
  gameArea.msRequestFullscreen();
}

  gameActive = true;
  activeMole = null;

  const difficulty = document.querySelector('.difficulty-btn.active').getAttribute('data-speed');
  moleInterval = parseInt(difficulty);

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  message.textContent = '';
  startBtn.classList.add('hidden');
  restartBtn.classList.add('hidden');

  // 🔽 Hide the info + difficulty settings
  document.getElementById('settings').classList.add('hidden');

  createGrid();
  randomMole();

  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    square.addEventListener('click', () => {
      if (!gameActive) return;

      const clickedId = square.getAttribute('data-id');
      if (clickedId == activeMole) {
        score++;
        square.innerHTML = '';
        activeMole = null;
      } else {
        score = Math.max(0, score - 1);
      }
      scoreDisplay.textContent = score;
    });
  });

  moleTimer = setInterval(randomMole, moleInterval);

  moleSpeedTimer = setInterval(() => {
    if (moleInterval > 300) {
      moleInterval -= 50;
      clearInterval(moleTimer);
      moleTimer = setInterval(randomMole, moleInterval);
    }
  }, 2000);

  gameTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) endGame();
  }, 1000);
}


function endGame() {
  gameActive = false;
  clearInterval(gameTimer);
  clearInterval(moleTimer);
  clearInterval(moleSpeedTimer);

  // Exit fullscreen
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  message.textContent = 'Time’s up! Your score: ' + score + ' — ' + getEndMessage(score);
  restartBtn.classList.remove('hidden');

  // Show settings again
  document.getElementById('settings').classList.remove('hidden');
}



function getEndMessage(score) {
  if (score >= 30) return "🔥 Whack Master! Amazing!";
  if (score >= 20) return "👏 Great Job! Keep it up!";
  if (score >= 10) return "👍 Nice! You're getting better!";
  return "😅 Try again!";
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

createGrid();
