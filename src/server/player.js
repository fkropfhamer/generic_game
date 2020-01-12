import Bullet from './bullet';
import Util from './util';
import config from './config';
import PowerUp from './powerup';
import IceSand from './iceSand';

export default class Player {
  constructor(socket, server) {
    this.socket = socket;
    this.server = server;
    this.setupSocket();
    this.speed = config.PLAYER_SPEED;
    this.angle = 0;
    this.radius = config.PLAYER_RADIUS;
    this.shootingCount = 0;
    this.isShielded = false;
    this.changedSpeedPowerupActive = false;
    this.freezingOthers = false;
    this.gotFreezed = false;
  }

  onKeysPressed(data) {
    this.pressedRight = data.right;
    this.pressedLeft = data.left;
    this.pressedDown = data.down;
    this.pressedUp = data.up;
  }

  onUpdateAngle(data) {
    this.angle = data.angle;
  }

  onShoot(data) {
    if (this.shootingCount === 0 && typeof this.game !== 'undefined') {
      this.angle = data.angle;
      this.createBullet();
      this.shootingCount = config.SHOOTING_RATE;
    }
  }

  onDisconnect() {
    if (this.isWaiting) {
      this.server.waitingPlayerDisconnected(this);
    } else if (typeof this.game !== 'undefined') {
      this.game.playerDisconnected(this);
    }
  }

  onReady(data) {
    this.face = data.face;
    this.mode = data.mode;
    this.server.playerIsReady(this, data.mode);
  }

  setupSocket() {
    this.socket.on('keyspressed', this.onKeysPressed.bind(this));
    this.socket.on('shoot', this.onShoot.bind(this));
    this.socket.on('update angle', this.onUpdateAngle.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('ready', this.onReady.bind(this));
  }

  createBullet() {
    const bullet = new Bullet(this);
    this.game.addBullet(bullet);
  }

  notifyStart(otherPlayers, timer, walls, powerUps, iceSandFields) {
    this.isWaiting = false;
    const mappedPlayers = Util.mapPlayers(otherPlayers);
    const mappedPowerups = PowerUp.mapPowerups(powerUps);
    const mappedIceSandFields = IceSand.mapIceSand(iceSandFields);
    this.socket.emit('start', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      color: this.color,
      lives: this.lives,
      face: this.face,
      players: mappedPlayers,
      timer,
      walls,
      powerUps: mappedPowerups,
      iceSandFields: mappedIceSandFields,
    });
  }

  notifyWaiting(numberOfPlayers) {
    this.isWaiting = true;
    this.socket.emit('wait', { numberOfPlayers });
  }

  notifyUpdate(players, bullets, timer, walls, powerUps, iceSandFields) {
    const mappedPlayers = Util.mapPlayers(players);
    const mappedPowerups = PowerUp.mapPowerups(powerUps);
    const mappedBullets = Bullet.mapBullets(bullets);
    const mappedIceSandFields = IceSand.mapIceSand(iceSandFields);
    this.socket.emit('update', {
      x: this.x,
      y: this.y,
      angle: this.angle,
      lives: this.lives,
      hitAngle: this.hitAngle,
      players: mappedPlayers,
      isShielded: this.isShielded,
      bullets: mappedBullets,
      timer,
      walls,
      powerUps: mappedPowerups,
      iceSandFields: mappedIceSandFields,
    });
  }

  notifyOpponentDisconnected() {
    this.socket.emit('opponent disconnected');
  }

  notifyTimeOver() {
    this.socket.emit('time over');
  }

  notifyWin() {
    this.socket.emit('win');
  }

  notifyLose() {
    this.socket.emit('lose');
  }

  update() {
    if (this.shootingCount > 0) this.shootingCount -= 1;

    if (this.pressedUp) {
      this.y -= Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedDown) {
      this.y += Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * this.speed;
    }
    if (this.pressedLeft) {
      this.x -= Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
    if (this.pressedRight) {
      this.x += Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * this.speed;
    }
  }
}
