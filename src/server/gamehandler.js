import io from 'socket.io';
import server from './server';
import Player from './player';
import Game from './game';

class GameHandler {
  constructor() {
    this.waitingPlayer = false;
  }

  listen(port) {
    this.server = server.listen(port);
    this.io = io(this.server); // Mache Websocket auf
    this.setup(); // Config den Websocket
  }

  // Öffnet den Websocket
  setup() {
    this.io.on('connection', (socket) => {
      // wenn sich jemand connected -> Dann erstelle einen neuen Player
      console.log('user connected');
      const player = new Player(socket, this);
      if (!this.waitingPlayer) {
        this.waitingPlayer = player;
        player.notifyWaiting();
        console.log('player is waiting');
      } else {
        const game = new Game(this.waitingPlayer, player);
        game.start();
        console.log('game ist starting');
        this.waitingPlayer = false;
      }
    });
  }
}

export default GameHandler;
