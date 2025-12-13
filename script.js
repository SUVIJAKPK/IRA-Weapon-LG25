const CORRECT_CODE = atob("VEVBTVdPUks=");
const RESULT_WORD = atob("VEVBTVdPUks=");

const codeInput = document.getElementById("codeInput");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const screenText = document.getElementById("screenText");
const statusMsg = document.getElementById("statusMsg");
const teamTiles = document.getElementById("teamTiles");
const fxSword = document.getElementById("fxSword");
const sfxSlash = document.getElementById("sfxSlash");
const sfxError = document.getElementById("sfxError");

// สร้างช่อง TEAMWORK
function initTiles() {
  teamTiles.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const div = document.createElement("div");
    div.className = "tile";
    div.textContent = "_";
    teamTiles.appendChild(div);
  }
}

function clearTiles() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach(tile => {
    tile.className = "tile";
    tile.textContent = "_";
  });
}

function activateTiles() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("active");
      tile.textContent = RESULT_WORD[i];
    }, 120 * i);
  });
}

function errorTiles() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach(tile => {
    tile.classList.remove("active");
    tile.classList.add("error");
    tile.textContent = "X";
  });
}

// เล่นเสียงตอบผิด
function playErrorSound() {
  if (sfxError) {
    try {
      sfxError.currentTime = 0;
      sfxError.play();
    } catch (e) {
      // ถ้า browser บล็อก auto-play ก็ปล่อยไป
    }
  }
}

// เอฟเฟกต์ดาบ + เสียงตอนตอบถูก
function playSwordEffect() {
  fxSword.classList.remove("active");
  void fxSword.offsetWidth; // force reflow
  fxSword.classList.add("active");

  document.body.classList.add("success-mode");
  setTimeout(() => {
    document.body.classList.remove("success-mode");
  }, 900);

  if (sfxSlash) {
    try {
      sfxSlash.currentTime = 0;
      sfxSlash.play();
    } catch (e) {
      // ถ้า browser บล็อก auto-play ก็ปล่อยไป
    }
  }
}

function checkPassword() {
  const val = codeInput.value.toUpperCase();

  if (val.length !== 8) {
    statusMsg.textContent = "ENTER 8 LETTERS";
    statusMsg.className = "status bad";
    errorTiles();
    playErrorSound();
    return;
  }

  if (val === CORRECT_CODE) {
    statusMsg.textContent = "ACCESS GRANTED • WEAPON UNLOCKED";
    statusMsg.className = "status ok";

    screenText.innerHTML =
      'ACCESS GRANTED<br><span class="highlight">I.R.A. WEAPON ONLINE</span><br>YOU ARE THE HERO';

    clearTiles();
    activateTiles();
    playSwordEffect();
  } else {
    statusMsg.textContent = "ACCESS DENIED • INVALID PASSWORD";
    statusMsg.className = "status bad";

    screenText.innerHTML =
      '<span class="danger">UNAUTHORIZED ACCESS</span><br>PASSWORD REJECTED';

    errorTiles();
    playErrorSound();
  }
}

function resetAll() {
  codeInput.value = "";
  statusMsg.textContent = "";
  statusMsg.className = "status";
  clearTiles();
  screenText.innerHTML =
    'AUTHORIZATION REQUIRED<br>ENTER <span class="highlight">8-LETTER PASSWORD</span><br>TO UNLOCK I.R.A. WEAPON';
}

submitBtn.onclick = checkPassword;
resetBtn.onclick = resetAll;

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.toUpperCase();
});

codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

initTiles();
