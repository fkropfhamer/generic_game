import config from './config';

export default class IceSand {
  constructor(powerup) {
    this.x = powerup.x;
    this.y = powerup.y;
    this.duration = powerup.powerupDuration;
    this.radius = powerup.powerupRadius;
    this.color = powerup.powerupColor;
    this.type = powerup.type;
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
