import config from '../../shared/config';
import Util from '../../shared/util';
import { Mode } from '../../shared/enums';
import background from '../img/background.png';

export default class View {
  constructor() {
    this.preScaledImages = {};
    this.scale = 1;
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    this.canvas = document.createElement('canvas');
    this.resize();
    document.getElementById('root').appendChild(this.canvas);

    window.addEventListener('resize', this.resize.bind(this));

    this.ctx = this.canvas.getContext('2d');
  }

  setupCanvas() {
    this.scale = this.windowWidth / config.FIELD_WIDTH;
    if (config.FIELD_HEIGHT * this.scale > this.windowHeight) {
      this.scale = this.windowHeight / config.FIELD_HEIGHT;
    }
    this.width = config.FIELD_WIDTH * this.scale;
    this.height = config.FIELD_HEIGHT * this.scale;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.style.backgroundImage = `url(${background})`;
    this.canvas.style.backgroundRepeat = 'no-repeat';
    this.canvas.style.backgroundSize = 'cover';
  }

  resize() {
    this.preScaledImages = {};
    this.windowHeight = window.innerHeight * 0.95;
    this.windowWidth = window.innerWidth;
    this.setupCanvas();
  }

  drawPartOfCircle(x, y, radius, color, endAngle) {
    const scaledX = View.floor(x * this.scale);
    const scaledY = View.floor(y * this.scale);
    const scaledRadius = View.floor(radius * this.scale);

    this.ctx.beginPath();
    this.ctx.arc(scaledX, scaledY, scaledRadius, 0, endAngle, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawCircle(x, y, radius, color) {
    this.drawPartOfCircle(x, y, radius, color, 2 * Math.PI);
  }

  drawPartOfRingWithoutScale(x, y, radiusObject, distanceToObject, endAngle, lineWidth, color) {
    const scaledRadius = View.floor((radiusObject + distanceToObject) * this.scale);

    this.ctx.beginPath();
    this.ctx.arc(x, y, scaledRadius, 0, endAngle, false);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawPartOfRing(x, y, radiusObject, distanceToObject, endAngle, lineWidth, color) {
    const scaledX = View.floor(x * this.scale);
    const scaledY = View.floor(y * this.scale);
    const scaledRadius = View.floor((radiusObject + distanceToObject) * this.scale);

    this.ctx.beginPath();
    this.ctx.arc(scaledX, scaledY, scaledRadius, 0, endAngle, false);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawRing(x, y, radiusObject, distanceToObject, lineWidth, color) {
    this.drawPartOfRing(x, y, radiusObject, distanceToObject, 2 * Math.PI, lineWidth, color);
  }

  drawCross(x, y, radius, color, lineWidth) {
    const innerPoint = { x, y };
    const point = { x: x - radius * this.scale, y: y - radius * this.scale };

    const point1 = Util.rotatePointAroundPoint(point, innerPoint, Math.PI / 4);
    const point2 = Util.rotatePointAroundPoint(point, innerPoint, (Math.PI / 4) * 3);
    const point3 = Util.rotatePointAroundPoint(point, innerPoint, (Math.PI / 4) * 5);
    const point4 = Util.rotatePointAroundPoint(point, innerPoint, (Math.PI / 4) * 7);

    this.ctx.beginPath();
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point3.x, point3.y);
    this.ctx.moveTo(point2.x, point2.y);
    this.ctx.lineTo(point4.x, point4.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCrossHair(x, y, shootingRateFraction) {
    const state = (1 - shootingRateFraction) * 2 * Math.PI;
    const radius = config.BULLET_INDICATOR_RADIUS;
    const color = config.BULLET_INDICATOR_COLOR;
    const thirdOfRadius = radius / 3;
    const distance = thirdOfRadius + 1;

    this.drawCross(x, y, radius, color, 2);
    this.drawPartOfRingWithoutScale(x, y, 0, distance, state, 2, color);
    this.drawPartOfRingWithoutScale(x, y, distance, distance, state, 2, color);
  }

  drawRectangle(x, y, height, width, angle, fillColor, strokeColor, lineWidth) {
    const wSin = (Math.sin(angle) * width) / 2;
    const wCos = (Math.cos(angle) * width) / 2;
    const hSin = (Math.sin(angle) * height) / 2;
    const hCos = (Math.cos(angle) * height) / 2;

    const aX = View.floor((x - wCos + hSin) * this.scale);
    const aY = View.floor((y - hCos - wSin) * this.scale);
    const bX = View.floor((x + wCos + hSin) * this.scale);
    const bY = View.floor((y - hCos + wSin) * this.scale);
    const cX = View.floor((x + wCos - hSin) * this.scale);
    const cY = View.floor((y + hCos + wSin) * this.scale);
    const dX = View.floor((x - wCos - hSin) * this.scale);
    const dY = View.floor((y + hCos - wSin) * this.scale);

    this.ctx.beginPath();
    this.ctx.moveTo(aX, aY);
    this.ctx.lineTo(bX, bY);
    this.ctx.lineTo(cX, cY);
    this.ctx.lineTo(dX, dY);
    this.ctx.lineTo(aX, aY);
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawNestedRings(x, y, outerRadius, lineWidth, color, state) {
    const numberOfRings = View.floor(outerRadius / (2 * lineWidth));

    this.drawCircle(x, y, outerRadius, 'black');
    for (let i = 0; i < numberOfRings; i++) {
      this.drawRing(
        x,
        y,
        i * 2 * lineWidth - Math.cos((2 * Math.PI * state) / config.PORTAL_ANIMATION),
        2 * lineWidth,
        lineWidth,
        color
      );
    }
  }

  reset() {
    this.ctx.clearRect(0, 0, Math.ceil(this.width), Math.ceil(this.height));
  }

  hideCursor() {
    this.canvas.style.cursor = 'none';
  }

  showCursor() {
    this.canvas.style.cursor = 'flex';
  }

  drawImageAtAngle(image, x, y, angle, scale = 1) {
    let scaledImage = this.preScaledImages[image.src];
    const imgWidth = View.floor(image.width * scale * this.scale);
    const imgHeight = View.floor(image.height * scale * this.scale);
    if (!scaledImage) {
      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = imgWidth;
      offScreenCanvas.height = imgHeight;
      const offScreenContext = offScreenCanvas.getContext('2d');
      offScreenContext.drawImage(image, 0, 0, imgWidth, imgHeight);

      this.preScaledImages[image.src] = offScreenCanvas;
      scaledImage = offScreenCanvas;
    }

    this.ctx.save();
    this.ctx.translate(View.floor(x * this.scale), View.floor(y * this.scale));
    this.ctx.rotate(angle);

    const roundedX = View.floor(-imgWidth / 2);
    const roundedY = View.floor(-imgHeight / 2);

    this.ctx.drawImage(scaledImage, roundedX, roundedY);
    this.ctx.restore();
  }

  drawPlayerIndicator(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(View.floor(x * this.scale), View.floor((y - 30) * this.scale));
    this.ctx.lineTo(View.floor((x - 10) * this.scale), View.floor((y - 35) * this.scale));
    this.ctx.lineTo(View.floor((x + 10) * this.scale), View.floor((y - 35) * this.scale));
    this.ctx.lineTo(View.floor(x * this.scale), View.floor((y - 30) * this.scale));
    this.ctx.closePath();

    this.ctx.fillStyle = config.PLAYER_INDICATOR_COLOR;
    this.ctx.fill();
  }

  static showTimer(timer) {
    const timeLeftPercentage = View.floor((timer / config.GAME_DURATION) * 100);
    document.getElementById('timeprogress').style.width = `${timeLeftPercentage}%`;
  }

  static showWaitingScreen(numberOfPlayers) {
    document.getElementById('waitingscreen').style.display = 'flex';
    const playerString = numberOfPlayers === 1 ? 'player' : 'players';
    document.getElementById(
      'waitingscreenheading'
    ).innerHTML = `You have to wait for ${numberOfPlayers} other ${playerString}!`;
  }

  static hideWaitingScreen() {
    document.getElementById('waitingscreen').style.display = 'none';
  }

  static showTimeOverScreen() {
    this.hideDeathMessage();
    document.getElementById('timeoverscreen').style.display = 'flex';
  }

  static showWinScreen() {
    this.hideDeathMessage();
    document.getElementById('winscreen').style.display = 'flex';
  }

  static showLoseScreen() {
    this.hideDeathMessage();
    document.getElementById('losescreen').style.display = 'flex';
  }

  showStartScreen(callback) {
    document.getElementById('startscreen').style.display = 'flex';
    View.hideInstructionScreen();

    this.images.face1.classList.add('img-thumbnail');
    this.images.face2.classList.add('img-thumbnail');
    this.images.face3.classList.add('img-thumbnail');
    this.images.face4.classList.add('img-thumbnail');

    document.getElementById('choice1-label').appendChild(this.images.face1);
    document.getElementById('choice2-label').appendChild(this.images.face2);
    document.getElementById('choice3-label').appendChild(this.images.face3);
    document.getElementById('choice4-label').appendChild(this.images.face4);

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

    const instructionButton = document.getElementById('instructionbutton');
    instructionButton.onclick = () => {
      this.showInstructionScreen(callback, this.images);
    };
  }

  showInstructionScreen(callback, images) {
    View.hideDeathMessage();
    View.hideStartScreen();
    document.getElementById('instructionscreen').style.display = 'flex';

    document.getElementById('arrowbuttons-img').appendChild(images.arrowbuttons);
    document.getElementById('mouseclick-img').appendChild(images.mouseclick);
    document.getElementById('portal-img').appendChild(images.portalinstruction);
    document.getElementById('health-img').appendChild(images.health);
    document.getElementById('firerate-img').appendChild(images.firerate);
    document.getElementById('speed-img').appendChild(images.speed);
    document.getElementById('shield-img').appendChild(images.shield);
    document.getElementById('freeze-img').appendChild(images.freeze);

    const backButton = document.getElementById('backbutton');
    backButton.onclick = () => {
      this.showStartScreen(callback);
    };
  }

  static showStartingScreen(startCounter, color) {
    const startingScreen = document.getElementById('startingscreen');
    const startingScreenMesssage = document.getElementById('startingscreenmessage');
    startingScreenMesssage.innerHTML = `Game is starting in ${startCounter}! Your color is ${color}`;
    startingScreen.style.display = 'flex';
  }

  static hideStartingScreen() {
    document.getElementById('startingscreen').style.display = 'none';
  }

  static hideInstructionScreen() {
    document.getElementById('instructionscreen').style.display = 'none';
  }

  static showDeathMessage() {
    document.getElementById('deathmessage').style.display = 'flex';
  }

  static hideDeathMessage() {
    document.getElementById('deathmessage').style.display = 'none';
  }

  static updateTeamLiveBar(teamLives) {
    const livesSum = teamLives.redLives + teamLives.blueLives;
    const redLivePercentage = View.floor((teamLives.redLives / livesSum) * 100);
    const blueLivePercentage = View.floor((teamLives.blueLives / livesSum) * 100);

    document.getElementById('redlivebar').style.width = `${redLivePercentage}%`;
    document.getElementById('bluelivebar').style.width = `${blueLivePercentage}%`;
  }

  static hideStartScreen() {
    document.getElementById('startscreen').style.display = 'none';
  }

  static floor(x) {
    // eslint-disable-next-line no-bitwise
    return x | 0;
  }
}
