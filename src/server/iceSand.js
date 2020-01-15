import config from './config';
import { iceSandTypes } from './enums';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.ICESAND_RADIUS;
    this.type = type;
  }

  static mapIceSand(iceSandField) {
    return iceSandField.map((isf) => {
      return {
        x: isf.x,
        y: isf.y,
        radius: isf.radius,
        type: isf.type,
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
