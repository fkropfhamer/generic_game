import config from '../../server/config';
import View from './view';

export default class Client {
  constructor(view, assets) {
    this.isWaiting = true;
    this.view = view;
    this.assets = assets;
    this.view.showStartScreen(this.setup.bind(this));
  }

  setup(face, mode) {
    View.hideStartScreen();
    this.setupSocket();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
    this.socket.emit('ready', { face, mode });
  }

  drawPlayer(color, lives, face, x, y, angle, hitAngle, isShielded) {
    this.view.drawImageAtAngle(this.assets[color], x, y, angle, 0.5);
    if (lives < 3) {
      this.view.drawImageAtAngle(this.assets[`${color}${lives}life`], x, y, angle + hitAngle, 0.5);
    }
    this.view.drawImageAtAngle(this.assets[face], x, y, angle, 0.5);
    if (isShielded) {
      this.view.drawRing(x, y, config.PLAYER_RADIUS, color);
    }
  }

  draw() {
    this.view.reset();
    View.showTimer(this.timer);
    this.bullets.forEach((b) => this.view.drawCircle(b.x, b.y, config.BULLET_RADIUS, b.color));

    this.walls.forEach((w) =>
      this.view.drawRectangle(w.x, w.y, w.height, w.width, w.angle, w.fillColor, w.strokeColor)
    );

    this.drawPlayer(
      this.color,
      this.lives,
      this.face,
      this.x,
      this.y,
      this.angle,
      this.hitAngle,
      this.isShielded
    );
    this.drawPlayerIndicator();
    this.otherPlayers.forEach((player) => {
      this.drawPlayer(
        player.color,
        player.lives,
        player.face,
        player.x,
        player.y,
        player.angle,
        player.hitAngle,
        player.isShielded
      );
    });

    this.powerUps.forEach((p) => this.view.drawCircle(p.x, p.y, p.radius, p.color));
    View.updateTeamLiveBar(this.teamLives);
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

  onStart(data) {
    console.log('game starting!');
    if (this.isWaiting) {
      View.hideWaitingScreen();
      this.isWaiting = false;
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
    this.isShielded = data.isShielded;
    this.teamLives = data.teamLives;
    this.powerUps = data.powerUps;
    this.draw();
    this.setupKeyPressedEvents();
  }

  onConnected() {
    console.log('connected');
    this.connected = true;
  }

  onUpdate(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.otherPlayers = data.players;
    this.bullets = data.bullets;
    this.timer = data.timer;
    this.lives = data.lives;
    this.hitAngle = data.hitAngle;
    this.walls = data.walls;
    this.isShielded = data.isShielded;
    this.teamLives = data.teamLives;
    this.powerUps = data.powerUps;
    this.draw();
    this.socket.emit('keyspressed', {
      up: this.pressedUp,
      down: this.pressedDown,
      left: this.pressedLeft,
      right: this.pressedRight,
    });
  }

  onWait(data) {
    console.log('you have to wait!');
    View.showWaitingScreen(data.numberOfPlayers);
    this.isWaiting = true;
  }

  onTimeOver() {
    View.showTimeOverScreen();
    this.isEnded = true;
  }

  onWin() {
    console.log('win');
    View.showWinScreen();
    this.isEnded = true;
  }

  onLose() {
    console.log('lose');
    View.showLoseScreen();
    this.isEnded = true;
  }

  onDeath() {
    console.log('death');
    View.showDeathMessage();
    this.isDead = true;
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', this.onConnected.bind(this));
    this.socket.on('start', this.onStart.bind(this));
    this.socket.on('update', this.onUpdate.bind(this));
    this.socket.on('wait', this.onWait.bind(this));
    this.socket.on('time over', this.onTimeOver.bind(this));
    this.socket.on('win', this.onWin.bind(this));
    this.socket.on('lose', this.onLose.bind(this));
    this.socket.on('death', this.onDeath.bind(this));
  }
}
