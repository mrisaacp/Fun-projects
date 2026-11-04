// ===== Settings =====
const STREAK_TO_WIN = 5;

// Each level picks two numbers a and b
const LEVELS = {
  easiest: { name: "Easiest", make: () => pair(5, 10) },  // each number 0–5
  easy:    { name: "Easy",    make: () => pair(20, 20) }, // sum 20 or less
  medium:  { name: "Medium",  make: () => pair(49, 49) }, // sum less than 50
};

// Random whole number from min to max (inclusive)
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Make two numbers, each no bigger than maxEach, whose sum is no bigger than maxSum
function pair(maxEach, maxSum) {
  const sum = rand(1, Math.min(maxSum, maxEach * 2));
  const lo = Math.max(0, sum - maxEach);
  const hi = Math.min(maxEach, sum);
  const a = rand(lo, hi);
  return [a, sum - a];
}

// ===== Game state =====
let player = "";
let level = "easiest";
let streak = 0;
let a = 0, b = 0;

// ===== Page elements =====
const $ = (id) => document.getElementById(id);
const setup = $("setup"), game = $("game"), win = $("win");
const nameInput = $("playerName"), answer = $("answer"), feedback = $("feedback");

const cheers = ["Great job!", "Awesome!", "You got it!", "Super!", "Way to go!"];
const tryAgain = ["Oops, try the next one!", "Not quite, keep going!", "Almost! Try another!"];

function show(section) {
  [setup, game, win].forEach((s) => s.classList.add("hidden"));
  section.classList.remove("hidden");
}

function updateStars() {
  $("stars").textContent = "⭐".repeat(streak) + "☆".repeat(STREAK_TO_WIN - streak);
}

function newProblem() {
  [a, b] = LEVELS[level].make();
  $("num1").textContent = a;
  $("num2").textContent = b;
  answer.value = "";
  answer.focus();
}

function startGame(chosenLevel) {
  player = nameInput.value.trim();
  if (!player) {
    $("setupMsg").textContent = "Please type your name first! 😊";
    $("setupMsg").className = "msg bad";
    nameInput.focus();
    return;
  }
  $("setupMsg").textContent = "";
  level = chosenLevel;
  streak = 0;
  $("greeting").textContent = `Let's go, ${player}! (${LEVELS[level].name})`;
  feedback.textContent = "";
  updateStars();
  show(game);
  newProblem();
}

function checkAnswer() {
  if (answer.value === "") {
    feedback.textContent = "Type an answer first!";
    feedback.className = "msg bad";
    answer.focus();
    return;
  }

  if (Number(answer.value) === a + b) {
    streak++;
    feedback.textContent = cheers[rand(0, cheers.length - 1)];
    feedback.className = "msg good";
  } else {
    feedback.textContent = `${tryAgain[rand(0, tryAgain.length - 1)]} ${a} + ${b} = ${a + b}`;
    feedback.className = "msg bad";
    streak = 0;
  }
  updateStars();

  if (streak >= STREAK_TO_WIN) {
    $("winMsg").textContent = `🎉 You win, ${player}! 🎉`;
    show(win);
  } else {
    newProblem();
  }
}

// ===== Button hookups =====
document.querySelectorAll(".level").forEach((btn) =>
  btn.addEventListener("click", () => startGame(btn.dataset.level))
);
$("checkBtn").addEventListener("click", checkAnswer);
answer.addEventListener("keydown", (e) => { if (e.key === "Enter") checkAnswer(); });
$("playAgainBtn").addEventListener("click", () => startGame(level));
$("changeBtn").addEventListener("click", () => show(setup));
$("winChangeBtn").addEventListener("click", () => show(setup));
