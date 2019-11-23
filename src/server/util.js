export default class Util {
  static halfIfAnotherKeyIsPressed(key1, key2) {
    if (key1 || key2) {
      return 0.5;
    }
    return 1;
  }
}
