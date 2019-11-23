export default class Bullet {
  constructor(player) {
    // this.position = { x: player.x, y: player.y };
    this.x = player.x;
    this.y = player.y;
    this.duration = 1000;
    this.player = player;
    this.speed = 5;
    this.angle = player.angle;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.duration -= 1;
  }
}
