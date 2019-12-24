import PowerUp from '../../src/server/powerup';
import { powerUpTypes } from '../../dist/enums';
import config from '../../src/server/config';

describe('powerup', () => {
  let powerup;

  beforeAll(() => {
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
    expect(exception).toThrow('test type does not exist')
  });
});
