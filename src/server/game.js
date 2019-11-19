export default class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    this.player1.x = 100;
    this.player1.y = 100;
   
    this.player2.x = 200;
    this.player2.y = 200;
   
    this.player1.notifyStart(this.player2);
    this.player2.notifyStart(this.player1);

    setInterval(this.loop.bind(this), 10);
  }

  loop() {
    this.player1.update();
    this.player2.update();

    // this.bullets.update()
    this.player1.notifyUpdate(this.player2);
    this.player2.notifyUpdate(this.player1);
  }
}
