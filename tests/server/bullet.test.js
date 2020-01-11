import Bullet from '../../src/server/bullet';

describe('bullet test', () => {
  let bullet;
  let player;

  beforeEach(() => {
    player = {
      x: 100,
      y: 200,
      angle: Math.PI,
      color: 'blue',
    };
    bullet = new Bullet(player);
  });
  test('test bullet constructor', () => {
    expect(bullet.x).toBe(100);
    expect(bullet.y).toBe(200);
    expect(bullet.angle).toBe(Math.PI);
    expect(bullet.duration).toBe(1000);
    expect(bullet.player).toBe(player);
    expect(bullet.speed).toBe(5);
    expect(bullet.color).toBe('blue');
  });
  test('update bullet 180 degree', () => {
    bullet.update();

    expect(bullet.x).toBe(95);
    expect(bullet.y).toBe(200);
    expect(bullet.duration).toBe(999);
  });

  test('update bullet 90 degree', () => {
    bullet.angle = Math.PI / 2;
    bullet.update();

    expect(bullet.x).toBe(100);
    expect(bullet.y).toBe(205);
    expect(bullet.duration).toBe(999);
  });

  test('update bullet 0 degree', () => {
    bullet.angle = 0;
    bullet.update();

    expect(bullet.x).toBe(105);
    expect(bullet.y).toBe(200);
    expect(bullet.duration).toBe(999);
  });

  test('update bullet 270 degree', () => {
    bullet.angle = Math.PI * 1.5;
    bullet.update();

    expect(bullet.x).toBe(100);
    expect(bullet.y).toBe(195);
    expect(bullet.duration).toBe(999);
  });

  test('update bullet 45 degree', () => {
    bullet.angle = Math.PI / 4;
    bullet.update();

    expect(Math.round(bullet.x)).toBe(104);
    expect(Math.round(bullet.y)).toBe(204);
    expect(bullet.duration).toBe(999);
  });

  test('map players', () => {
    const bullet1 = {
      x: 1,
      y: 2,
      angle: 3,
      color: 4,
    };
    const bullet2 = {
      x: 5,
      y: 6,
      angle: 7,
      color: 8,
    };

    const bullets = [bullet1, bullet2];

    const mappedBullets = Bullet.mapBullets(bullets);
    expect(mappedBullets).toEqual(bullets);
  });
});
