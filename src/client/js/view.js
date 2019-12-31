import config from '../../server/config';
import { Mode } from '../../server/enums';

class View {
  constructor() {
    this.scale = 1;
    this.color = '#232529';

    this.canvas = document.createElement('canvas');
    this.resize();
    document.getElementById('root').appendChild(this.canvas);

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
    this.windowHeight = window.innerHeight * 0.95;
    this.windowWidth = window.innerWidth;
    this.setupCanvas();
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
    const timeLeftPercentage = Math.round((timer / config.GAME_DURATION) * 100);
    document.getElementById('timeprogress').style.width = `${timeLeftPercentage}%`;
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

  static showTimeOverScreen() {
    document.getElementById('timeoverscreen').style.display = 'initial';
  }

  static showWinScreen() {
    document.getElementById('winscreen').style.display = 'initial';
  }

  static showLoseScreen() {
    document.getElementById('losescreen').style.display = 'initial';
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

      const mode = teamgame ? Mode.TEAMS : Mode.NORMAL;
      callback(face, mode);
    };
  }

  static updateTeamLiveBar(teamLives) {
    const livesSum = teamLives.redLives + teamLives.blueLives;
    const redLivePercentage = Math.round((teamLives.redLives / livesSum) * 100);
    const blueLivePercentage = Math.round((teamLives.blueLives / livesSum) * 100);

    document.getElementById('redlivebar').style.width = `${redLivePercentage}%`;
    document.getElementById('bluelivebar').style.width = `${blueLivePercentage}%`;
  }

  static hideStartScreen() {
    document.getElementById('startscreen').style.display = 'none';
  }
}

export default View;
