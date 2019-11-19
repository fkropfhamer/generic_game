export default class Player {
  constructor(socket) {
    this.socket = socket;
  }

  notifyStart() {
    this.socket.emit('start', {});
  }

  notifyWaiting() {
    this.socket.emit('waiting', {});
  }
}
