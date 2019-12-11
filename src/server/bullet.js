import config from './config';

export default class Bullet {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.duration = config.bulletDuration;
    this.player = player;
    this.speed = config.bulletSpeed;
    this.angle = player.angle;
    this.color = player.color;
    this.radius = config.bulletRadius;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.duration -= 1;
  }
}
