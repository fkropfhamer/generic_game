/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import config from './config';

export default class PowerUp {
  constructor(x, y, color, radius) {
    this.x = x;
    this.y = y;
    //this.duration = config.powerupDuration;
    this.radius = radius;
    this.color = color;
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
}