import config from '../../shared/config';

export default class Bullet {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.player = player;
    this.speed = config.BULLET_SPEED;
    this.angle = player.angle;
    this.color = player.color;
    this.radius = config.BULLET_RADIUS;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
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
