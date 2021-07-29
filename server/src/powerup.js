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

  static addLife(player) {
    if (player.lives < config.PLAYER_LIVES) {
      player.lives += 1;
    }
  }

  static addShield(player) {
    player.isShielded = true;
  }

  static increaseSpeed(player) {
    player.changedSpeedPowerupActive = config.POWERUP_DURATION;
  }

  static increaseFirerate(player) {
    player.fireRateActivated = config.POWERUP_DURATION;
  }

  static freezeOpponent(otherPlayers) {
    otherPlayers.forEach((player) => {
      player.isFrozen = config.POWERUP_DURATION;
    });
  }

  update(player, otherPlayers) {
    switch (this.type) {
      case powerUpTypes.ADDHEALTH:
        PowerUp.addLife(player);
        break;
      case powerUpTypes.SHIELD:
        PowerUp.addShield(player);
        break;
      case powerUpTypes.SPEED:
        PowerUp.increaseSpeed(player);
        break;
      case powerUpTypes.FIRERATE:
        PowerUp.increaseFirerate(player);
        break;
      case powerUpTypes.FREEZE:
        PowerUp.freezeOpponent(otherPlayers);
        break;
      default:
        throw Error(`${this.type} type does not exist`);
    }
  }
}
