export default class Player {
  constructor(socket) {
    this.socket = socket;
    this.setupSocket();
    this.speed = 1;
    this.angle = 0;
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
    if (this.pressedDown && this.pressedRight) {
      this.angle = Math.PI / 4;
    } else if (this.pressedDown && this.pressedLeft) {
      this.angle = (Math.PI * 3) / 4;
    } else if (this.pressedUp && this.pressedRight) {
      this.angle = -Math.PI / 4;
    } else if (this.pressedUp && this.pressedLeft) {
      this.angle = -(Math.PI * 3) / 4;
    } else if (this.pressedDown && !this.pressedLeft && !this.pressedRight) {
      this.angle = +Math.PI / 2;
    } else if (this.pressedUp && !this.pressedLeft && !this.pressedRight) {
      this.angle = -Math.PI / 2;
    } else if (this.pressedRight && !this.pressedUp && !this.pressedDown) {
      this.angle = 0;
    } else if (this.pressedLeft && !this.pressedUp && !this.pressedDown) {
      this.angle = Math.PI;
    }

    if (this.pressedLeft || this.pressedUp || this.pressedDown || this.pressedRight) {
      this.y += Math.sin(this.angle) * this.speed;
      this.x += Math.cos(this.angle) * this.speed;
    }
  }
}
