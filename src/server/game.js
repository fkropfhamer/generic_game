/* eslint-disable class-methods-use-this */
import config from './config';

export default class Game {
  constructor(players) {
    this.players = players;
    this.bullets = [];
    this.deadPlayers = [];
    this.walls = config.walls;

  }

  start() {
    this.timer = config.gameDuration;
    this.count = 0;

    this.players.forEach((player, i) => {
      player.x = config.playerstartingPositions[i].x;
      player.y = config.playerstartingPositions[i].y;
      player.lives = config.playerLives;
      player.color = i % 2 === 0 ? 'blue' : 'red';
      // player.face = `face${i + 1}`;
    });

    this.players.forEach((player) => {
      player.notifyStart(this.getOtherPlayers(player), this.timer, this.walls);
      player.game = this;
      player.waiting = false;
    });

    this.interval = setInterval(this.loop.bind(this), 10);
  }

  getOtherPlayers(player) {
    return this.players.filter((p) => !Object.is(player, p));
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  bulletHitsPlayer() {
    this.bullets.forEach((bullet) => {
      this.players.forEach((player) => {
        if (bullet.color !== player.color) {
          const playerDistance = Math.sqrt((player.x - bullet.x) ** 2 + (player.y - bullet.y) ** 2);
          const radiusDistance = config.bulletRadius + config.playerRadius;
          if (playerDistance <= radiusDistance) {
            this.bullets = this.bullets.filter((b) => !Object.is(bullet, b));
            player.lives -= 1;
            if (player.lives <= 0) {
              this.playerDied(player);
              // player.notifyLose();
              // const winner = this.players.filter((p) => !Object.is(p, player));
              // winner.forEach((w) => w.notifyWin());
              // this.end();
            }
          }
        }
      });
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
    this.playerDied(player);
  }

  isOverlapping(player1) {
    this.players.forEach((player2) => {
      if (!Object.is(player1, player2)) {
        const playerDistance = Math.sqrt(
          (player2.x - player1.x) ** 2 + (player2.y - player1.y) ** 2
        );
        if (playerDistance <= config.playerRadius * 2) {
          const alpha = Math.atan((player2.y - player1.y) / (player2.x - player1.x));
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
    this.players.forEach((player) => {
      this.isOverlapping(player);
      player.update();
    });

    this.bullets.forEach((bullet) => bullet.update());

    const bullets = this.bullets.map((b) => {
      return {
        x: b.x,
        y: b.y,
        angle: b.angle,
        color: b.color,
      };
    });

    this.players.forEach((player) => {
      player.notifyUpdate(this.getOtherPlayers(player), bullets, this.timer);
    });

    this.bulletHitsPlayer();
  }
}
