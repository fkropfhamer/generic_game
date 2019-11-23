import Bullet from "./bullet";

export default class Player {
  constructor(socket) {
    this.socket = socket;
    this.setupSocket();
    this.speed = 1;
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
  }

  notifyWaiting() {
    this.socket.emit('waiting');
  }

  notifyUpdate(opponent) {
    this.socket.emit('update', {
      x: this.x,
      y: this.y,
      opponentX: opponent.x,
      opponentY: opponent.y,
    }); // Hier socket sende etwas an den Client -> Können JSON-Objekt übergeben
  }

  update() {
    if (this.pressedDown) {
      this.y += this.speed;
    }
    if (this.pressedUp) {
      this.y -= this.speed;
    }
    if (this.pressedRight) {
      this.x += this.speed;
    }
    if (this.pressedLeft) {
      this.x -= this.speed;
    }
  }
}
