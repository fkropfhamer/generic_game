export default class Util {
  static halfIfAnotherKeyIsPressed(key1, key2) {
    if (key1 || key2) {
      return 0.5;
    }
    return 1;
  }

  static mapPlayers(players) {
    return players.map((player) => {
      return {
        x: player.x,
        y: player.y,
        angle: player.angle,
        color: player.color,
        lifes: player.lifes,
        face: player.face,
      };
    });
  }
}
