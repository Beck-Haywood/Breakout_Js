/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

// --------------------------------------------------------------
// Constants
// --------------------------------------------------------------

// DOM references
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

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
const fontDefault = '16px Arial';

// **************************************************************
// Classes
// **************************************************************
class Sprite {
  constructor(x = 0, y = 0, dx, dy, width = 10, height = 10, color = objectColor) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Ball extends Sprite {
  constructor(x, y, dx = 2, dy = -1, radius = ballRadius, color) {
    super(x, y, dx, dy, 0, 0, color);
    this.radius = radius;
  }
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Brick extends Sprite {
  constructor(
    x,
    y,
    color = objectColor,
    width = brickWidth,
    height = brickHeight,
  ) {
    super(x, y, 0, 0, width, height, color);
    this.status = 1;
  }
}

class Bricks {
  constructor(rows = brickRowCount, columns = brickColumnCount) {
    this.rows = rows;
    this.columns = columns;
    this.bricks = [];
    this.init();
  }
  init() {
    for (let c = 0; c < this.columns; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY);
      }
    }
  }
  getBrick(c, r) {
      return this.bricks[c][r];
  }
  render(ctx) {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        if (this.bricks[c][r].status === 1) {
          this.bricks[c][r].render(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks();

class Paddle extends Sprite {
  constructor(x = 0, y = canvasHeight - paddleHeight, color = objectColor, width = paddleWidth, height = paddleHeight) {
    super(x, y, 0, 0, width, height, color);
  }
  move() {
    // Check for arrow keys
    if (rightPressed && paddle.x < canvasWidth - this.width) {
        paddle.x += 7;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }
  }
}

class Background {
  constructor(color) {
    this.color = color;
  }
  render(ctx) {}
}

class Score extends Sprite {
  constructor(x, y, color = objectColor, score = 0, font = fontDefault) {
    super(x, y, 0, 0, 0, 0, color);
    this.score = score;
    this.font = font;
  }
  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, 8, 20);
  }
}

class Lives extends Sprite {
  constructor(x, y, font = fontDefault, color = objectColor, lives = 3) {
    super(x, y, 0, 0, 0, 0, color);
    this.font = font;
    this.lives = lives;
  }
  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Lives: ${this.lives}`, canvasWidth - 65, 20);
  }
}
//   draw(canvasContext) {
//     canvasContext.beginPath();
//     canvasContext.arc(this.x, this.y, this.radius, 0, PI2);
//     canvasContext.fillStyle = objectColor;
//     canvasContext.fill();
//     canvasContext.closePath();
//   },
// };

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

// Initilize intances
const ball = new Ball();
const paddle = new Paddle(paddleXStart);
let score = new Score();
let lives = new Lives();

resetBallAndPaddle();

let rightPressed = false;
let leftPressed = false;

// **************************************************************
// Functions
// **************************************************************

function collisionDetection() {
  for (let c = 0; c < bricks.columns; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const brick = bricks.getBrick(c, r);
      if (brick.status === 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brick.width &&
          ball.y > brick.y &&
          ball.y < brick.y + brick.height
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score.score += 1;
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

function resetBallAndPaddle() {
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddle.x = paddleXStart;
}

function movePaddle() {
  // Check for arrow keys
  if (rightPressed && paddle.x < canvasWidth - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }
}

function collisionsWithCanvasAndPaddle() {
  // Bounce the ball off the left and right of the canvas
  if (
    ball.x + ball.dx > canvasWidth - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ball.radius) {
    // hit the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvasHeight - ball.radius) {
    // hit the bottom
    if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
      // Hit the paddle
      ball.dy = -ball.dy;
    } else {
      // Lose a life
      lives.lives -= 1;
      if (!lives.lives) {
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

// --------------------------------------------------------------
// Game Loop
// --------------------------------------------------------------

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Call helper functions
  bricks.render(ctx);
  ball.render(ctx);
  paddle.render(ctx);
  score.render(ctx);
  lives.render(ctx);
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
    paddle.x = relativeX - paddleWidth / 2;
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
