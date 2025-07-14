const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreEl = document.getElementById("score");

const lanes = [window.innerWidth / 6, window.innerWidth / 2 - 25, window.innerWidth * 5 / 6 - 50];
let lane = 1;
let jumping = false;
let ducking = false;
let score = 0;

player.style.left = lanes[lane] + "px";

function moveLeft() {
  if (lane > 0) {
    lane--;
    player.style.left = lanes[lane] + "px";
  }
}

function moveRight() {
  if (lane < 2) {
    lane++;
    player.style.left = lanes[lane] + "px";
  }
}

function jump() {
  if (!jumping) {
    jumping = true;
    player.style.bottom = "120px";
    setTimeout(() => {
      player.style.bottom = "20px";
      jumping = false;
    }, 500);
  }
}

function duck() {
  if (!ducking) {
    ducking = true;
    player.style.height = "25px";
    setTimeout(() => {
      player.style.height = "50px";
      ducking = false;
    }, 500);
  }
}

// Keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowUp") jump();
  if (e.key === "ArrowDown") duck();
});

// Touch/swipe controls
let startX = 0, startY = 0;

gameContainer.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

gameContainer.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveRight();
    else moveLeft();
  } else {
    if (dy < 0) jump();
    else duck();
  }
});

// Game Loop: spawn obstacles and coins
function spawnItem() {
  const type = Math.random() < 0.7 ? "obstacle" : "coin";
  const item = document.createElement("div");
  item.classList.add(type);
  item.style.left = lanes[Math.floor(Math.random() * 3)] + "px";
  item.style.bottom = "100vh";
  gameContainer.appendChild(item);

  let bottom = window.innerHeight;
  const fall = setInterval(() => {
    bottom -= 10;
    item.style.bottom = bottom + "px";

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom > playerRect.top &&
      itemRect.top < playerRect.bottom &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (type === "coin") {
        score += 10;
        item.remove();
        clearInterval(fall);
        scoreEl.textContent = "Score: " + score;
      } else {
        alert("Game Over! Final Score: " + score);
        location.reload();
      }
    }

    if (bottom < -50) {
      item.remove();
      clearInterval(fall);
    }
  }, 30);
}

setInterval(spawnItem, 1200);
