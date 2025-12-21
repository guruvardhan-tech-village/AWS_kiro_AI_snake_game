const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const aiBtn = document.getElementById("aiBtn");
const manualBtn = document.getElementById("manualBtn");


const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = randomFood();
let dx = 1;
let dy = 0;
let aiMode = false;
let score = 0;
let gameOver = false;

// Ensure window.aiMode is synchronized
window.aiMode = aiMode;

// Set AI mode
function setAIMode() {
  aiMode = true;
  window.aiMode = true;  // Also set window.aiMode for tests
  updateButtonStates();
}

// Set Manual mode
function setManualMode() {
  aiMode = false;
  window.aiMode = false;  // Also set window.aiMode for tests
  updateButtonStates();
}

// Update button visual states
function updateButtonStates() {
  if (aiMode) {
    aiBtn.className = "ai-on";
    manualBtn.className = "ai-off";
  } else {
    aiBtn.className = "ai-off";
    manualBtn.className = "ai-on";
  }
}

// Keyboard control (manual)
document.addEventListener("keydown", (e) => {
  if (aiMode) return;

  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

// AI movement logic with collision avoidance
function aiMove() {
  const head = snake[0];
  
  // Calculate all possible moves
  const moves = [
    { dx: 1, dy: 0, priority: 0 },   // Right
    { dx: -1, dy: 0, priority: 0 },  // Left
    { dx: 0, dy: 1, priority: 0 },   // Down
    { dx: 0, dy: -1, priority: 0 }   // Up
  ];
  
  // Filter out moves that would reverse direction (180 turn)
  const validMoves = moves.filter(move => {
    return !(move.dx === -dx && move.dy === -dy);
  });
  
  // Calculate priority for each move (distance to food)
  validMoves.forEach(move => {
    const newX = head.x + move.dx;
    const newY = head.y + move.dy;
    
    // Wrap coordinates
    const wrappedX = newX < 0 ? tileCount - 1 : (newX >= tileCount ? 0 : newX);
    const wrappedY = newY < 0 ? tileCount - 1 : (newY >= tileCount ? 0 : newY);
    
    // Calculate Manhattan distance to food
    const distToFood = Math.abs(wrappedX - food.x) + Math.abs(wrappedY - food.y);
    move.priority = -distToFood; // Negative so closer = higher priority
    
    // Check if this move would hit the snake body
    move.safe = !checkCollisionAt(wrappedX, wrappedY);
  });
  
  // Sort by safety first, then by priority (distance to food)
  validMoves.sort((a, b) => {
    if (a.safe !== b.safe) return b.safe - a.safe; // Safe moves first
    return b.priority - a.priority; // Then closest to food
  });
  
  // Choose the best move
  if (validMoves.length > 0 && validMoves[0].safe) {
    dx = validMoves[0].dx;
    dy = validMoves[0].dy;
  } else if (validMoves.length > 0) {
    // If no safe move toward food, take any valid move to survive
    dx = validMoves[0].dx;
    dy = validMoves[0].dy;
  }
}

// Check if a position collides with snake body
function checkCollisionAt(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }
  return false;
}

// Draw everything
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((part, index) => {
    if (index === 0) {
      // Head
      drawSnakePart(part.x, part.y, "#00ff00");
    } else {
      // Body
      drawSnakePart(part.x, part.y, "#00cc00");
    }
  });

  // Draw berry food
  drawBerry(food.x, food.y);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.font = "30px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.font = "16px monospace";
  ctx.fillText(
    "Refresh page to restart",
    canvas.width / 2,
    canvas.height / 2 + 30
  );
}


function drawSnakePart(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(
    x * gridSize,
    y * gridSize,
    gridSize,
    gridSize,
    8
  );
  ctx.fill();
}

function drawBerry(x, y) {
  const centerX = x * gridSize + gridSize / 2;
  const centerY = y * gridSize + gridSize / 2;

  // Berry body
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerX, centerY, gridSize / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Berry leaf
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(centerX + 5, centerY - 5, 4, 0, Math.PI * 2);
  ctx.fill();
}

function checkSelfCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}



// Generate random food (avoid placing on snake)
function randomFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (checkCollisionAt(newFood.x, newFood.y));
  
  return newFood;
}

// Main game loop
function update() {
  if (gameOver) return;

  if (aiMode) aiMove();

  let head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // Screen wrap
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  // 🚨 SELF COLLISION CHECK
  if (checkSelfCollision(head)) {
    gameOver = true;
    drawGameOver();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

// Start game
updateButtonStates(); // Initialize button states
setInterval(update, 200);
