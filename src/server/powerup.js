/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import config from './config';
import {powerUpTypes} from './config';

export default class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    //this.duration = config.powerupDuration;
    this.radius = 10;
    this.color = 'green';
    this.type = type;
    }

    static mapPowerups(powerup) {
      return powerup.map((p) => {
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
    if (!player.shieldActivated) {
      player.shieldActivated = true;
    }
  }

  update(player) {
    switch (this.type) {
      case powerUpTypes.ADDHEALTH:
        PowerUp.addHealthUpdate(player);
        break;
      case powerUpTypes.SHIELD:
        PowerUp.addShieldUpdate(player);
        break;
      default:
        throw Error('type does not exist');
    }
  }
}
