export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    this.player1.notifyStart();
    this.player2.notifyStart();

    // setInterval(this.loop.bind(this), 100);
  }

  loop() {
    this.player1.update();
    this.player2.update();

    // this.bullets.update()
    this.player1.notifyUpdate();
    this.player2.notifyUpdate();
  }
}
