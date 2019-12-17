import { powerUpTypes } from './enums';

export default class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = 10;
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
    if (!player.isShielded) {
      player.isShielded = true;
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
