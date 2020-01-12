import config from './config';

export default class Bullet {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.duration = config.BULLET_DURATION;
    this.player = player;
    this.speed = config.BULLET_SPEED;
    this.angle = player.angle;
    this.color = player.color;
    this.radius = config.BULLET_RADIUS;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.duration -= 1;
  }

  static mapBullets(bullets) {
    return bullets.map((bullet) => {
      return {
        x: bullet.x,
        y: bullet.y,
        angle: bullet.angle,
        color: bullet.color,
      };
    });
  }
}
