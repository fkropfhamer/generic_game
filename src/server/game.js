import config from './config';
import Util from './util';
import PowerUp from './powerup';
import {powerUpTypes} from './config';

export default class Game {
  constructor(players) {
    this.players = players;
    this.bullets = [];
    this.deadPlayers = [];
    this.walls = JSON.parse(JSON.stringify(config.walls));
    this.powerups = config.powerup;
  }

  start() {
    this.timer = config.gameDuration;
    this.count = 0;

    this.players.forEach((player, i) => {
      player.x = config.playerstartingPositions[i].x;
      player.y = config.playerstartingPositions[i].y;
      player.lives = config.playerLives;
      player.color = i % 2 === 0 ? 'blue' : 'red';
    });

    this.players.forEach((player) => {
      player.notifyStart(this.getOtherPlayers(player), this.timer, this.walls, this.powerups);
      player.game = this;
      player.isWaiting = false;
    });

    this.interval = setInterval(this.loop.bind(this), 10);
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
          player.lives -= 1;
          if (player.lives <= 0) {
            this.playerDied(player);
          }
        }
      }
    });
  }

  checkPlayerHitsPowerUp(player) {
    this.powerups.forEach((powerup) => {
      if (Util.collisionCircleCircle(powerup, player)) {
        console.log(powerup);
        powerup.update(player);
      }
    });
  }

  checkWallCollisionPlayer(player) {
    this.walls.forEach((wall) => {
      const playerCollides = Util.collisionRectCircle(wall, player);
      if (playerCollides) {
        const angle = playerCollides.angle + wall.angle;
        const dis = config.playerRadius - playerCollides.dis;

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
    const remainingPlayers = this.players.filter((p) => !Object.is(player, p));
    const teamBlue = remainingPlayers.filter((p) => p.color === 'blue');
    const teamRed = remainingPlayers.filter((p) => p.color === 'red');

    if (teamBlue.length === 0) {
      this.deadPlayers.forEach((p) => {
        if (p.color === 'blue') {
          p.notifyLose();
        } else {
          p.notifyWin();
        }
      });
      teamRed.forEach((p) => p.notifyWin());
      this.end();
    } else if (teamRed.length === 0) {
      this.deadPlayers.forEach((p) => {
        if (p.color === 'red') {
          p.notifyLose();
        } else {
          p.notifyWin();
        }
      });
      teamBlue.forEach((p) => p.notifyWin());
      this.end();
    } else {
      this.players = remainingPlayers;
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
          player1.x += Math.sign(player1.x - player2.x) * config.playerRepulsion * Math.cos(alpha);
          player1.y += Math.sign(player1.y - player2.y) * config.playerRepulsion * Math.sin(alpha);
        }
      }
    });
  }

  timeIsOver() {
    this.players.forEach((player) => player.notifyTimeOver());
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
    });
    this.players.forEach((player) => {
      this.checkPlayerCollisionPlayer(player);
      player.update();
      this.checkWallCollisionPlayer(player);

      this.checkBulletHitsPlayer(player);
      this.checkPlayerHitsPowerUp(player);
    });

    const bullets = this.bullets.map((b) => {
      return {
        x: b.x,
        y: b.y,
        angle: b.angle,
        color: b.color,
      };
    });

    this.players.forEach((player) => {
      player.notifyUpdate(
        this.getOtherPlayers(player),
        bullets,
        this.timer,
        this.walls,
        this.powerups
      );
    });
  }
}
