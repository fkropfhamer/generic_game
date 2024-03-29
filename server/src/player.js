import Bullet from './bullet';
import Util from '../../shared/util';
import config from '../../shared/config';
import PowerUp from './powerup';
import IceSand from './iceSand';
import { SocketEvent } from '../../shared/enums';

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
    this.fireRateActivated = false;
    this.changedSpeedPowerupActive = false;
    this.isFrozen = false;
    this.isOnIce = false;
    this.isOnSand = false;
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
      if (this.fireRateActivated) {
        this.shootingCount = config.SHOOTING_RATE / config.POWERUP_FIRERATE_BOOSTER;
      } else {
        this.shootingCount = config.SHOOTING_RATE;
      }
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
    this.socket.on(SocketEvent.KEYSPRESSED, this.onKeysPressed.bind(this));
    this.socket.on(SocketEvent.SHOOT, this.onShoot.bind(this));
    this.socket.on(SocketEvent.UPDATE_ANGLE, this.onUpdateAngle.bind(this));
    this.socket.on(SocketEvent.DISCONNECT, this.onDisconnect.bind(this));
    this.socket.on(SocketEvent.READY, this.onReady.bind(this));
  }

  createBullet() {
    const bullet = new Bullet(this);
    this.game.addBullet(bullet);
  }

  notifyStart() {
    this.isWaiting = false;
    this.socket.emit(SocketEvent.START);
  }

  notifyWaiting(numberOfPlayers) {
    this.isWaiting = true;
    this.socket.emit(SocketEvent.WAIT, { numberOfPlayers });
  }

  notifyUpdate(players, bullets, timer, walls, powerUps, iceSandFields, teamLives, portals) {
    const mappedPlayers = Util.mapPlayers(players);
    const mappedPowerups = PowerUp.mapPowerups(powerUps);
    const mappedBullets = Bullet.mapBullets(bullets);
    const mappedIceSandFields = IceSand.mapIceSand(iceSandFields);
    this.socket.emit(SocketEvent.UPDATE, {
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
      teamLives,
      powerUps: mappedPowerups,
      iceSandFields: mappedIceSandFields,
      isFrozen: this.isFrozen,
      shootingCount: this.shootingCount,
      fireRateActivated: this.fireRateActivated,
      portals,
    });
  }

  notifyTimeOver() {
    this.socket.emit(SocketEvent.TIME_OVER);
  }

  notifyWin() {
    this.socket.emit(SocketEvent.WIN);
  }

  notifyLose() {
    this.socket.emit(SocketEvent.LOSE);
  }

  notifySplashSound() {
    this.socket.emit(SocketEvent.SPLASH_SOUND);
  }

  notifyDeath() {
    this.socket.emit(SocketEvent.DEATH);
  }

  notifyStarting(startCounter) {
    this.socket.emit(SocketEvent.STARTING, { face: this.face, color: this.color, startCounter });
  }

  update() {
    let { speed } = this;

    if (this.fireRateActivated > 0) {
      this.fireRateActivated -= 1;
    }

    if (this.changedSpeedPowerupActive > 0) {
      this.changedSpeedPowerupActive -= 1;
      speed *= config.POWERUP_SPEED_BOOSTER;
    }

    if (this.isFrozen > 0) {
      speed = 0;
      this.isFrozen -= 1;
    }

    if (this.isOnIce) {
      speed *= config.ICE_SPEED;
    }

    if (this.isOnSand) {
      speed *= config.SAND_SPEED;
    }

    if (this.shootingCount > 0) this.shootingCount -= 1;

    if (this.pressedUp) {
      this.y -= Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * speed;
    }
    if (this.pressedDown) {
      this.y += Util.halfIfAnotherKeyIsPressed(this.pressedLeft, this.pressedRight) * speed;
    }
    if (this.pressedLeft) {
      this.x -= Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * speed;
    }
    if (this.pressedRight) {
      this.x += Util.halfIfAnotherKeyIsPressed(this.pressedUp, this.pressedDown) * speed;
    }
  }
}
