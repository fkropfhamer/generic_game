import { powerUpTypes } from './enums';
import config from './config';

export default class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.POWERUP_RADIUS;
    this.color = type === powerUpTypes.SHIELD ? 'brown' : 'green';
    this.type = type;
  }

  static mapPowerups(powerUp) {
    return powerUp.map((p) => {
      return {
        x: p.x,
        y: p.y,
        radius: p.radius,
        color: p.color,
      };
    });
  }

  static addHealthUpdate(player) {
    if (player.lives < 3) {
      player.lives += 1;
    }
  }

  static addShieldUpdate(player) {
    player.isShielded = true;
  }

  static addSpeedUpdate(player) {
    player.speed *= 2;
    setTimeout(() => {
      player.speed = config.PLAYER_SPEED;
    }, 5000);
  }

  // static addBulletUpdate(player) {

  // }

  update(player) {
    switch (this.type) {
      case powerUpTypes.ADDHEALTH:
        PowerUp.addHealthUpdate(player);
        break;
      case powerUpTypes.SHIELD:
        PowerUp.addShieldUpdate(player);
        break;
      case powerUpTypes.SPEED:
        PowerUp.addSpeedUpdate(player);
        break;
      default:
        throw Error(`${this.type} type does not exist`);
    }
  }
}
