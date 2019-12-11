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
    this.shootingCount = 0;
  }

  setupSocket() {
    this.socket.on('keys', (data) => {
      this.pressedRight = data.right;
      this.pressedLeft = data.left;
      this.pressedDown = data.down;
      this.pressedUp = data.up;
    });
    this.socket.on('shoot', (data) => {
      if (this.shootingCount === 0) {
        this.angle = data.angle;
        this.createBullet();
        this.shootingCount = config.shootingRate;
      }
    });
    this.socket.on('update angle', (data) => {
      this.angle = data.angle;
    });
    this.socket.on('disconnect', () => {
      if (this.waiting && this.mode === 'normal') {
        this.gameHandler.waitingPlayer = false;
      } else if (this.waiting && this.mode === 'teams') {
        this.gameHandler.waitingPlayers = this.gameHandler.waitingPlayers.filter(
          (player) => !Object.is(player, this)
        );
        console.log(this.gameHandler.waitingPlayers.length);
      } else if (typeof this.game !== 'undefined') {
        this.game.playerDisconnected(this);
      }
    });
    this.socket.on('ready', (data) => {
      this.face = data.face;
      this.mode = data.mode;
      this.gameHandler.playerIsReady(this, data.mode);
    });
  }

  createBullet() {
    const bullet = new Bullet(this);
    this.game.addBullet(bullet);
  }

  notifyStart(otherPlayers, timer, walls) {
    const mappedPlayers = Util.mapPlayers(otherPlayers);
    this.socket.emit('start', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      color: this.color,
      lives: this.lives,
      face: this.face,
      players: mappedPlayers,
      timer,
      walls,
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
      lives: this.lives,
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

  notifyWin() {
    this.socket.emit('win');
  }

  notifyLose() {
    this.socket.emit('lose');
  }

  update() {
    if (this.shootingCount > 0) this.shootingCount -= 1;

    if (this.pressedUp) {
      this.y -= Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedDown) {
      this.y += Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedLeft) {
      this.x -= Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
    if (this.pressedRight) {
      this.x += Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }

    if (this.x > config.fieldWidth - this.radius) {
      this.x = config.fieldWidth - this.radius;
    }

    if (this.x < 0 + this.radius) {
      this.x = 0 + this.radius;
    }

    if (this.y > config.fieldHeight - this.radius) {
      this.y = config.fieldHeight - this.radius;
    }

    if (this.y < 0 + this.radius) {
      this.y = 0 + this.radius;
    }
  }
}
