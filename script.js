// **************************************************************
// DOM references
// **************************************************************

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// **************************************************************
// Variables
// **************************************************************

// --------------------------------------------------------------
// Constants
// --------------------------------------------------------------

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const paddleXStart = (canvasWidth - paddleWidth) / 2;
const PI2 = Math.PI * 2;
const objectColor = '#0095DD';
const gameOverMessage = 'Game Over';
const gameWonMessage = 'YOU WIN, CONGRATULATIONS!';
const font = '16px Arial';
const ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  radius: ballRadius,
  move() {
    this.x += this.dx;
    this.y += this.dy;
  },
  draw(canvasContext) {
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, PI2);
    canvasContext.fillStyle = objectColor;
    canvasContext.fill();
    canvasContext.closePath();
  },
};
//

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

let paddleX;

resetBallAndPaddle();

let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;

// --------------------------------------------------------------
// Setup Bricks Array
// --------------------------------------------------------------

const bricks = [];

setupBricks();

// **************************************************************
// Functions
// **************************************************************

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objectColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        // **** This block should really be part of the brick initialization
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = objectColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ball.x > brick.x && ball.x < brick.x + brickWidth
          && ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert(gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = font;
  ctx.fillStyle = objectColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = font;
  ctx.fillStyle = objectColor;
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
}

function resetBallAndPaddle() {
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

function movePaddle() {
  // Check for arrow keys
  if (rightPressed && paddleX < canvasWidth - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function collisionsWithCanvasAndPaddle() {
  // Bounce the ball off the left and right of the canvas
  if (ball.x + ball.dx > canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ball.radius) {
    // hit the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvasHeight - ball.radius) {
    // hit the bottom
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      // Hit the paddle
      ball.dy = -ball.dy;
    } else {
      // Lose a life
      lives -= 1;
      if (!lives) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert(gameOverMessage);
        ball.x = 200;
        ball.y = 200;
        document.location.reload();
      } else {
        // Start the over you hit the bottom
        resetBallAndPaddle();
      }
    }
  }
}

function setupBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
      };
    }
  }
}

// --------------------------------------------------------------
// Game Loop
// --------------------------------------------------------------

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Call helper functions
  drawBricks();
  ball.draw(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  ball.move();
  movePaddle();
  collisionsWithCanvasAndPaddle();

  // Draw the screen again
  requestAnimationFrame(draw);
}

// --------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// **************************************************************
// Register Events
// **************************************************************

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// **************************************************************
// Starts program entry point
// **************************************************************

draw();


/* CLASS Ball {
  contructor() {
    this.x = 0
    this.y = 0
    this dy = 2
    this.radius = 10
  }
  const ball = new Ball()

}

class Brick() {
  contructor(x, y, color = 'orange') {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.color = color;
    this.width = brickWidth
    this.height = brickHeight
  }
  depenceny injection
  render(ctx) {
    ctx.beginPath()
    xtx.rect(this.x, this.y, this.width, this.height)
  }
}


*/