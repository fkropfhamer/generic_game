export default class Bullet {
  constructor(socket, player) {
    this.socket = socket;
    this.setupSocket();
    this.position = { x: player.x, y: player.y };
    this.distanceTraveled = 0;
    this.source = player;
    this.speed = 1;
    this.angle = player.angle;

    // this.destroyed = false;
  }

  update() {
    this.position.x += this.speed * Math.cos(this.angle);
    this.position.y += this.speed * Math.sin(this.angle);
  }
}
