import config from './config';
import Util from './util';
import PowerUp from './powerup';
import { Color } from './enums';

export default class Game {
  constructor(players) {
    this.players = players;
    this.bullets = [];
    this.deadPlayers = [];
    this.walls = [];
    this.powerUps = [];
    this.portals = [];
    this.setupPowerups();
    this.setupWalls();
    this.setupPortals();
  }

  start() {
    this.timer = config.GAME_DURATION;
    this.count = 0;

    this.players.forEach((player, i) => {
      player.x = config.PLAYER_STARTING_POSITIONS[i].x;
      player.y = config.PLAYER_STARTING_POSITIONS[i].y;
      player.lives = config.PLAYER_LIVES;
      player.color = i % 2 === 0 ? Color.BLUE : Color.RED;
      player.game = this;
    });

    this.players.forEach((player) => {
      player.notifyStart(
        this.getOtherPlayers(player),
        this.timer,
        this.walls,
        this.powerUps,
        this.calculateTeamLives(),
        this.portals
      );
      player.game = this;
      player.isWaiting = false;
    });

    this.interval = setInterval(this.loop.bind(this), 10);
  }

  setupPowerups() {
    config.POWER_UPS.forEach((powerUp) => {
      this.powerUps.push(new PowerUp(powerUp.x, powerUp.y, powerUp.type));
    });
  }

  setupPortals() {
    config.portals.forEach((portal) => {
      this.portals.push(portal);
    });
  }

  setupWalls() {
    this.setupBarrierWalls();
    this.setupConstraintWalls();
  }

  setupConstraintWalls() {
    const horizontalWidth = config.FIELD_WIDTH / config.NUMBER_OF_HORIZONTAL_WALLS;
    for (let i = horizontalWidth / 2; i < config.FIELD_WIDTH; i += horizontalWidth) {
      this.walls.push({
        ...config.constraintWalls,
        x: i,
        width: horizontalWidth,
      });
      this.walls.push({
        ...config.constraintWalls,
        x: i,
        width: horizontalWidth,
        y: config.FIELD_HEIGHT - 10,
      });
    }
    const veritcalWidth = config.FIELD_HEIGHT / config.NUMBER_OF_VERTICAL_WALLS;
    for (let i = veritcalWidth / 2; i < config.FIELD_HEIGHT; i += veritcalWidth) {
      this.walls.push({
        ...config.constraintWalls,
        x: 10,
        y: i,
        width: veritcalWidth,
        angle: Math.PI / 2,
      });
      this.walls.push({
        ...config.constraintWalls,
        x: config.FIELD_WIDTH - 10,
        y: i,
        width: veritcalWidth,
        angle: Math.PI / 2,
      });
    }
  }

  setupBarrierWalls() {
    for (let i = 1; i <= 3; i += 1) {
      for (let j = 1; j <= 3; j += 1) {
        this.walls.push({
          ...config.barrierWalls,
          x: (config.FIELD_WIDTH / 4) * i,
          y: (config.FIELD_HEIGHT / 4) * j,
        });
        this.walls.push({
          ...config.barrierWalls,
          x: (config.FIELD_WIDTH / 4) * i,
          y: (config.FIELD_HEIGHT / 4) * j,
          angle: -config.barrierWalls.angle,
        });
      }
    }
  }

  getOtherPlayers(player) {
    return this.players.filter((p) => !Object.is(player, p));
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  checkBulletHitsPlayer(player) {
    this.bullets.forEach((bullet) => {
      if (bullet.color !== player.color) {
        if (Util.collisionCircleCircle(player, bullet)) {
          const v1 = { x: bullet.x - player.x, y: bullet.y - player.y };
          const v2 = { x: 10, y: 0 };

          const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
          const hitAngle = -angle - player.angle;

          player.hitAngle = hitAngle;

          this.bullets = this.bullets.filter((b) => !Object.is(bullet, b));
          if (player.isShielded) {
            player.isShielded = false;
          } else {
            player.lives -= 1;
            if (player.lives <= 0) {
              this.playerDied(player);
            }
          }
        }
      }
    });
  }

  calculateTeamLives() {
    const blueLives = this.players
      .filter((player) => player.color === Color.BLUE)
      .reduce((a, b) => a + b.lives, 0);
    const redLives = this.players
      .filter((player) => player.color === Color.RED)
      .reduce((a, b) => a + b.lives, 0);

    return { blueLives, redLives };
  }

  checkPlayerHitsPowerUp(player) {
    this.powerUps.forEach((powerUp) => {
      if (Util.collisionCircleCircle(powerUp, player)) {
        powerUp.update(player);
        this.powerUps = this.powerUps.filter((p) => !Object.is(powerUp, p));
      }
    });
  }

  checkSomethingHitsPortal(something) {

    this.portals
      .filter((p) => p.starttime > this.timer && p.endtime < this.timer)
      .forEach((portal) => {
        const portal1 = {
          x: portal.x1,
          y: portal.y1,
          radius: config.PORTAL_RADIUS - 2 * something.radius,
        };
        const portal2 = {
          x: portal.x2,
          y: portal.y2,
          radius: config.PORTAL_RADIUS - 2 * something.radius,
        };
        if (Util.collisionCircleCircle(portal1, something)) {
          something.x = portal.x2 - (something.x - portal.x1) * 1.1;
          something.y = portal.y2 - (something.y - portal.y1) * 1.1;
        }
        if (Util.collisionCircleCircle(portal2, something)) {
          something.x = portal.x1 - (something.x - portal.x2) * 1.1;
          something.y = portal.y1 - (something.y - portal.y2) * 1.1;
        }
      });
  }

  checkWallCollisionPlayer(player) {
    this.walls.forEach((wall) => {
      const playerCollides = Util.collisionRectCircle(wall, player);
      if (playerCollides) {
        const angle = playerCollides.angle + wall.angle;
        const dis = config.PLAYER_RADIUS - playerCollides.dis;

        player.x += dis * Math.cos(angle);
        player.y += dis * Math.sin(angle);
      }
    });
  }

  checkWallCollisionBullet(bullet) {
    this.walls.forEach((wall) => {
      const bulletCollides = Util.collisionRectCircle(wall, bullet);
      if (bulletCollides) {
        this.bullets = this.bullets.filter((b) => !Object.is(b, bullet));
        wall.fillColor = bullet.color;
      }
    });
  }

  playerDied(player) {
    this.deadPlayers.push(player);
    player.x = -500;
    player.y = -500;
    const remainingPlayers = this.players.filter((p) => !Object.is(player, p));
    const teamBlue = remainingPlayers.filter((p) => p.color === Color.BLUE);
    const teamRed = remainingPlayers.filter((p) => p.color === Color.RED);

    if (teamBlue.length === 0) {
      this.deadPlayers.forEach((p) => {
        if (p.color === Color.BLUE) {
          p.notifyLose();
        } else {
          p.notifyWin();
        }
      });
      teamRed.forEach((p) => p.notifyWin());
      this.end();
    } else if (teamRed.length === 0) {
      this.deadPlayers.forEach((p) => {
        if (p.color === Color.RED) {
          p.notifyLose();
        } else {
          p.notifyWin();
        }
      });
      teamBlue.forEach((p) => p.notifyWin());
      this.end();
    } else {
      this.players = remainingPlayers;
      player.notifyDeath();
    }
  }

  playerDisconnected(player) {
    if (!this.ended) {
      this.playerDied(player);
    }
  }

  checkPlayerCollisionPlayer(player1) {
    this.players.forEach((player2) => {
      if (!Object.is(player1, player2)) {
        if (Util.collisionCircleCircle(player1, player2)) {
          let alpha = Math.atan((player2.y - player1.y) / (player2.x - player1.x));
          alpha = alpha || 0;
          player1.x += Math.sign(player1.x - player2.x) * config.PLAYER_REPULSION * Math.cos(alpha);
          player1.y += Math.sign(player1.y - player2.y) * config.PLAYER_REPULSION * Math.sin(alpha);
        }
      }
    });
  }

  timeIsOver() {
    this.players.concat(this.deadPlayers).forEach((player) => player.notifyTimeOver());
    this.end();
  }

  end() {
    this.ended = true;
    console.log('game ended');
    clearInterval(this.interval);
  }

  loop() {
    if (this.count % 100 === 0) {
      this.timer -= 1;
      console.log(this.timer);
      if (this.timer === 0) {
        this.timeIsOver();
      }
    }

    this.update();

    this.count += 1;
  }

  update() {
    this.bullets.forEach((bullet) => {
      bullet.update();
      this.checkWallCollisionBullet(bullet);
      this.checkSomethingHitsPortal(bullet);
    });
    this.players.forEach((player) => {
      this.checkPlayerCollisionPlayer(player);
      player.update();
      this.checkWallCollisionPlayer(player);

      this.checkBulletHitsPlayer(player);
      this.checkPlayerHitsPowerUp(player);
      this.checkSomethingHitsPortal(player);
    });

    this.players.concat(this.deadPlayers).forEach((player) => {
      player.notifyUpdate(
        this.getOtherPlayers(player),
        this.bullets,
        this.timer,
        this.walls,
        this.powerUps,
        this.calculateTeamLives(),
        this.portals
      );
    });
  }
}
