import IceSand from '../../src/server/iceSand';

describe('icesand', () => {
  let iceSand;

  beforeEach(() => {
    iceSand = new IceSand(1, 2, 'test');
  });

  test('constructor', () => {
    expect(iceSand.x).toBe(1);
    expect(iceSand.y).toBe(2);
    expect(iceSand.type).toBe('test');
    expect(iceSand.height).toBe(180);
    expect(iceSand.width).toBe(320);
  });

  test('map ice sand', () => {
    const iceSand2 = new IceSand(3, 4, 'test2');

    const mappedIceSand = IceSand.mapIceSand([iceSand, iceSand2]);

    expect(mappedIceSand).toEqual([
      {
        x: 1,
        y: 2,
        width: 320,
        height: 180,
        type: 'test',
      },
      {
        x: 3,
        y: 4,
        width: 320,
        height: 180,
        type: 'test2',
      },
    ]);
  });
});
