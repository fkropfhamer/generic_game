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

  draw() {
    this.view.reset();
    this.view.drawImageAtAngle(this.assets.life1, this.x, this.y, this.dir, 0.1);
    this.view.drawImageAtAngle(this.assets.player1, this.x, this.y, this.dir, 0.1);
    // this.view.drawCircle(this.x, this.y, 25, 'blue');
    this.view.drawCircle(this.opponent.x, this.opponent.y, 25, 'red');

    // this.gameState.bullets.forEach((b) => {
    //  this.view.drawCircle(b.x, b.y, 5, 'blue');
    // });
  }

  setupKeyPressedEvents() {
    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('click', this.shoot.bind(this));
    window.addEventListener('mousemove', (e) => {
      const dir = Math.atan2(
        e.clientY - this.view.canvas.offsetTop - this.y,
        e.clientX - this.view.canvas.offsetLeft - this.x
      );
        this.dir = dir;
  
      // Math.atan()
      // this.socket.
    });
  }

  shoot(e) {
    console.log('shoot', e.clientX, e.clientY);
    this.socket.emit('shoot');
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

      this.x = data.x;
      this.y = data.y;
      this.opponent = { x: data.opponentX, y: data.opponentY };
      // this.opponent.x = data.opponentX;
      // this.opponent.y = data.opponentY;
      this.draw();
      this.setupKeyPressedEvents();
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

export default Game;
