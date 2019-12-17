import config from './config';

export default class IceSand {
  constructor(powerUp) {
    this.x = powerUp.x;
    this.y = powerUp.y;
    this.duration = powerUp.powerupDuration;
    this.radius = powerUp.powerupRadius;
    this.color = powerUp.powerupColor;
    this.type = powerUp.type;
  }

  manipulatePlayer(player) {
    let newSpeed = player.speed;
    if (this.type === config.powerUpTypes.ICE) {
      newSpeed = player.speed + config.speedUpIce;
    } else if (this.type === config.powerUpTypes.SAND) {
      newSpeed = player.speed - config.slowDownSand;
    }
    if (player.x <= this.x + this.radius && player.y <= this.y + this.radius) {
      player.speed = newSpeed;
    }
  }

  update(player) {
    this.manipulatePlayer(player);
  }
}
