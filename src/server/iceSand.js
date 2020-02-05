import config from './config';
import { iceSandTypes } from './enums';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.radius = config.ICESAND_RADIUS;
    this.type = type;
    this.angle = 0;
  }

  static mapIceSand(iceSandFields) {
    return iceSandFields.map((isf) => {
      return {
        x: isf.x,
        y: isf.y,
        width: isf.width,
        height: isf.height,
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
