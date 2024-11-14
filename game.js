const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false
};

let obstacles = [];
let obstacleInterval = 1000;
let lastObstacleTime = 0;
let score = 0;
let gameOver = false;

// Spieler springen lassen
function jump() {
    if (!player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
}

// Spiel-Logik aktualisieren
function update() {
    if (gameOver) return;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y >= 150) {
        player.y = 150;
        player.isJumping = false;
    }

    if (Date.now() - lastObstacleTime > obstacleInterval) {
        obstacles.push({ x: canvas.width, y: 170, width: 20, height: 30 });
        lastObstacleTime = Date.now();
    }

    obstacles = obstacles.map(obstacle => {
        obstacle.x -= 3;
        return obstacle;
    }).filter(obstacle => obstacle.x + obstacle.width > 0);

    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    score++;
}

// Spiel-Canvas zeichnen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "#888";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Spiel-Schleife
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Steuerung hinzufügen
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Spiel starten
gameLoop();
