import Game from '../../src/server/game';

describe('game test', () => {
  let player1;
  let player2;
  let game;

  beforeEach(() => {
    player1 = { notifyStart: jest.fn() };
    player2 = { notifyStart: jest.fn() };

    game = new Game(player1, player2);
  });

  test('test constructor', () => {
    expect(game.player1).toBe(player1);
    expect(game.player2).toBe(player2);
    expect(game.bullets).toEqual([]);
  });

  test('test game start', () => {
    game.start();

    expect(game.timer).toBe(60);
    expect(game.count).toBe(0);

    expect(game.player1.x).toBe(100);
    expect(game.player1.y).toBe(100);
    expect(game.player1.color).toBe('blue');

    expect(game.player2.x).toBe(200);
    expect(game.player2.y).toBe(200);
    expect(game.player2.color).toBe('red');

    expect(game.player1.notifyStart.mock.calls.length).toBe(1);
    expect(game.player2.notifyStart.mock.calls.length).toBe(1);

    expect(game.player1.notifyStart.mock.calls[0][0]).toBe(player2);
    expect(game.player1.notifyStart.mock.calls[0][1]).toBe(60);
    expect(game.player2.notifyStart.mock.calls[0][0]).toBe(player1);
    expect(game.player2.notifyStart.mock.calls[0][1]).toBe(60);

    expect(game.player1.game).toBe(game);
    expect(game.player2.game).toBe(game);

    expect(game.player1.waiting).toBe(false);
    expect(game.player2.waiting).toBe(false);
  });

  test('game add bullet', () => {
    const bullet = {};
    game.addBullet(bullet);

    expect(game.bullets).toEqual([bullet]);
  });
});
