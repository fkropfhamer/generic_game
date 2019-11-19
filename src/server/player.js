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
  }

  notifyStart(opponent) {
    this.socket.emit('start', {
      x: this.x,
      y: this.y,
      opponentX: opponent.x,
      opponentY: opponent.y,
    });
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
    });
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
