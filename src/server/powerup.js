import { powerUpTypes } from './enums';
import config from './config';

export default class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.POWERUP_RADIUS;
    this.type = type;
    if (this.type === powerUpTypes.SHIELD) {
      this.color = 'brown';
    } else if (this.type === powerUpTypes.FREEZE) {
      this.color = 'blue';
    } else if (this.type === powerUpTypes.ADDHEALTH) {
      this.color = 'green';
    } else {
      this.color = 'yellow';
    }
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

  static freezeUp(player) {
    player.freezingOthers = true;
    player.gotFreezed = false;
  }

  update(player) {
    switch (this.type) {
      case powerUpTypes.ADDHEALTH:
        PowerUp.addHealthUpdate(player);
        break;
      case powerUpTypes.FREEZE:
        PowerUp.freezeUp(player);
        break;
      case powerUpTypes.SHIELD:
        PowerUp.addShieldUpdate(player);
        break;
      default:
        throw Error(`${this.type} type does not exist`);
    }
  }
}
