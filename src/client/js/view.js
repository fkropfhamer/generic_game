/* eslint-disable prettier/prettier */
import config from '../../server/config';
import Util from '../../server/util';
import { Mode } from '../../server/enums';
import background from '../img/background.png';

export default class View {
  constructor() {
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
    this.windowHeight = window.innerHeight * 0.95;
    this.windowWidth = window.innerWidth;
    this.setupCanvas();
  }

  drawPartOfCircle(x, y, radius, color, endAngle) {
    const scaledX = Math.round(x * this.scale);
    const scaledY = Math.round(y * this.scale);
    const scaledRadius = Math.round(radius * this.scale);

    this.ctx.beginPath();
    this.ctx.arc(scaledX, scaledY, scaledRadius, 0, endAngle, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawCircle(x, y, radius, color) {
    this.drawPartOfCircle(x, y, radius, color, 2 * Math.PI);
  }

  drawPartOfRing(x, y, radiusObject, distanceToObject, endAngle, lineWidth, color) {
    const scaledX = Math.round(x * this.scale);
    const scaledY = Math.round(y * this.scale);
    const scaledRadius = Math.round((radiusObject + distanceToObject) * this.scale);

    this.ctx.beginPath();
    this.ctx.arc(scaledX, scaledY, scaledRadius, 0, endAngle, false);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  drawRing(x, y, radiusObject, distanceToObject, lineWidth, color) {
    this.drawPartOfRing(x, y, radiusObject, distanceToObject, 2 * Math.PI, lineWidth, color);
  }

  drawCross(x, y, radius, angle, color, lineWidth) {
    const innerPoint = { x: x * this.scale, y: y * this.scale };
    const point = { x: x * this.scale - radius, y: y * this.scale - radius };

    const point1 = Util.rotatePointAroundPoint(point, innerPoint, angle + Math.PI / 4);
    const point2 = Util.rotatePointAroundPoint(point, innerPoint, angle + (Math.PI / 4) * 3);
    const point3 = Util.rotatePointAroundPoint(point, innerPoint, angle + (Math.PI / 4) * 5);
    const point4 = Util.rotatePointAroundPoint(point, innerPoint, angle + (Math.PI / 4) * 7);

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

  drawCrossHair(x, y, radius, angle, color, lineWidth, state) {
    const thirdOfRadius = radius / 3;
    const distance = thirdOfRadius + lineWidth / 2;

    this.drawCross(x, y, radius, angle, color, lineWidth);
    this.drawCircle(x, y, thirdOfRadius, 'black');
    this.drawPartOfRing(x, y, 0, distance, state, lineWidth, color);
    this.drawPartOfRing(x, y, distance, distance, state, lineWidth, color);
  }

  drawRectangle(x, y, height, width, angle, fillColor, strokeColor, lineWidth) {
    const wSin = (Math.sin(angle) * width) / 2;
    const wCos = (Math.cos(angle) * width) / 2;
    const hSin = (Math.sin(angle) * height) / 2;
    const hCos = (Math.cos(angle) * height) / 2;

    const aX = Math.round((x - wCos + hSin) * this.scale);
    const aY = Math.round((y - hCos - wSin) * this.scale);
    const bX = Math.round((x + wCos + hSin) * this.scale);
    const bY = Math.round((y - hCos + wSin) * this.scale);
    const cX = Math.round((x + wCos - hSin) * this.scale);
    const cY = Math.round((y + hCos + wSin) * this.scale);
    const dX = Math.round((x - wCos - hSin) * this.scale);
    const dY = Math.round((y + hCos - wSin) * this.scale);

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
    const numberOfRings = Math.round(outerRadius / (2 * lineWidth));

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

  drawImageAtAngle(image, x, y, angle, scale = 1) {
    const imgWidth = Math.round(image.width * scale * this.scale);
    const imgHeight = Math.round(image.height * scale * this.scale);

    this.ctx.save();
    this.ctx.translate(Math.round(x * this.scale), Math.round(y * this.scale));
    this.ctx.rotate(angle);

    const roundedX = Math.round(-imgWidth / 2);
    const roundedY = Math.round(-imgHeight / 2);

    this.ctx.drawImage(image, roundedX, roundedY, imgWidth, imgHeight);
    this.ctx.restore();
  }

  drawPlayerIndicator(x, y, angle, state) {
    // eslint-disable-next-line max-len
    const xShifted = x + config.PLAYER_RADIUS + config.BULLET_INDICATOR_DISTANCE + config.BULLET_INDICATOR_RADIUS;
    const point = { x, y };
    const rotatedPoint = Util.rotatePointAroundPoint({ x: xShifted, y }, point, angle);

    this.drawCrossHair(
      rotatedPoint.x,
      rotatedPoint.y,
      config.BULLET_INDICATOR_RADIUS,
      angle,
      config.BULLET_INDICATOR_COLOR,
      2,
      (1 - state) * 2 * Math.PI
    );
  }

  static showTimer(timer) {
    const timeLeftPercentage = Math.round((timer / config.GAME_DURATION) * 100);
    document.getElementById('timeprogress').style.width = `${timeLeftPercentage}%`;
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
    this.hideDeathMessage();
    document.getElementById('timeoverscreen').style.display = 'initial';
  }

  static showWinScreen() {
    this.hideDeathMessage();
    document.getElementById('winscreen').style.display = 'initial';
  }

  static showLoseScreen() {
    this.hideDeathMessage();
    document.getElementById('losescreen').style.display = 'initial';
  }

  showStartScreen(callback) {
    document.getElementById('startscreen').style.display = 'initial';

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
  }

  static showDeathMessage() {
    document.getElementById('deathmessage').style.display = 'initial';
  }

  static hideDeathMessage() {
    document.getElementById('deathmessage').style.display = 'none';
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
