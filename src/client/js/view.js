import config from '../../server/config';

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
    this.drawImage(this.images.background);
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

  showWaitingScreen(numberOfPlayers) {
    const playerString = numberOfPlayers === 1 ? 'player' : 'players';
    if (this.waitingScreen) {
      document.getElementById(
        'waitcount'
      ).innerHTML = `You have to wait for ${numberOfPlayers} other ${playerString}!`;
    } else {
      const waitingScreen = document.createElement('div');
      waitingScreen.style.backgroundColor = 'white';
      waitingScreen.style.position = 'absolute';
      waitingScreen.style.left = '25%';
      waitingScreen.style.top = '25%';
      waitingScreen.style.width = `${this.width / 2}px`;
      waitingScreen.style.height = `${this.height / 2}px`;

      const heading = document.createElement('h1');
      heading.innerHTML = `You have to wait for ${numberOfPlayers} other ${playerString}!`;
      heading.id = 'waitcount';

      waitingScreen.appendChild(heading);

      document.getElementById('root').appendChild(waitingScreen);

      this.waitingScreen = waitingScreen;
    }
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
    const startScreen = document.createElement('div');
    startScreen.style.backgroundColor = 'blue';
    startScreen.style.position = 'absolute';
    startScreen.style.left = '25%';
    startScreen.style.top = '25%';
    startScreen.style.width = `${this.width / 2}px`;
    startScreen.style.height = `${this.height / 2}px`;

    const heading = document.createElement('h1');
    heading.innerHTML = 'Nice Game Title';

    const faceChoice = document.createElement('div');
    faceChoice.style.backgroundColor = 'white';

    const faceChoiceHeading = document.createElement('h1');
    faceChoiceHeading.innerHTML = 'Choose Face!';

    const faceChoice1 = document.createElement('div');
    faceChoice1.style.backgroundColor = 'grey';
    faceChoice1.style.cssFloat = 'left';
    faceChoice1.style.margin = '1%';
    faceChoice1.style.padding = '1%';
    const faceChoice2 = document.createElement('div');
    faceChoice2.style.backgroundColor = 'grey';
    faceChoice2.style.cssFloat = 'left';
    faceChoice2.style.margin = '1%';
    faceChoice2.style.padding = '1%';
    const faceChoice3 = document.createElement('div');
    faceChoice3.style.backgroundColor = 'grey';
    faceChoice3.style.cssFloat = 'left';
    faceChoice3.style.margin = '1%';
    faceChoice3.style.padding = '1%';
    const faceChoice4 = document.createElement('div');
    faceChoice4.style.backgroundColor = 'grey';
    faceChoice4.style.cssFloat = 'left';
    faceChoice4.style.margin = '1%';
    faceChoice4.style.padding = '1%';

    const checkbox1 = document.createElement('input');
    const checkbox2 = document.createElement('input');
    const checkbox3 = document.createElement('input');
    const checkbox4 = document.createElement('input');

    const face1Img = this.images.face1;

    const face2Img = this.images.face2;

    const face3Img = this.images.face3;

    const face4Img = this.images.face4;

    checkbox1.type = 'checkbox';
    checkbox1.checked = true;
    checkbox1.onclick = () => {
      if (!checkbox1.checked) {
        checkbox1.checked = false;
      } else {
        checkbox1.checked = true;

        checkbox2.checked = false;

        checkbox3.checked = false;

        checkbox4.checked = false;
      }
    };

    checkbox2.type = 'checkbox';
    checkbox2.checked = false;
    checkbox2.onclick = () => {
      if (!checkbox2.checked) {
        checkbox2.checked = false;
      } else {
        checkbox2.checked = true;

        checkbox1.checked = false;

        checkbox3.checked = false;

        checkbox4.checked = false;
      }
    };

    checkbox3.type = 'checkbox';
    checkbox3.checked = false;
    checkbox3.onclick = () => {
      if (!checkbox3.checked) {
        checkbox3.checked = false;
      } else {
        checkbox3.checked = true;

        checkbox2.checked = false;

        checkbox1.checked = false;

        checkbox4.checked = false;
      }
    };

    checkbox4.type = 'checkbox';
    checkbox4.checked = false;
    checkbox4.onclick = () => {
      if (!checkbox4.checked) {
        checkbox4.checked = false;
      } else {
        checkbox4.checked = true;

        checkbox2.checked = false;

        checkbox3.checked = false;

        checkbox1.checked = false;
      }
    };

    const teamChoiceHeading = document.createElement('h1');
    teamChoiceHeading.innerHTML = 'teamgame?';

    const teamCheckbox = document.createElement('input');
    teamCheckbox.type = 'checkbox';
    teamCheckbox.innerHTML = 'teams?';

    const teamChoice = document.createElement('div');
    teamChoice.style.backgroundColor = 'brown';

    const startButton = document.createElement('button');
    startButton.innerHTML = 'start';
    startButton.style.paddingLeft = '2%';
    startButton.style.paddingRight = '6%';
    startButton.style.paddingTop = '1%';
    startButton.style.paddingBottom = '1%';
    startButton.style.display = 'inline-block';
    startButton.style.textAlign = 'center';
    startButton.style.position = 'absolute';
    startButton.style.backgroundColor = 'green';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.top = '85%';
    startButton.style.left = '10%';
    // startButton.style.left = '100%';
    startButton.onclick = () => {
      let face;
      if (checkbox1.checked) {
        console.log(1);
        face = 'face1';
      } else if (checkbox2.checked) {
        console.log(2);
        face = 'face2';
      } else if (checkbox3.checked) {
        console.log(3);
        face = 'face3';
      } else if (checkbox4.checked) {
        console.log(4);
        face = 'face4';
      } else {
        console.log(5);
        face = 'face1';
      }

      let mode;
      if (teamCheckbox.checked) {
        mode = 'teams';
      } else {
        mode = 'normal';
      }

      callback(face, mode);
    };

    startScreen.appendChild(heading);

    faceChoice1.appendChild(face1Img);
    faceChoice1.appendChild(checkbox1);
    faceChoice2.appendChild(face2Img);
    faceChoice2.appendChild(checkbox2);
    faceChoice3.appendChild(face3Img);
    faceChoice3.appendChild(checkbox3);
    faceChoice4.appendChild(face4Img);
    faceChoice4.appendChild(checkbox4);

    faceChoice.appendChild(faceChoiceHeading);
    faceChoice.appendChild(faceChoice1);
    faceChoice.appendChild(faceChoice2);
    faceChoice.appendChild(faceChoice3);
    faceChoice.appendChild(faceChoice4);

    teamChoice.appendChild(teamChoiceHeading);
    teamChoice.appendChild(teamCheckbox);

    startScreen.appendChild(faceChoice);

    startScreen.appendChild(teamChoice);

    startScreen.appendChild(startButton);

    document.getElementById('root').appendChild(startScreen);

    this.startScreen = startScreen;
  }

  hideStartScreen() {
    if (this.startScreen) {
      this.startScreen.style.display = 'none';
    }
  }

  static reloadButton() {
    const button = document.createElement('button');
    button.innerHTML = 'play again!';
    button.onclick = () => window.location.reload();

    return button;
  }
}

export default View;
