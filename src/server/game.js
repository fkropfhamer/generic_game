import config from './config';
import { objectTypeAnnotation } from '@babel/types';

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
      player.lifes = config.playerLives;
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

  bulletHitsPlayer() {
    this.bullets.forEach((bullet) => {
      this.players.forEach((player) => {
        if (bullet.color !== player.color) {
          const playerDistance = Math.sqrt((player.x - bullet.x) ** 2 + (player.y - bullet.y) ** 2);
          const radiusDistance = config.bulletRadius + config.playerRadius;
          if (playerDistance <= radiusDistance) {
            this.bullets = this.bullets.filter((b) => !Object.is(bullet, b));
            player.lifes -= 1;
          }
        }
      });
    });
  }

  playerDisconnected(player) {
    this.players.forEach((p) => {
      if (!Object.is(p, player)) {
        p.notifyOpponentDisconnected();
      }
    });
    this.end();
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
    this.players.forEach((player) => player.update());

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
