import { io } from 'socket.io-client';
import config from '../../shared/config';
import View from './view';
import { Color, EventListener, Key, SocketEvent } from '../../shared/enums';

export default class Client {
  constructor(view, images, audios) {
    this.isWaiting = true;
    this.view = view;
    this.images = images;
    this.audios = audios;
    this.mouseX = 0;
    this.mouseY = 0;
    this.view.showStartScreen(this.setup.bind(this));
  }

  setup(face, mode) {
    View.hideStartScreen();
    this.setupSocket();
    this.pressedUp = false;
    this.pressedDown = false;
    this.pressedLeft = false;
    this.pressedRight = false;
    this.socket.emit(SocketEvent.READY, { face, mode });
  }

  drawPlayer(color, lives, face, x, y, angle, hitAngle, isShielded, isFrozen) {
    this.view.drawImageAtAngle(this.images[color], x, y, angle, config.PLAYER_SCALE);
    if (lives < config.PLAYER_LIVES) {
      this.view.drawImageAtAngle(
        this.images[`${color}${lives}life`],
        x,
        y,
        angle + hitAngle,
        config.PLAYER_SCALE
      );
    }
    this.view.drawImageAtAngle(this.images[face], x, y, angle, config.PLAYER_SCALE);
    if (isShielded) {
      this.view.drawRing(
        x,
        y,
        config.PLAYER_RADIUS,
        config.POWERUP_SHIELD_DISTANCE_TO_PLAYER,
        config.POWERUP_SHIELD_LINEWIDTH,
        color
      );
    }
    if (isFrozen) {
      this.view.drawImageAtAngle(this.images.playerIced, x, y, 0, config.PLAYER_SCALE);
    }
  }

  drawPortals(x1, y1, x2, y2, starttime, endtime, timer) {
    if (starttime > timer && endtime < timer) {
      this.view.drawCircle(x1, y1, config.PORTAL_RADIUS, Color.BLACK);
      this.view.drawNestedRings(
        x1,
        y1,
        config.PORTAL_RADIUS,
        config.PORTAL_RING_LINEWIDTH,
        config.PORTAL_COLOR,
        timer % config.PORTAL_ANIMATION
      );
      this.view.drawCircle(x2, y2, config.PORTAL_RADIUS, Color.BLACK);
      this.view.drawNestedRings(
        x2,
        y2,
        config.PORTAL_RADIUS,
        config.PORTAL_RING_LINEWIDTH,
        config.PORTAL_COLOR,
        timer % config.PORTAL_ANIMATION
      );
    }
  }

  drawCrossHair() {
    const shootingRateFraction = this.shootingCount / config.SHOOTING_RATE;
    const shootingRateFractionBoosted = shootingRateFraction * config.POWERUP_FIRERATE_BOOSTER;
    if (this.fireRateActivated) {
      this.view.drawCrossHair(this.mouseX, this.mouseY, shootingRateFractionBoosted);
    } else {
      this.view.drawCrossHair(this.mouseX, this.mouseY, shootingRateFraction);
    }
  }

  drawPlayerIndicator() {
    this.view.drawPlayerIndicator(this.x, this.y);
  }

  draw() {
    this.view.reset();
    View.showTimer(this.timer);

    this.iceSandFields.forEach((isf) => {
      this.view.drawImageAtAngle(this.images[isf.type], isf.x, isf.y, 0, 1);
    });

    this.bullets.forEach((b) => this.view.drawCircle(b.x, b.y, config.BULLET_RADIUS, b.color));

    this.walls.forEach((w) =>
      this.view.drawRectangle(
        w.x,
        w.y,
        w.height,
        w.width,
        w.angle,
        w.fillColor,
        w.strokeColor,
        config.WALL_LINEWIDTH
      )
    );

    this.drawPlayer(
      this.color,
      this.lives,
      this.face,
      this.x,
      this.y,
      this.angle,
      this.hitAngle,
      this.isShielded,
      this.isFrozen
    );
    this.otherPlayers.forEach((player) => {
      this.drawPlayer(
        player.color,
        player.lives,
        player.face,
        player.x,
        player.y,
        player.angle,
        player.hitAngle,
        player.isShielded,
        player.isFrozen
      );
    });

    this.powerUps.forEach((p) =>
      this.view.drawImageAtAngle(this.images[p.type], p.x, p.y, 0, config.POWERUP_SCALE)
    );
    this.drawPlayerIndicator();
    View.updateTeamLiveBar(this.teamLives);

    this.portals.forEach((p) => {
      this.drawPortals(p.x1, p.y1, p.x2, p.y2, p.starttime, p.endtime, this.timer);
    });

    this.drawCrossHair();
  }

  loop() {
    this.draw();

    if (!this.isEnded) {
      window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  setupKeyPressedEvents() {
    window.addEventListener(EventListener.KEYDOWN, this.keyPressed.bind(this));
    window.addEventListener(EventListener.KEYUP, this.keyUp.bind(this));
    window.addEventListener(EventListener.CLICK, this.shoot.bind(this));
    window.addEventListener(EventListener.MOUSEMOVE, this.mouseMove.bind(this));
  }

  mouseMove(e) {
    this.mouseX = e.clientX - this.view.canvas.offsetLeft;
    this.mouseY = e.clientY - this.view.canvas.offsetTop;
    const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
    this.angle = angle;

    this.socket.emit(SocketEvent.UPDATE_ANGLE, { angle });
  }

  calculateAngle(x1, y1, x2, y2) {
    const scaledx2 = x2 * this.view.scale;
    const scaledy2 = y2 * this.view.scale;
    return Math.atan2(
      y1 - this.view.canvas.offsetTop - scaledy2,
      x1 - this.view.canvas.offsetLeft - scaledx2
    );
  }

  shoot(e) {
    const angle = this.calculateAngle(e.clientX, e.clientY, this.x, this.y);
    this.angle = angle;
    this.socket.emit(SocketEvent.SHOOT, { angle });
  }

  keyPressed(e) {
    if (e.code === Key.ARROW_DOWN || e.code === Key.KEY_S) {
      this.pressedDown = true;
    }
    if (e.code === Key.ARROW_UP || e.code === Key.KEY_W) {
      this.pressedUp = true;
    }
    if (e.code === Key.ARROW_RIGHT || e.code === Key.KEY_D) {
      this.pressedRight = true;
    }
    if (e.code === Key.ARROW_LEFT || e.code === Key.KEY_A) {
      this.pressedLeft = true;
    }
  }

  keyUp(e) {
    if (e.code === Key.ARROW_DOWN || e.code === Key.KEY_S) {
      this.pressedDown = false;
    }
    if (e.code === Key.ARROW_UP || e.code === Key.KEY_W) {
      this.pressedUp = false;
    }
    if (e.code === Key.ARROW_RIGHT || e.code === Key.KEY_D) {
      this.pressedRight = false;
    }
    if (e.code === Key.ARROW_LEFT || e.code === Key.KEY_A) {
      this.pressedLeft = false;
    }
  }

  onStart() {
    View.hideStartingScreen();
    this.view.hideCursor();
    this.audios.backgroundMusic.loop = true;
    this.audios.backgroundMusic.play();
    this.loop();
    this.setupKeyPressedEvents();
  }

  onConnected() {
    this.isConnected = true;
  }

  onUpdate(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.otherPlayers = data.players;
    this.bullets = data.bullets;
    this.timer = data.timer;
    this.lives = data.lives;
    this.hitAngle = data.hitAngle;
    this.walls = data.walls;
    this.isShielded = data.isShielded;
    this.isFrozen = data.isFrozen;
    this.shootingCount = data.shootingCount;
    this.fireRateActivated = data.fireRateActivated;
    this.teamLives = data.teamLives;
    this.powerUps = data.powerUps;
    this.iceSandFields = data.iceSandFields;
    this.portals = data.portals;
    this.socket.emit(SocketEvent.KEYSPRESSED, {
      up: this.pressedUp,
      down: this.pressedDown,
      left: this.pressedLeft,
      right: this.pressedRight,
    });
  }

  onWait(data) {
    View.showWaitingScreen(data.numberOfPlayers);
    this.isWaiting = true;
  }

  onTimeOver() {
    View.showTimeOverScreen();
    this.view.showCursor();
    this.isEnded = true;
  }

  onWin() {
    View.showWinScreen();
    this.view.showCursor();
    this.isEnded = true;
  }

  onLose() {
    View.showLoseScreen();
    this.view.showCursor();
    this.isEnded = true;
  }

  onDeath() {
    View.showDeathMessage();
    this.view.showCursor();
    this.isDead = true;
  }

  onSplashSound() {
    this.audios.splash.play();
  }

  onStarting(data) {
    this.face = data.face;
    this.color = data.color;
    if (this.isWaiting) {
      View.hideWaitingScreen();
      this.isWaiting = false;
    }
    View.showStartingScreen(data.startCounter, this.color);
    this.draw();
  }

  setupSocket() {
    this.createSocket(io);
    this.configureSocket();
  }

  createSocket(socket) {
    this.socket = socket(import.meta.env.VITE_WEBSOCKET_URL);
  }

  configureSocket() {
    this.socket.on(SocketEvent.CONNECT, this.onConnected.bind(this));
    this.socket.on(SocketEvent.START, this.onStart.bind(this));
    this.socket.on(SocketEvent.UPDATE, this.onUpdate.bind(this));
    this.socket.on(SocketEvent.WAIT, this.onWait.bind(this));
    this.socket.on(SocketEvent.TIME_OVER, this.onTimeOver.bind(this));
    this.socket.on(SocketEvent.WIN, this.onWin.bind(this));
    this.socket.on(SocketEvent.LOSE, this.onLose.bind(this));
    this.socket.on(SocketEvent.SPLASH_SOUND, this.onSplashSound.bind(this));
    this.socket.on(SocketEvent.DEATH, this.onDeath.bind(this));
    this.socket.on(SocketEvent.STARTING, this.onStarting.bind(this));
  }
}
