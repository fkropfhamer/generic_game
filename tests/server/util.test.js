import Util from '../../src/server/util';

describe('Util test', () => {
  test('halve if two keys are pressed', () => {
    expect(Util.halfIfAnotherKeyIsPressed(true, true)).toBe(0.5);
  });
  test('halve if another key is pressed', () => {
    expect(Util.halfIfAnotherKeyIsPressed(false, true)).toBe(0.5);
    expect(Util.halfIfAnotherKeyIsPressed(true, false)).toBe(0.5);
  });
  test('full if no other key is pressed', () => {
    expect(Util.halfIfAnotherKeyIsPressed(false, false)).toBe(1);
  });

  test('mapPlayers empty', () => {
    expect(Util.mapPlayers([])).toEqual([]);
  });

  test('mapPlayers', () => {
    const players = [
      {
        x: 100,
        y: 200,
        angle: Math.PI,
        color: 'red',
        lifes: 4,
        face: 'face1',
      },
      {
        x: 300,
        y: 500,
        angle: 2 * Math.PI,
        color: 'blue',
        lifes: 1,
        face: 'face3',
      },
    ];

    expect(Util.mapPlayers(players)).toEqual(players);
  });
});
