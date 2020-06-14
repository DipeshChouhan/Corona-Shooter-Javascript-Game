var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var hitSound = new Audio();
hitSound.src = "./sounds/sfx_hit.wav";
canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener("resize", function (event) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
var distance = function (x, y, x1, y1) {
  return (x - x1) * (x - x1) + (y - y1) * (y - y1);
};
var score = 0;
var level = 1;
var Player = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 200,
  w: 20,
  dx: 0,
  h: 40,
  draw: function () {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.w, this.y + this.h);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.closePath();
    ctx.stroke();
  },
  update: function () {
    this.draw();
    this.x += this.dx;
  },
};
var bulletVelocity = 2;
var Bullet = function (x, y) {
  this.dx = 1;
  this.x = x;
  this.y = y;
};
var bullets = [];
Bullet.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
  ctx.stroke();
};
Bullet.prototype.update = function (viruses) {
  this.draw();
  this.dx += 0.2;
  this.y -= this.dx;
  for (var i = 0; i < viruses.length; i++) {
    var virus = viruses[i];
    if (distance(virus.cx, virus.cy, this.x, this.y) <= virus.r * virus.r) {
      // collision between virus and bullet;

      hitSound.play();
      bullets.splice(i, 1);
      viruses.splice(i, 1);
      score++;
    }
  }
  if (this.y - 1.5 <= 0) {
    bullets.shift();
  }
};
addEventListener("click", function (event) {
  bullets.push(new Bullet(Player.x, Player.y));
});
var viruses = [];

const Corona = {
  v: 0.05,
  draw: function () {
    for (var i = 0; i < viruses.length; i++) {
      var virus = viruses[i];
      ctx.beginPath();
      ctx.arc(virus.cx, virus.cy, virus.r, 0, Math.PI * 2, false);
      ctx.stroke();
    }
  },
  update: function () {
    this.draw();
    for (var i = 0; i < viruses.length; i++) {
      var virus = viruses[i];
      if (virus.cy >= canvas.height - virus.r) {
        viruses.shift();
        console.log("shift");
      }
      virus.dx += this.v;
      virus.cy += virus.dx;
    }
  },
};
var ScoreBoard = {
  draw: function () {
    ctx.font = "10px serif";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 20);
    ctx.fillText(`Level: ${level}`, 10, 20);
  },
};
var n = 60;
var intervalId = setInterval(function () {
  if (Corona.v < 1) {
    Corona.v += 0.01;
    level++;
    n -= 5;
  }
}, 20000);

function initCoronas(x, r) {
  viruses.push({ cx: x, cy: -40, r: r, dx: 0 });
}

addEventListener("mousemove", function (event) {
  if (event.x + Player.w <= canvas.width && event.x - Player.w >= 0) {
    Player.x = event.x;
  }
});

var i;
var frames = 0;
function gameLoop() {
  frames++;
  if (!(frames % n)) {
    var r = Math.floor(Math.random() * 20) + 15;
    var x = Math.floor(Math.random() * (canvas.width - 60)) + 30;
    initCoronas(x, r);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ScoreBoard.draw();
  Player.update();

  for (i = 0; i < bullets.length; i++) {
    bullets[i].update(viruses);
  }
  Corona.update();
  requestAnimationFrame(gameLoop);
}
gameLoop();
