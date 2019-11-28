// import config from '../../server/config';

class View {
  constructor() {
    this.scale = 1;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.color = '#232529';

    this.setupCanvas();

    this.ctx = this.canvas.getContext('2d');
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.style.backgroundColor = this.color;
    document.getElementById('root').appendChild(this.canvas);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawImage(x, y, img) {
    console.log(img, img.width, img.height);
    this.ctx.drawImage(img, 0, 0);
  }

  reset() {
    this.ctx.fillStyle = this.color;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawImageAtAngle(image, x, y, angle, scale = 1) {
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    this.ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    this.ctx.restore();
  }

  showTimer(timer) {
    if (!this.timerDisplay) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '25%';
      div.style.top = '75%';

      const timerDisplay = document.createElement('h1');

      timerDisplay.innerHTML = `${timer}`;

      div.appendChild(timerDisplay);

      document.getElementById('root').appendChild(div);

      this.timerDisplay = timerDisplay;
    } else if (timer.toString() !== this.timerDisplay.innerHTML) {
      this.timerDisplay.innerHTML = `${timer}`;
    }
  }

  showWaitingScreen() {
    const waitingScreen = document.createElement('div');
    waitingScreen.style.backgroundColor = 'white';
    waitingScreen.style.position = 'absolute';
    waitingScreen.style.left = '25%';
    waitingScreen.style.top = '25%';
    waitingScreen.style.width = `${this.width / 2}px`;
    waitingScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'You have to wait for another player!';

    waitingScreen.appendChild(heading);

    document.getElementById('root').appendChild(waitingScreen);

    this.waitingScreen = waitingScreen;
  }

  hideWaitingScreen() {
    if (this.waitingScreen) {
      this.waitingScreen.style.display = 'none';
    }
  }

  showEndScreen() {
    const endScreen = document.createElement('div');
    endScreen.style.backgroundColor = 'red';
    endScreen.style.position = 'absolute';
    endScreen.style.left = '25%';
    endScreen.style.top = '25%';
    endScreen.style.width = `${this.width / 2}px`;
    endScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'The Game has ended!';

    endScreen.appendChild(heading);

    document.getElementById('root').appendChild(endScreen);

    this.endScreen = endScreen;
  }

  hideEndScreen() {
    if (this.endScreen) {
      this.endScreen.style.display = 'none';
    }
  }

  showOpponentDisconnectedScreen() {
    const disconnectedScreen = document.createElement('div');
    disconnectedScreen.style.backgroundColor = 'green';
    disconnectedScreen.style.position = 'absolute';
    disconnectedScreen.style.left = '25%';
    disconnectedScreen.style.top = '25%';
    disconnectedScreen.style.width = `${this.width / 2}px`;
    disconnectedScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'Your Opponent disconnected';

    disconnectedScreen.appendChild(heading);

    document.getElementById('root').appendChild(disconnectedScreen);

    this.disconnectedScreen = disconnectedScreen;
  }

  showTimeOverScreen() {
    const timeOverScreen = document.createElement('div');
    timeOverScreen.style.backgroundColor = 'blue';
    timeOverScreen.style.position = 'absolute';
    timeOverScreen.style.left = '25%';
    timeOverScreen.style.top = '25%';
    timeOverScreen.style.width = `${this.width / 2}px`;
    timeOverScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'Time is over';

    timeOverScreen.appendChild(heading);

    document.getElementById('root').appendChild(timeOverScreen);

    this.timeOverScreen = timeOverScreen;
  }

  showWinScreen() {
    const winScreen = document.createElement('div');
    winScreen.style.backgroundColor = 'blue';
    winScreen.style.position = 'absolute';
    winScreen.style.left = '25%';
    winScreen.style.top = '25%';
    winScreen.style.width = `${this.width / 2}px`;
    winScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'You win! :D';

    winScreen.appendChild(heading);

    document.getElementById('root').appendChild(winScreen);

    this.winScreen = winScreen;
  }

  showLoseScreen() {
    const loseScreen = document.createElement('div');
    loseScreen.style.backgroundColor = 'blue';
    loseScreen.style.position = 'absolute';
    loseScreen.style.left = '25%';
    loseScreen.style.top = '25%';
    loseScreen.style.width = `${this.width / 2}px`;
    loseScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'You lose :(';

    loseScreen.appendChild(heading);

    document.getElementById('root').appendChild(loseScreen);

    this.loseScreen = loseScreen;
  }
}

export default View;
