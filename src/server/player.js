import Bullet from "./bullet";
import Util from './util';

export default class Player {
  constructor(socket) {
    this.socket = socket;
    this.setupSocket();
    this.speed = 1;
    this.angle = 0;
    this.radius = 60;
  }

  setupSocket() {
    this.socket.on('keys', (data) => {
      this.pressedRight = data.right;
      this.pressedLeft = data.left;
      this.pressedDown = data.down;
      this.pressedUp = data.up;
    });
    this.socket.on('click', (data) => {
      if (data.fired) {
        this.createBullet();
      }
    });
  }

  createBullet() {
    const bullet = new Bullet(this.socket, this);
    this.game.addBullet(bullet);
  }

  notifyStart(opponent) {
    // Gegner
    this.socket.emit('start', {
      // socket.emit = Sendet Infos von Socket
      // socket.on = Listening for socket events specified with 'start'
      x: this.x,
      y: this.y,
      opponentX: opponent.x,
      opponentY: opponent.y,
    }); // Hier socket sende etwas an den Client -> Können JSON-Objekt übergeben

    this.socket.on('update angle', (data) => {
      this.angle = data.angle;
    });
  }

  notifyStart(opponent) {
    this.socket.emit('start', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      opponentX: opponent.x,
      opponentY: opponent.y,
      opponentAngle: opponent.angle,
    });
  }

  notifyWaiting() {
    this.socket.emit('waiting');
  }

  notifyUpdate(opponent) {
    this.socket.emit('update', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      opponentX: opponent.x,
      opponentY: opponent.y,
      opponentAngle: opponent.angle,
    });
  }

  update() {
    if (this.pressedUp && this.y >= 0 + this.speed + this.radius) {
      this.y -= Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedDown && this.y <= 400 - this.speed - this.radius) {
      this.y += Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedLeft && this.x >= 0 + this.speed + this.radius) {
      this.x -= Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
    if (this.pressedRight && this.x <= 600 - this.speed - this.radius) {
      this.x += Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
  }
}
