import config from './config';

export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.bullets = [];
  }

  start() {
    this.timer = config.gameDuration;
    this.count = 0;

    this.player1.x = 100; // Player 1 auf linker Seite der Arena
    this.player1.y = 100;
    this.player1.lifes = config.playerLifes;
    this.player1.color = 'blue';

    this.player2.x = 200; // Player 2 auf anderer Position
    this.player2.y = 200;
    this.player2.lifes = config.playerLifes;
    this.player2.color = 'red';

    this.player1.notifyStart(this.player2, this.timer); // Countdown einblenden
    this.player2.notifyStart(this.player1, this.timer);

    this.player1.game = this;
    this.player2.game = this;
    this.player1.waiting = false;
    this.player2.waiting = false;

    this.interval = setInterval(this.loop.bind(this), 10);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  playerDisconnected(player) {
    if (Object.is(player, this.player1)) {
      this.player2.notifyOpponentDisconnected();
    } else {
      this.player1.notifyOpponentDisconnected();
    }

    this.end();
  }

  timeIsOver() {
    this.player1.notifyTimeOver();
    this.player2.notifyTimeOver();
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
    this.player1.update();
    this.player2.update();

    this.bullets.forEach((bullet) => bullet.update());

    const bullets = this.bullets.map((b) => {
      return {
        x: b.x,
        y: b.y,
        angle: b.angle,
        color: b.color,
      };
    });

    this.player1.notifyUpdate(this.player2, bullets, this.timer);
    this.player2.notifyUpdate(this.player1, bullets, this.timer);
  }
}
