import config from './config';

export default class IceSand {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = config.ICE_SAND_EXTENT.width;
    this.height = config.ICE_SAND_EXTENT.height;
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
}
