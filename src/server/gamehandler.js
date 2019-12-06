import io from 'socket.io';
import server from './server';
import Player from './player';
import Game from './game';

class GameHandler {
  constructor() {
    this.waitingPlayer = false;
    this.waitingPlayers = [];
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
      // eslint-disable-next-line no-new
      new Player(socket, this);
    });
  }

  playerIsReady(player, mode) {
    if (mode === 'normal') {
      if (!this.waitingPlayer) {
        this.waitingPlayer = player;
        player.notifyWaiting();
        console.log('player is waiting');
      } else {
        const game = new Game([this.waitingPlayer, player]);
        game.start();
        console.log('game ist starting');
        this.waitingPlayer = false;
      }
    } else if (mode === 'teams') {
      if (this.waitingPlayers.length === 3) {
        const game = new Game([player, ...this.waitingPlayers]);
        game.start();
        this.waitingPlayers = [];
      } else {
        this.waitingPlayers.push(player);
        player.notifyWaiting();
      }
    }
  }
}

export default GameHandler;
