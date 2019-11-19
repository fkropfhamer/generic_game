export default class Player {
  constructor(socket) {
    this.socket = socket;
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
    this.socket.emit('update');
  }
}
