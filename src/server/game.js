export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.bullets = [];
  }

  start() {
    this.player1.x = 100; // Player 1 auf linker Seite der Arena
    this.player1.y = 100;
    this.player1.dx = 1;
    this.player1.dy = 1;

    this.player2.x = 200; // Player 2 auf anderer Position
    this.player2.y = 200;
    this.player2.dx = 1;
    this.player2.dy = 1;

    this.player1.notifyStart(this.player2); // Countdown einblenden
    this.player2.notifyStart(this.player1); // oder sowas PLUS Info wo anderer Gegner steht

    this.player1.game = this;
    this.player2.game = this;
    setInterval(this.loop.bind(this), 100);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  loop() {
    this.player1.update();
    this.player2.update();

    this.bullets.forEach((bullet) => bullet.update());

    const bullets = this.bullets.map((b) => {
      return { x: b.x, y: b.y, angle: b.angle };
    });

    this.player1.notifyUpdate(this.player2, bullets);
    this.player2.notifyUpdate(this.player1, bullets);
  }
}
