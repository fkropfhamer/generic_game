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
});
