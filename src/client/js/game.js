class Game {
  constructor(view, assets) {
    this.view = view;
    this.assets = assets;
    this.setupSocket();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
  }

  drawPlayer(color, lifes, face, x, y, angle) {
    this.view.drawImageAtAngle(this.assets[color], x, y, angle, 0.1);
    if (lifes < 3) {
      this.view.drawImageAtAngle(this.assets[`${color}${lifes}life`], x, y, angle, 0.1);
    }
    this.view.drawImageAtAngle(this.assets[face], x, y, angle, 0.1);
  }

  draw() {
    this.view.reset();
    this.view.showTimer(this.timer);
    this.bullets.forEach((b) => this.view.drawCircle(b.x, b.y, 10, b.color));

    this.drawPlayer(this.color, this.lifes, 'player1', this.x, this.y, this.angle);
    this.drawPlayer(
      this.opponent.color,
      this.opponent.lifes,
      'player4',
      this.opponent.x,
      this.opponent.y,
      this.opponent.angle
    );
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
      this.lifes = data.lifes;
      this.opponent = {
        x: data.opponentX,
        y: data.opponentY,
        angle: data.opponentAngle,
        color: data.opponentColor,
        lifes: data.opponentLifes,
      };
      this.timer = data.timer;
      this.bullets = [];
      this.draw();
      this.setupKeyPressedEvents();
    });
    this.socket.on('update', (data) => {
      console.log('update', data);

      this.x = data.x;
      this.y = data.y;
      this.angle = data.angle;
      this.opponent.x = data.opponentX;
      this.opponent.y = data.opponentY;
      this.opponent.angle = data.opponentAngle;
      this.opponent.lifes = data.opponentLifes;
      this.bullets = data.bullets;
      this.timer = data.timer;
      this.lifes = data.lifes;
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
      this.view.showWinnerScreen();
    });
    this.socket.on('lose', () => {
      this.view.showLoseSreen();
    });
  }
}

export default Game;
