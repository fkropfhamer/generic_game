import io from 'socket.io';
import server from './server';
import Player from './player';
import Game from './game';

class Socket {
  constructor() {
    // this.games = [];
    this.waitingPlayer = false;
  }

  listen(port) {
    this.server = server.listen(port);
    this.io = io(this.server);
    this.setup();
  }

  setup() {
    this.io.on('connection', (socket) => {
      console.log('user connected');
      const player = new Player(socket);
      if (!this.waitingPlayer) {
        this.waitingPlayer = player;
        player.notifyWaiting();
      } else {
        const game = new Game(this.waitingPlayer, player);
        game.start();
      }
    });
  }
}

export default Socket;
