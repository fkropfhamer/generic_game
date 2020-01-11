import config from './config';
import { iceSandTypes } from './enums';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.ICESAND_RADIUS;
    this.type = type;
    if (this.type === iceSandTypes.ICE) {
      this.color = 'blue';
    } else {
      this.color = 'brown';
    }
  }

  static mapIceSand(iceSandField) {
    return iceSandField.map((isf) => {
      return {
        x: isf.x,
        y: isf.y,
        radius: isf.radius,
        color: isf.color,
      };
    });
  }

  manipulatePlayer(player) {
    let walkingOnEffect = 0;
    if (this.type === iceSandTypes.ICE) {
      walkingOnEffect += 100;
    }
    if (this.type === iceSandTypes.SAND) {
      walkingOnEffect -= 2;
    }
    player.speed = config.PLAYER_SPEED + walkingOnEffect;
    player.changedSpeedActive = true;
  }

  update(player) {
    this.manipulatePlayer(player);
  }
}
