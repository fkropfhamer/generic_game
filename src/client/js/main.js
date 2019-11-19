import '../css/index.css';
import View from './view';

class Game {
  constructor() {
    this.setupSocket();
    this.view = new View();

    this.setupKeyPressedEvents();
   // setInterval(this.loop.bind(this), 50);
  }

  draw() {
    this.view.reset();
    this.view.drawCircle(this.x, this.y, 25, 'blue');
    this.view.drawCircle(this.opponent.x, this.opponent.y, 25, 'red');

    // this.gameState.bullets.forEach((b) => {
    //  this.view.drawCircle(b.x, b.y, 5, 'blue');
    // });
  }

  /*update() {
    this.gameState.x += this.gameState.xSpeed;
    this.gameState.y += this.gameState.ySpeed;
   // console.log(this.gameState);
    this.gameState.bullets.forEach((b) => {
      const x = b.x + b.speed * Math.cos(b.dir);
      const y = b.y + b.speed * Math.sin(b.dir);

      b.x = x;
      b.y = y;
    });
  }*/

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('click', this.shoot.bind(this));
  }

  /*shoot(e) {
   // console.log(e.clientX, e.clientY);
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
  }*/

  keyPressed(e) {
   // console.log('keydown', e);
    if (this.gameState.ySpeed === 0) {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        // this.sendUpdate(this.y + 50);
        this.gameState.ySpeed = 10;
        // this.update();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        // this.sendUpdate(this.y - 50);
        this.gameState.ySpeed = -10;
        // this.update();
      }
    }
    if (this.gameState.xSpeed === 0) {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        // this.sendUpdate(this.y + 50);
        this.gameState.xSpeed = 10;
        // this.update();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        // this.sendUpdate(this.y - 50);
        this.gameState.xSpeed = -10;
        // this.update();
      }
    }
  }

  keyUp(e) {
    // eslint-disable-next-line prettier/prettier
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyA' || e.code === 'KeyD') {
  //    console.log('y');
      this.gameState.xSpeed = 0;
    }
 //   console.log('keyup', e);
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyW') {
      this.gameState.ySpeed = 0;
    }
  }

  loop() {
    this.draw();
    this.update();
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('start', (data) => {
      console.log('game starting!')

      this.x = data.x;
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      //this.opponent.x = data.opponentX;
      //this.opponent.y = data.opponentY;
      this.draw();

    });
    this.socket.on('waiting', () => {console.log('you must wait!')});
  }
}

const init = () => {
  // eslint-disable-next-line no-new
  new Game();
};

window.onload = init();
