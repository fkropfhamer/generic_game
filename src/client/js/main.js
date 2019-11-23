import '../css/index.css';
import View from './view';

class Game {
  constructor() {
    this.setupSocket();
    this.view = new View();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
    this.mouseDown = false;
    this.mouseUp = false;
    this.setupKeyPressedEvents();
    // setInterval(this.loop.bind(this), 50);
  }

  draw() {
    this.view.reset();
    this.view.drawCircle(this.x, this.y, 25, 'blue');
    this.view.drawCircle(this.opponent.x, this.opponent.y, 25, 'red'); // ich selbst bin immer Rot und der Gegner sieht sich selbst auch als roter Punkt
    // this.gameState.bullets.forEach((b) => {
    //  this.view.drawCircle(b.x, b.y, 20, 'blue');
    // });
  }

  /* update() {
    this.gameState.x += this.gameState.xSpeed;
    this.gameState.y += this.gameState.ySpeed;
    this.gameState.bullets.forEach((b) => {
      const x = b.x + b.speed * Math.cos(b.dir);
      const y = b.y + b.speed * Math.sin(b.dir);

      b.x = x;
      b.y = y;
    });
  } */

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('click', this.shoot.bind(this));
  }

  /* shoot(e) {
    const dir = Math.atan2(
      e.clientY - this.view.canvas.offsetTop - this.gameState.y,
      e.clientX - this.view.canvas.offsetLeft - this.gameState.x
    );

    this.gameState.bullets.push({
      x: this.gameState.x,
      y: this.gameState.y,
      dir,
      speed: 20,
    });
  } */

  keyPressed(e) {
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.pressedDown = true;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.pressedUp = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.pressedRight = true;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.pressedLeft = true;
    }
  }

  keyUp(e) {
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.pressedDown = false;
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.pressedUp = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.pressedRight = false;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.pressedLeft = false;
    }
  }

  shoot() {
    this.fired = true;
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('start', (data) => {
      // Empfängt man dann in socket.notifyStart()
      console.log('game starting!');

      this.x = data.x; // Das Objekt in notify start, welches wir emiten im Socket
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      this.draw();
    });
    this.socket.on('update', (data) => {
      console.log('update');
      this.x = data.x;
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      this.fired = this.mouseUp;
      this.draw();
      this.socket.emit('keys', {
        // Checken, welche Taste gedrückt ist
        up: this.pressedUp,
        down: this.pressedDown,
        left: this.pressedLeft,
        right: this.pressedRight,
      });
      this.socket.emit('mouse', {
        mouseUp: this.mouseUp,
      });
    });
    this.socket.on('waiting', () => {
      console.log('you must wait!');
    });
  }
}

const init = () => {
  // eslint-disable-next-line no-new
  new Game();
};

window.onload = init();
