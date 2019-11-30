/* eslint-disable class-methods-use-this */
import config from './config';

export default class Game {
  constructor(players) {
    this.players = players;
    this.bullets = [];
  }

  start() {
    this.timer = config.gameDuration;
    this.count = 0;

    this.players.forEach((player, i) => {
      player.x = config.playerstartingPositions[i].x;
      player.y = config.playerstartingPositions[i].y;
      player.lifes = config.playerLifes;
      player.color = i % 2 === 0 ? 'blue' : 'red';
      // player.face = `face${i + 1}`;
    });

    this.players.forEach((player) => {
      player.notifyStart(this.getOtherPlayers(player), this.timer);
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

  playerDisconnected(player) {
    this.players.forEach((p) => {
      if (!Object.is(p, player)) {
        p.notifyOpponentDisconnected();
      }
    });
    this.end();
  }

  isOverlapping(player1) {
    this.players.forEach((player2) => {
      if (!Object.is(player1, player2)) {
        const playerDistance = Math.sqrt((player2.x - player1.x) ** 2 + (player2.y - player1.y) ** 2);
        if (playerDistance <= config.playerRadius * 2) {
          const alphaP1 = Math.atan((player2.y - player1.y) / (player2.x - player1.x));
          player1.x -= config.playerRepulsion * Math.cos(alphaP1);
          player1.y -= config.playerRepulsion * Math.sin(alphaP1);
          return true;
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
      if (!this.isOverlapping(player)) {
        player.update();
      }
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
  }
}
