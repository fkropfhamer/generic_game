import Util from '../../src/server/util';
import config from '../../src/server/config';

describe('Util test', () => {
  test('constructor', () => {
    expect(() => {
      const util = new Util();
      util.halfIfAnotherKeyIsPressed();
    }).toThrow('Util is an abstract class and and can´t initiated');
  });

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
        lives: 4,
        face: 'face1',
        hitAngle: Math.PI * 2,
        isShielded: true,
      },
      {
        x: 300,
        y: 500,
        angle: 2 * Math.PI,
        color: 'blue',
        lives: 1,
        face: 'face3',
        hitAngle: Math.PI,
        isShielded: false,
      },
    ];

    expect(Util.mapPlayers(players)).toEqual(players);
  });

  test('rotate point', () => {
    const point1 = { x: 3, y: 4 };
    const point2 = { x: 1, y: 5 };

    const rotatePoint = Util.rotatePointAroundPoint(point1, point2, Math.PI);
    expect(Math.round(rotatePoint.x)).toBe(-1);
    expect(rotatePoint.y).toBe(6);

    const rotateBack = Util.rotatePointAroundPoint(rotatePoint, point2, -Math.PI);
    expect(rotateBack).toEqual(point1);
  });

  test('get closest point from line', () => {
    const point1 = { x: 4, y: 6 };
    const point2 = { x: 1, y: 1 };
    const point3 = { x: 7, y: 1 };

    const closestPoint = Util.getClosestPointFromLine(point1, point2, point3);

    expect(closestPoint.x).toBe(4);
    expect(closestPoint.y).toBe(1);
  });

  test('calculate corner points', () => {
    const rect = {
      x: 10,
      y: 10,
      width: 5,
      height: 10,
    };
    const corners = Util.calculateCornerPoints(rect);
    expect(corners).toEqual({
      a: { x: 7.5, y: 5 },
      b: { x: 12.5, y: 5 },
      c: { x: 12.5, y: 15 },
      d: { x: 7.5, y: 15 },
    });
  });

  test('point distance', () => {
    const point1 = { x: 1, y: 1 };
    const point2 = { x: 11, y: 1 };

    expect(Util.pointDistance(point1, point2)).toBe(10);
  });

  test('collision rect circle', () => {
    const rect = {
      x: 10,
      y: 10,
      angle: Math.PI / 2,
      width: 10,
      height: 10,
    };

    const circle = { x: config.PLAYER_RADIUS + 15, y: config.PLAYER_RADIUS + 15 };

    expect(Util.collisionRectCircle(rect, circle)).toBe(false);

    const circle2 = { x: config.PLAYER_RADIUS + 14, y: config.PLAYER_RADIUS + 14 };

    expect(Util.collisionRectCircle(rect, circle2)).toBe(false);
  });

  test('collision rect circle top', () => {
    const rect = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    const circle = { x: 10, y: 20, radius: 6 };

    const result = Util.collisionRectCircle(rect, circle);

    expect(result).toEqual({ angle: Math.PI / 2, dis: 5 });
  });

  test('collision rect circle bottom', () => {
    const rect = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    const circle = { x: 10, y: 0, radius: 6 };

    const result = Util.collisionRectCircle(rect, circle);

    expect(result).toEqual({ angle: Math.PI * 1.5, dis: 5 });
  });

  test('collision rect circle left', () => {
    const rect = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    const circle = { x: 0, y: 10, radius: 6 };

    const result = Util.collisionRectCircle(rect, circle);

    expect(result).toEqual({ angle: Math.PI, dis: 5 });
  });

  test('collision rect circle right', () => {
    const rect = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    const circle = { x: 20, y: 10, radius: 6 };

    const result = Util.collisionRectCircle(rect, circle);

    expect(result).toEqual({ angle: 0, dis: 5 });
  });

  test('collision circle circle', () => {
    const circle1 = { x: 10, y: 10, radius: 2 };
    const circle2 = { x: 20, y: 20, radius: 5 };

    expect(Util.collisionCircleCircle(circle1, circle1)).toBe(true);
    expect(Util.collisionCircleCircle(circle2, circle2)).toBe(true);
    expect(Util.collisionCircleCircle(circle1, circle2)).toBe(false);
  });

  test('deepfreeze', () => {
    const testObject = { value1: 1, object1: { value2: 'test' } };
    const frozenTestObject = Util.deepFreeze(testObject);
    expect(Object.isFrozen(frozenTestObject)).toBe(true);
    expect(Object.isFrozen(frozenTestObject.object1)).toBe(true);
  });

  test('collisin rect circle', () => {
    const rect = {
      x: 1,
      y: 1,
      angle: 0,
      width: 1,
      height: 1,
    };

    const circle = { x: 1, y: 1, radius: 2 };

    expect(Util.collisionRectCircle(rect, circle)).toEqual({ angle: Math.PI * 1.5, dis: 0.5 });
  });
});
