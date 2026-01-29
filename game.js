const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 360;
canvas.height = 360;
document.getElementById("game-container").appendChild(canvas);

const box = 20;
let snake, food, dir, score, game, isRunning = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = randomFood();
  dir = null;
  score = 0;
  isRunning = false;
  drawStartScreen();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 17 + 1) * box,
  };
}

function drawStartScreen() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("NEON SNAKE", canvas.width / 2, 140);

  ctx.fillStyle = "#22c55e";
  ctx.font = "16px Arial";
  ctx.fillText("Press START or any arrow key", canvas.width / 2, 180);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "14px Arial";
  ctx.fillText("High Score: " + highScore, canvas.width / 2, 210);
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  game = setInterval(draw, 120);
}

function endGame() {
  clearInterval(game);
  isRunning = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
  }

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, 150);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2, 180);
  ctx.fillText("High Score: " + highScore, canvas.width / 2, 205);
  ctx.fillText("Press START to play again", canvas.width / 2, 235);
}

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#38bdf8";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#facc15";
  ctx.fillRect(food.x, food.y, box, box);

  // Old head
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (dir === "LEFT") snakeX -= box;
  if (dir === "UP") snakeY -= box;
  if (dir === "RIGHT") snakeX += box;
  if (dir === "DOWN") snakeY += box;

  // Eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // Collision
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  // Score
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High: " + highScore, 260, 20);
}

function collision(head, array) {
  return array.some(seg => seg.x === head.x && seg.y === head.y);
}

// Keyboard control
document.addEventListener("keydown", e => {
  if (!isRunning) startGame();

  if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
  if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
  if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
});

// Mobile buttons
window.setDir = d => {
  if (!isRunning) startGame();
  if (d === "LEFT" && dir !== "RIGHT") dir = "LEFT";
  if (d === "UP" && dir !== "DOWN") dir = "UP";
  if (d === "RIGHT" && dir !== "LEFT") dir = "RIGHT";
  if (d === "DOWN" && dir !== "UP") dir = "DOWN";
};

initGame();
