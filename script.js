const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");
const question = document.getElementById("question");
const area = document.getElementById("buttonArea");
const heartsLayer = document.getElementById("heartsLayer");
const loveSong = document.getElementById("loveSong");

// ✅ Change these two to personalize
const HIS_NICKNAME = "babe";        // e.g. "Alex", "my love", "handsome"
const VIBE = "romantic";            // soft / funny / chaotic / romantic

let noClicks = 0;
let yesScale = 1;
let songStarted = false;

// Question changes after each No click
const questionSteps = [
  `Will you be my Valentine, ${HIS_NICKNAME}? 💘`,
  "Are you sure? 🥺",
  "Really sure?? 😭",
  "Last chance 👀"
];

// Message after Yes click (based on vibe)
const vibeYesMessages = {
  soft: "Yayyy 🥹💖 you just made my whole day.",
  funny: "Correct answer 😌💘 (I definitely didn’t rig this)",
  chaotic: "LET’S GOOOOO 💥💘 YOU’RE MINE NOW",
  romantic: "Yay, my love 💘 I can’t wait to be your Valentine."
};

function setQuestionText() {
  const idx = Math.min(noClicks, questionSteps.length - 1);
  question.textContent = questionSteps[idx];
}

function moveNoButton() {
  const areaRect = area.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(1, areaRect.width - noRect.width);
  const maxY = Math.max(1, areaRect.height - noRect.height);

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";
}

function spawnHeartsBurst(count = 20) {
  const yesRect = yesBtn.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "💖";

    const jitterX = (Math.random() - 0.5) * 140;
    const jitterY = (Math.random() - 0.5) * 50;

    h.style.left = `${yesRect.left + yesRect.width / 2 + jitterX}px`;
    h.style.top = `${yesRect.top + yesRect.height / 2 + jitterY}px`;

    h.style.animationDelay = `${Math.random() * 120}ms`;

    heartsLayer.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

async function playSongOnce() {
  if (songStarted) return;
  songStarted = true;
  try {
    await loveSong.play();
  } catch (e) {
    message.textContent = "If the song didn’t play, tap Yes again 💖 (phones can be picky).";
  }
}

// Set the starting question with his nickname
setQuestionText();

noBtn.addEventListener("click", () => {
  noClicks++;

  // change the question text
  setQuestionText();

  // move No away + grow Yes
  moveNoButton();
  yesScale += 0.25;
  yesBtn.style.transform = `scale(${yesScale})`;

  // little messages
  if (noClicks === 1) message.textContent = "No?? 😢";
  if (noClicks === 2) message.textContent = "Pleaseeee 😭";

  // after 3 clicks: No disappears
  if (noClicks >= 3) {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    setTimeout(() => (noBtn.style.display = "none"), 220);
    message.textContent = "Okay… only one option left 😌💖";
  }
});

yesBtn.addEventListener("click", async () => {
  await playSongOnce();
  spawnHeartsBurst(26);

  const chosen = vibeYesMessages[VIBE] || vibeYesMessages.romantic;
  message.textContent = chosen;

  question.textContent = `YAY!! 💘 I love you, ${HIS_NICKNAME}!`;
});
