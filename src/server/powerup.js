import { powerUpTypes } from './enums';
import config from './config';

export default class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.POWERUP_RADIUS;
    this.type = type;
  }

  static mapPowerups(powerUp) {
    return powerUp.map((p) => {
      return {
        x: p.x,
        y: p.y,
        radius: p.radius,
        type: p.type,
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
    player.changedSpeedPowerupActive = config.POWERUP_DURATION;
  }

  static addBulletUpdate(player) {
    player.fireRateActivated = config.POWERUP_DURATION;
  }

  static freezeUp(otherPlayers) {
    otherPlayers.forEach((player) => {
      player.isFreezed = config.POWERUP_DURATION;
    });
  }

  update(player, otherPlayers) {
    switch (this.type) {
      case powerUpTypes.FREEZE:
        PowerUp.freezeUp(otherPlayers);
        break;
      case powerUpTypes.ADDHEALTH:
        PowerUp.addHealthUpdate(player);
        break;
      case powerUpTypes.SHIELD:
        PowerUp.addShieldUpdate(player);
        break;
      case powerUpTypes.SPEED:
        PowerUp.addSpeedUpdate(player);
        break;
      case powerUpTypes.FIRERATE:
        PowerUp.addBulletUpdate(player);
        break;
      default:
        throw Error(`${this.type} type does not exist`);
    }
  }
}
