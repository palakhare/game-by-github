const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;
const BALL_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Paddle control (player follows mouse)
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw functions
function drawRect(x, y, w, h, color = "#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = "#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for(let i=0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 2, i, 4, 20, "#666");
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width/4, 50);
    ctx.fillText(aiScore, 3*canvas.width/4, 50);
}

// Collision detection
function paddleCollision(px, py) {
    return (
        ballX < px + PADDLE_WIDTH &&
        ballX + BALL_SIZE > px &&
        ballY < py + PADDLE_HEIGHT &&
        ballY + BALL_SIZE > py
    );
}

// Game update
function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball collision with top & bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVelY = -ballVelY;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Ball collision with player paddle
    if (paddleCollision(PLAYER_X, playerY)) {
        ballVelX = Math.abs(ballVelX); // go right
        // Add some vertical velocity based on where it hit
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        ballVelY = BALL_SPEED * collidePoint;
    }

    // Ball collision with AI paddle
    if (paddleCollision(AI_X, aiY)) {
        ballVelX = -Math.abs(ballVelX); // go left
        // Add some vertical velocity based on where it hit
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        ballVelY = BALL_SPEED * collidePoint;
    }

    // Score update
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI: move paddle toward ball
    if (aiY + PADDLE_HEIGHT / 2 < ballY + BALL_SIZE / 2) {
        aiY += AI_SPEED;
    } else if (aiY + PADDLE_HEIGHT / 2 > ballY + BALL_SIZE / 2) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    // Logic
    update();

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player paddle
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI paddle
    drawBall(ballX, ballY, BALL_SIZE);
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();
