import IceSand from '../../src/server/iceSand';
import { iceSandTypes } from '../../src/server/enums';

describe('icesand', () => {
  let iceSand;
  let player;

  beforeEach(() => {
    iceSand = new IceSand(1, 2, 'test');
    player = { speed: 3 };
  });

  test('constructor', () => {
    expect(iceSand.x).toBe(1);
    expect(iceSand.y).toBe(2);
    expect(iceSand.type).toBe('test');
    expect(iceSand.radius).toBe(70);
  });

  test('map ice sand', () => {
    const iceSand2 = new IceSand(3, 4, 'test2');

    const mappedIceSand = IceSand.mapIceSand([iceSand, iceSand2]);

    expect(mappedIceSand).toEqual([
      {
        x: 1,
        y: 2,
        radius: 70,
        type: 'test',
      },
      {
        x: 3,
        y: 4,
        radius: 70,
        type: 'test2',
      },
    ]);
  });

  test('manipulate player ice', () => {
    iceSand.type = iceSandTypes.ICE;
    iceSand.manipulatePlayer(player);

    expect(player.speed).toBe(12);
  });

  test('manipulate player sand', () => {
    iceSand.type = iceSandTypes.SAND;
    iceSand.manipulatePlayer(player);

    expect(player.speed).toBe(0.2 * 3);
  });

  test('manipulate player unknown', () => {
    expect(() => iceSand.manipulatePlayer(player)).toThrow('unknown type');
  });
});
