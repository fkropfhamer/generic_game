import config from './config';
import { iceSandTypes } from './enums';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = config.ICESAND_RADIUS;
    this.type = type;
  }

  static mapIceSand(iceSandFields) {
    return iceSandFields.map((isf) => {
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
    switch (this.type) {
      case iceSandTypes.ICE:
        walkingOnEffect = config.ICE_SPEED;
        break;
      case iceSandTypes.SAND:
        walkingOnEffect = config.SAND_SPEED;
        break;
      default:
        throw Error('unknown type');
    }
    player.speed = config.PLAYER_SPEED * walkingOnEffect;
  }
}
