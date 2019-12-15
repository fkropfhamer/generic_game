/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import config from './config';

export default class PowerUp {
  constructor() {
    this.x = config.powerupX;
    this.y = config.powerupY;
    this.duration = config.powerupDuration;
    this.radius = config.powerupRadius;
    this.color = config.powerupColor;
    }
}