import PowerUp from '../../server/src/powerup';
import { powerUpTypes } from '../../shared/enums';
import config from '../../shared/config';

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
      type: 4,
    };

    const mappedPowerUp = {
      x: 1,
      y: 2,
      radius: config.POWERUP_RADIUS,
      type: powerUpTypes.ADDHEALTH,
    };

    const mappedPowerUps = PowerUp.mapPowerups([powerup, powerup2]);

    expect(mappedPowerUps).toEqual([mappedPowerUp, powerup2]);
  });

  test('powerup type speed', () => {
    const player = {};

    powerup.type = powerUpTypes.SPEED;
    powerup.update(player);

    expect(player.changedSpeedPowerupActive).toBe(750);
  });

  test('powerup type bullet', () => {
    const player = {};

    powerup.type = powerUpTypes.FIRERATE;
    powerup.update(player);

    expect(player.fireRateActivated).toBe(750);
  });

  test('powerup type freezeUp', () => {
    const player = { isFrozen: false };
    const players = [{}, {}];

    powerup.type = powerUpTypes.FREEZE;
    powerup.update(player, players);

    expect(players[0].isFrozen).toBe(750);
    expect(players[1].isFrozen).toBe(750);
    expect(player.isFrozen).toBe(false);
  });
});
