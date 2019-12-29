import PowerUp from '../../src/server/powerup';
import { powerUpTypes } from '../../src/server/enums';
import config from '../../src/server/config';

describe('powerup', () => {
  let powerup;

  beforeEach(() => {
    powerup = new PowerUp(1, 2, powerUpTypes.ADDHEALTH);
  });
  test('constructor', () => {
    expect(powerup.x).toBe(1);
    expect(powerup.y).toBe(2);
    expect(powerup.type).toBe(powerUpTypes.ADDHEALTH);
    expect(powerup.radius).toBe(config.POWERUP_RADIUS);
  });

  it('throws an error if the type is not known', () => {
    powerup.type = 'test';
    const exception = () => {
      powerup.update();
    };
    expect(exception).toThrow(Error);
    expect(exception).toThrow('test type does not exist');
  });

  test('powerup type addhealth live < 3', () => {
    const player = { lives: 0 };
    powerup.update(player);

    expect(player.lives).toBe(1);
  });

  test('powerup type addhealth live > 3', () => {
    const player = { lives: 4 };
    powerup.update(player);

    expect(player.lives).toBe(4);
  });

  test('powerup type addShield', () => {
    const player = { isShielded: false };
    powerup.type = powerUpTypes.SHIELD;
    powerup.update(player);

    expect(player.isShielded).toBe(true);
  });

  test('map powerups', () => {
    const powerup2 = {
      x: 1,
      y: 2,
      radius: 3,
      color: 4,
    };

    const mappedPowerUp = {
      x: 1,
      y: 2,
      radius: config.POWERUP_RADIUS,
      color: 'green',
    };

    const mappedPowerUps = PowerUp.mapPowerups([powerup, powerup2]);

    expect(mappedPowerUps).toEqual([mappedPowerUp, powerup2]);
  });
});
