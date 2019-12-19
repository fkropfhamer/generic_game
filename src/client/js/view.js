import config from '../../server/config';
import { Mode } from '../../server/enums';

class View {
  constructor() {
    this.scale = 1;
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.color = '#232529';

    this.canvas = document.createElement('canvas');
    document.getElementById('root').appendChild(this.canvas);
    this.setupCanvas();

    window.addEventListener('resize', this.resize.bind(this));

    this.ctx = this.canvas.getContext('2d');
  }

  setupCanvas() {
    if (this.windowWidth !== config.FIELD_WIDTH) {
      this.scale = this.windowWidth / config.FIELD_WIDTH;
      if (config.FIELD_HEIGHT * this.scale > this.windowHeight) {
        this.scale = this.windowHeight / config.FIELD_HEIGHT;
      }
    }
    this.width = config.FIELD_WIDTH * this.scale;
    this.height = config.FIELD_HEIGHT * this.scale;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.style.backgroundColor = this.color;
  }

  resize() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    this.setupCanvas();
  }

  drawBackround() {
    this.drawImage(this.assets.background);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(x * this.scale, y * this.scale, radius * this.scale, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawRing(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(x * this.scale, y * this.scale, (radius + 5) * this.scale, 0, 2 * Math.PI, false);
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawRectangle(x, y, height, width, angle, fillColor, strokeColor) {
    const wSin = (Math.sin(angle) * width) / 2;
    const wCos = (Math.cos(angle) * width) / 2;
    const hSin = (Math.sin(angle) * height) / 2;
    const hCos = (Math.cos(angle) * height) / 2;
    this.ctx.beginPath();
    this.ctx.moveTo((x - wCos + hSin) * this.scale, (y - hCos - wSin) * this.scale);
    this.ctx.lineTo((x + wCos + hSin) * this.scale, (y - hCos + wSin) * this.scale);
    this.ctx.lineTo((x + wCos - hSin) * this.scale, (y + hCos + wSin) * this.scale);
    this.ctx.lineTo((x - wCos - hSin) * this.scale, (y + hCos - wSin) * this.scale);
    this.ctx.lineTo((x - wCos + hSin) * this.scale, (y - hCos - wSin) * this.scale);
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 3;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawImage(img) {
    console.log(img, img.width, img.height);
    this.ctx.drawImage(img, 0, 0, this.width, this.height);
  }

  reset() {
    this.ctx.fillStyle = this.color;
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.drawBackround();
  }

  drawImageAtAngle(image, x, y, angle, scale = 1) {
    const imgWidth = image.width * scale * this.scale;
    const imgHeight = image.height * scale * this.scale;

    this.ctx.save();
    this.ctx.translate(x * this.scale, y * this.scale);
    this.ctx.rotate(angle);

    this.ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    this.ctx.restore();
  }

  drawPlayerIndicator(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x * this.scale, (y - 30) * this.scale);
    this.ctx.lineTo((x - 10) * this.scale, (y - 35) * this.scale);
    this.ctx.lineTo((x + 10) * this.scale, (y - 35) * this.scale);
    this.ctx.lineTo(x * this.scale, (y - 30) * this.scale);
    this.ctx.closePath();

    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
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

  showPlayerColorInfo(playerColor) {
    const playerColorInfo = document.createElement('div');
    playerColorInfo.style.backgroundColor = this.color;
    playerColorInfo.style.position = 'absolute';
    playerColorInfo.style.left = '75%';
    playerColorInfo.style.top = '25%';
    playerColorInfo.style.width = '5px';
    playerColorInfo.style.height = '5px';

    const colorInfoText = document.createElement('h1');
    colorInfoText.style.fontSize = '30px';
    colorInfoText.style.color = '#FFFFFF';
    colorInfoText.innerHTML = `Your colour is ${playerColor}`;

    playerColorInfo.appendChild(colorInfoText);

    document.getElementById('root').appendChild(playerColorInfo);

    this.playerColorInfo = playerColorInfo;
  }

  hidePlayerColorInfo() {
    if (this.playerColorInfo) {
      this.playerColorInfo.style.display = 'none';
    }
  }

  static showWaitingScreen(numberOfPlayers) {
    document.getElementById('waitingscreen').style.display = 'initial';
    const playerString = numberOfPlayers === 1 ? 'player' : 'players';
    document.getElementById(
      'waitingscreenheading'
    ).innerHTML = `You have to wait for ${numberOfPlayers} other ${playerString}!`;
  }

  static hideWaitingScreen() {
    document.getElementById('waitingscreen').style.display = 'none';
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

    const reloadButton = View.reloadButton();

    timeOverScreen.appendChild(heading);
    timeOverScreen.appendChild(reloadButton);

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

    const reloadButton = View.reloadButton();

    winScreen.appendChild(heading);
    winScreen.appendChild(reloadButton);

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

    const reloadButton = View.reloadButton();

    loseScreen.appendChild(heading);
    loseScreen.appendChild(reloadButton);

    document.getElementById('root').appendChild(loseScreen);

    this.loseScreen = loseScreen;
  }

  showStartScreen(callback) {
    document.getElementById('startscreen').style.display = 'initial';

    this.assets.face1.classList.add('img-thumbnail');
    this.assets.face2.classList.add('img-thumbnail');
    this.assets.face3.classList.add('img-thumbnail');
    this.assets.face4.classList.add('img-thumbnail');

    document.getElementById('choice1-label').appendChild(this.assets.face1);
    document.getElementById('choice2-label').appendChild(this.assets.face2);
    document.getElementById('choice3-label').appendChild(this.assets.face3);
    document.getElementById('choice4-label').appendChild(this.assets.face4);

    const startButton = document.getElementById('startbutton');
    startButton.onclick = () => {
      let teamgame = false;
      let face = 'face1';

      if (document.getElementById('teamgame-checkbox').checked) {
        teamgame = true;
      }

      if (document.getElementById('choice1').checked) {
        face = 'face1';
      }
      if (document.getElementById('choice2').checked) {
        face = 'face2';
      }
      if (document.getElementById('choice3').checked) {
        face = 'face3';
      }
      if (document.getElementById('choice4').checked) {
        face = 'face4';
      }

      console.log(face, teamgame);
      const mode = teamgame ? Mode.TEAMS : Mode.NORMAL;
      callback(face, mode);
    };
  }

  static hideStartScreen() {
    document.getElementById('startscreen').style.display = 'none';
  }

  static reloadButton() {
    const button = document.createElement('button');
    button.classList.add('btn-primary');
    button.classList.add('btn');
    button.innerHTML = 'play again!';
    button.onclick = () => window.location.reload();

    return button;
  }
}

export default View;
