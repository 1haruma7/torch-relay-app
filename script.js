const INITIAL_SCORE = 100;
const URGENCY_CLASSES = ["urgency-low", "urgency-medium", "urgency-high", "urgency-critical", "score-empty"];

let score = INITIAL_SCORE;
let stopped = false;
let musicOn = false;

const scoreboard = document.querySelector(".scoreboard");
const panel = document.querySelector(".panel");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#status");
const gauge = document.querySelector(".gauge");
const gaugeFill = document.querySelector("#gaugeFill");
const musicButton = document.querySelector("#musicButton");
const resumeButton = document.querySelector("#resumeButton");
const resetButton = document.querySelector("#resetButton");
const music = new Audio("assets/heaven-and-hell.wav");

music.loop = true;
music.preload = "auto";

function getUrgencyClass() {
  if (score === 0) return "score-empty";
  if (score <= 10) return "urgency-critical";
  if (score <= 25) return "urgency-high";
  if (score <= 50) return "urgency-medium";
  if (score <= 75) return "urgency-low";
  return "";
}

function render() {
  const urgencyClass = getUrgencyClass();
  const scoreRatio = score / INITIAL_SCORE;

  scoreEl.textContent = String(score);
  gaugeFill.style.width = `${score}%`;
  gaugeFill.style.opacity = String(0.28 + scoreRatio * 0.72);
  gauge.setAttribute("aria-valuenow", String(score));
  statusEl.textContent = stopped ? "停止" : "進行中";

  scoreboard.classList.remove(...URGENCY_CLASSES);
  panel.classList.remove(...URGENCY_CLASSES);

  if (urgencyClass) {
    scoreboard.classList.add(urgencyClass);
    panel.classList.add(urgencyClass);
  }

  scoreboard.classList.toggle("stopped", stopped);
  panel.classList.toggle("stopped", stopped);
}

async function startMusic() {
  if (musicOn) {
    return;
  }

  await music.play();
  musicOn = true;
  musicButton.textContent = "音楽 OFF";
}

function stopMusic() {
  musicOn = false;
  musicButton.textContent = "音楽 ON";
  music.pause();
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();

    if (!event.repeat && !stopped && score > 0) {
      score -= 1;
      render();
    }

    return;
  }

  if (event.repeat) {
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    stopped = true;
    render();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
  }
});

resetButton.addEventListener("click", () => {
  score = INITIAL_SCORE;
  stopped = false;
  render();
  resetButton.blur();
});

resumeButton.addEventListener("click", () => {
  stopped = false;
  render();
  resumeButton.blur();
});

musicButton.addEventListener("click", async () => {
  if (musicOn) {
    stopMusic();
  } else {
    await startMusic();
  }

  musicButton.blur();
});

render();
