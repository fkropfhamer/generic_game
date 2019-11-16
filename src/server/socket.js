import io from 'socket.io';
import server from './server';

class Socket {
  constructor() {
    this.games = [];
  }

  listen(port) {
    this.server = server.listen(port);
    this.io = io(this.server);
    this.setup();
  }

  setup() {
    this.io.on('connection', (socket) => {
      console.log('user connected');
      socket.on('start', (data) => {
        console.log('start');
        this.start(socket, data.name);
      });
    });
  }
}

export default Socket;
