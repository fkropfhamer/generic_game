import Bullet from './bullet';
import Util from './util';
import config from './config';

export default class Player {
  constructor(socket, gameHandler) {
    this.socket = socket;
    this.gameHandler = gameHandler;
    this.setupSocket();
    this.speed = config.playerSpeed;
    this.angle = 0;
    this.radius = config.playerRadius;
  }

  setupSocket() {
    this.socket.on('keys', (data) => {
      this.pressedRight = data.right;
      this.pressedLeft = data.left;
      this.pressedDown = data.down;
      this.pressedUp = data.up;
    });
    this.socket.on('shoot', (data) => {
      this.angle = data.angle;
      this.createBullet();
    });
    this.socket.on('update angle', (data) => {
      this.angle = data.angle;
    });
    this.socket.on('disconnect', () => {
      if (this.waiting) {
        this.gameHandler.waitingPlayer = false;
      } else if (typeof this.game !== 'undefined') {
        this.game.playerDisconnected(this);
      }
    });
    this.socket.on('ready', (data) => {
      this.face = data.face;
      this.gameHandler.playerIsReady(this, data.mode);
    });
  }

  createBullet() {
    const bullet = new Bullet(this);
    this.game.addBullet(bullet);
  }

  notifyStart(otherPlayers, timer) {
    const mappedPlayers = Util.mapPlayers(otherPlayers);
    this.socket.emit('start', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      color: this.color,
      lifes: this.lifes,
      face: this.face,
      players: mappedPlayers,
      timer,
    });
  }

  notifyWaiting() {
    this.waiting = true;
    this.socket.emit('waiting');
  }

  notifyUpdate(players, bullets, timer) {
    const mappedPlayers = Util.mapPlayers(players);
    this.socket.emit('update', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      lifes: this.lifes,
      players: mappedPlayers,
      bullets,
      timer,
    });
  }

  notifyOpponentDisconnected() {
    this.socket.emit('opponent disconnected');
  }

  notifyTimeOver() {
    this.socket.emit('time over');
  }

  update() {
    if (this.pressedUp && this.y >= 0 + this.speed + this.radius) {
      this.y -= Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedDown && this.y <= config.fieldHeigth - this.speed - this.radius) {
      this.y += Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedLeft && this.x >= 0 + this.speed + this.radius) {
      this.x -= Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
    if (this.pressedRight && this.x <= config.fieldWidth - this.speed - this.radius) {
      this.x += Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
  }
}
