import config from '../../server/config';

class Game {
  constructor(view, assets) {
    this.view = view;
    this.assets = assets;

    this.view.showStartScreen((face) => {
      this.view.hideStartScreen();
      console.log(face);
      this.start();
      this.socket.emit('ready', { face });
    });
  }

  start() {
    this.setupSocket();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
  }

  drawPlayer(color, lives, face, x, y, angle) {
    this.view.drawImageAtAngle(this.assets[color], x, y, angle, 0.5);
    if (lives < 3) {
      this.view.drawImageAtAngle(this.assets[`${color}${lives}life`], x, y, angle, 0.5);
    }
    this.view.drawImageAtAngle(this.assets[face], x, y, angle, 0.5);
  }

  draw() {
    this.view.reset();
    this.view.showTimer(this.timer);
    this.bullets.forEach((b) => this.view.drawCircle(b.x, b.y, config.bulletRadius, b.color));

    this.walls.forEach((w) =>
      this.view.drawRectangle(w.x, w.y, w.height, w.width, w.angle, w.color)
    );
    
    this.drawPlayer(this.color, this.lives, this.face, this.x, this.y, this.angle);
    this.otherPlayers.forEach((player) => {
      this.drawPlayer(player.color, player.lives, player.face, player.x, player.y, player.angle);
    });
  }

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('click', this.shoot.bind(this));
    window.addEventListener('mousemove', (e) => {
      /* const angle = Math.atan2(
        e.clientY - this.view.canvas.offsetTop - this.y,
        e.clientX - this.view.canvas.offsetLeft - this.x
      ); */
      const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
      this.angle = angle;

      this.socket.emit('update angle', { angle });
    });
  }

  calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y1 - this.view.canvas.offsetTop - y2, x1 - this.view.canvas.offsetLeft - x2);
  }

  shoot(e) {
    console.log('shoot', e.clientX, e.clientY);
    const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
    this.angle = angle;
    this.socket.emit('shoot', { angle });
  }

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
      if (this.waiting) {
        this.view.hideWaitingScreen();
        this.waiting = false;
      }

      this.x = data.x;
      this.y = data.y;
      this.angle = data.angle;
      this.color = data.color;
      this.lives = data.lives;
      this.face = data.face;
      this.otherPlayers = data.players;
      this.timer = data.timer;
      this.bullets = [];
      this.walls = data.walls;
      this.draw();
      this.setupKeyPressedEvents();
    });
    this.socket.on('update', (data) => {
      console.log('update', data);

      this.x = data.x;
      this.y = data.y;
      this.angle = data.angle;
      this.otherPlayers = data.players;
      this.bullets = data.bullets;
      this.timer = data.timer;
      this.lives = data.lives;
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
      this.view.showWaitingScreen();
      this.waiting = true;
    });
    this.socket.on('opponent disconnected', () => {
      console.log('opponent disconnected');
      this.view.showOpponentDisconnectedScreen();
    });
    this.socket.on('time over', () => {
      this.view.showTimeOverScreen();
    });
    this.socket.on('win', () => {
      console.log('win');
      this.view.showWinScreen();
    });
    this.socket.on('lose', () => {
      console.log('lose');
      this.view.showLoseScreen();
    });
  }
}

export default Game;
