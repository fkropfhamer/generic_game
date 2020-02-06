import config from './config';
import { iceSandTypes } from './enums';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = config.ICE_SAND_EXTENT.width;
    this.height = config.ICE_SAND_EXTENT.height;
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
    let walkingOnEffect = config.INITIALIZE_WITH_ZERO;
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
