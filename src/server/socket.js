import io from 'socket.io';
import server from './server';
import Player from './player';
// eslint-disable-next-line import/no-named-as-default
import Game from './game';

class Socket {
  constructor() {
    // this.games = [];
    this.waitingPlayer = null;
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
      const player = new Player(socket);
      if (!this.waitingPlayer) {
        this.waitingpPlayer = player;
        player.notifyWaiting(); // Du musst auf Gegenspieler warten
      } else {
        const game = new Game(this.waitingPlayer, player); // dem Spiel die beiden Spieler übergeben
        game.start();
      }
    });
  }
}

export default Socket;
