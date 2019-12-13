import config from '../../server/config';

class Game {
  constructor(view, assets) {
    this.view = view;
    this.assets = assets;

    this.view.showStartScreen((face, mode) => {
      this.view.hideStartScreen();
      this.setup();
      this.socket.emit('ready', { face, mode });
    });
  }

  setup() {
    this.setupSocket();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
  }

  drawPlayer(color, lives, face, x, y, angle, hitAngle) {
    this.view.drawImageAtAngle(this.assets[color], x, y, angle, 0.5);
    if (lives < 3) {
      this.view.drawImageAtAngle(this.assets[`${color}${lives}life`], x, y, angle + hitAngle, 0.5);
    }
    this.view.drawImageAtAngle(this.assets[face], x, y, angle, 0.5);
  }

  draw() {
    this.view.reset();
    this.view.showTimer(this.timer);
    this.bullets.forEach((b) => this.view.drawCircle(b.x, b.y, config.bulletRadius, b.color));

    this.walls.forEach((w) =>
      this.view.drawRectangle(w.x, w.y, w.height, w.width, w.angle, w.fillColor, w.strokeColor)
    );

    this.drawPlayer(this.color, this.lives, this.face, this.x, this.y, this.angle, this.hitAngle);
    this.drawPlayerIndicator();
    this.displayPlayerColorInfo();
    this.otherPlayers.forEach((player) => {
      this.drawPlayer(
        player.color,
        player.lives,
        player.face,
        player.x,
        player.y,
        player.angle,
        player.hitAngle
      );
    });
  }

  drawPlayerIndicator() {
    this.view.drawPlayerIndicator(this.x, this.y);
  }

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('click', this.shoot.bind(this));
    window.addEventListener('mousemove', this.mouseMove.bind(this));
  }

  mouseMove(e) {
    const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
    this.angle = angle;

    this.socket.emit('update angle', { angle });
  }

  displayPlayerColorInfo() {
    const displayTimeColorInfoUntil = 50;
    if (!this.view.playerColorInfo) {
      if (this.timer <= displayTimeColorInfoUntil) {
        this.view.hidePlayerColorInfo();
      } else {
        this.view.showPlayerColorInfo(this.color);
      }
    } else if (this.timer <= displayTimeColorInfoUntil) {
      this.view.hidePlayerColorInfo();
    }
  }

  calculateAngle(x1, y1, x2, y2) {
    const scaledx2 = x2 * this.view.scale;
    const scaledy2 = y2 * this.view.scale;
    return Math.atan2(
      y1 - this.view.canvas.offsetTop - scaledy2,
      x1 - this.view.canvas.offsetLeft - scaledx2
    );
  }

  shoot(e) {
    console.log('shoot', e.clientX, e.clientY);
    const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
    this.angle = angle;
    this.socket.emit('shoot', { angle });
  }

  keyPressed(e) {
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.pressedDown = true;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.pressedUp = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.pressedRight = true;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.pressedLeft = true;
    }
  }

  keyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.pressedLeft = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.pressedRight = false;
    }

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.pressedUp = false;
    }

    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.pressedDown = false;
    }
  }

  start(data) {
    console.log('game starting!');
    if (this.waiting) {
      this.view.hideWaitingScreen();
      this.waiting = false;
    }

    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.color = data.color;
    this.lives = data.lives;
    this.face = data.face;
    this.otherPlayers = data.players;
    this.timer = data.timer;
    this.bullets = [];
    this.walls = data.walls;
    this.draw();
    this.setupKeyPressedEvents();
  }

  connected() {
    console.log('connected');
    this.connected = true;
  }

  update(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.otherPlayers = data.players;
    this.bullets = data.bullets;
    this.timer = data.timer;
    this.lives = data.lives;
    this.hitAngle = data.hitAngle;
    this.walls = data.walls;
    this.draw();
    this.socket.emit('keys', {
      up: this.pressedUp,
      down: this.pressedDown,
      left: this.pressedLeft,
      right: this.pressedRight,
    });
  }

  waiting(data) {
    console.log('you have to wait!');
    this.view.showWaitingScreen(data.numberOfPlayers);
    this.waiting = true;
  }

  opponentDisconnected() {
    console.log('opponent disconnected');
    this.view.showOpponentDisconnectedScreen();
  }

  timeOver() {
    this.view.showTimeOverScreen();
  }

  win() {
    console.log('win');
    this.view.showWinScreen();
  }

  lose() {
    console.log('lose');
    this.view.showLoseScreen();
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', this.connected.bind(this));
    this.socket.on('start', this.start.bind(this));
    this.socket.on('update', this.update.bind(this));
    this.socket.on('waiting', this.waiting.bind(this));
    this.socket.on('opponent disconnected', this.opponentDisconnected.bind(this));
    this.socket.on('time over', this.timeOver.bind(this));
    this.socket.on('win', this.win.bind(this));
    this.socket.on('lose', this.lose.bind(this));
  }
}

export default Game;
