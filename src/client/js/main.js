import '../css/index.css';
import './player';

class Game {
  constructor() {
    this.setupSocket();
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected');
    });
  }
}

const init = () => {
  // eslint-disable-next-line no-new
  new Game();
};

window.onload = init();
