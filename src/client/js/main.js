import '../css/index.css';
import View from './view';
import life1 from '../img/1 life left.png';
import life2 from '../img/2 lives left.png';
import life3 from '../img/3 lives left.png';
import AssetLoader from './assetLoader';

class Game {
  constructor() {
    this.setupSocket();
    this.view = new View();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
    AssetLoader.loadAssets([
      { name: 'life1', url: life1 },
      { name: 'life2', url: life2 },
      { name: 'life3', url: life3 },
    ]).then((assets) => {
      console.log(assets);
      this.assets = assets;
      this.assetsLoaded = true;
      // this.view.drawCircle(100, 100, 50, 'red');
      this.view.drawImage(100, 100, assets.life1);
    });
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

  /*
  update() {
    this.gameState.x += this.gameState.xSpeed;
    this.gameState.y += this.gameState.ySpeed;
   // console.log(this.gameState);
    this.gameState.bullets.forEach((b) => {
      const x = b.x + b.speed * Math.cos(b.dir);
      const y = b.y + b.speed * Math.sin(b.dir);

      b.x = x;
      b.y = y;
    });
  }
  */

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    // window.addEventListener('click', this.shoot.bind(this));
  }

  /*
  shoot(e) {
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
  }
  */

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
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.pressedLeft = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.pressedRight = false;
    }

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.pressedUp = false;
    }

    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.pressedDown = false;
    }
  }

  setupSocket() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('start', (data) => {
      console.log('game starting!');

      this.x = data.x;
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      // this.opponent.x = data.opponentX;
      // this.opponent.y = data.opponentY;
      this.draw();
    });
    this.socket.on('update', (data) => {
      console.log('update', data);

      this.x = data.x;
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      this.draw();
      this.socket.emit('keys', {
        up: this.pressedUp,
        down: this.pressedDown,
        left: this.pressedLeft,
        right: this.pressedRight,
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
