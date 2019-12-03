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

    const face1Img = this.assets.face1;

    const face2Img = this.assets.face2;

    const face3Img = this.assets.face3;

    const face4Img = this.assets.face4;

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
}

export default View;
