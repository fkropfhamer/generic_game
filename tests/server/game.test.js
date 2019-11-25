import Game from '../../src/server/game';

describe('game test', () => {
  let player1;
  let player2;
  let game;

  beforeEach(() => {
    player1 = {
      notifyStart: jest.fn(),
      notifyOpponentDisconnected: jest.fn(),
      notifyTimeOver: jest.fn(),
      notifyUpdate: jest.fn(),
      update: jest.fn(),
    };
    player2 = {
      notifyStart: jest.fn(),
      notifyOpponentDisconnected: jest.fn(),
      notifyTimeOver: jest.fn(),
      notifyUpdate: jest.fn(),
      update: jest.fn(),
    };

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

  test('game player1 disconnected', () => {
    game.end = jest.fn();
    game.playerDisconnected(player1);

    expect(player2.notifyOpponentDisconnected.mock.calls.length).toBe(1);
    expect(game.end.mock.calls.length).toBe(1);
  });

  test('game player2 disconnected', () => {
    game.end = jest.fn();
    game.playerDisconnected(player2);

    expect(player1.notifyOpponentDisconnected.mock.calls.length).toBe(1);
    expect(game.end.mock.calls.length).toBe(1);
  });

  test('game time is over', () => {
    game.end = jest.fn();
    game.timeIsOver();

    expect(player1.notifyTimeOver.mock.calls.length).toBe(1);
    expect(player2.notifyTimeOver.mock.calls.length).toBe(1);
  });

  test('game loop decrement count', () => {
    game.update = jest.fn();
    game.count = 100;
    game.timer = 60;
    game.loop();

    expect(game.timer).toBe(59);
    expect(game.count).toBe(101);
    expect(game.update.mock.calls.length).toBe(1);
  });

  test('game loop decrement count end game', () => {
    game.update = jest.fn();
    game.timeIsOver = jest.fn();
    game.count = 100;
    game.timer = 1;
    game.loop();

    expect(game.timer).toBe(0);
    expect(game.count).toBe(101);
    expect(game.update.mock.calls.length).toBe(1);
    expect(game.timeIsOver.mock.calls.length).toBe(1);
  });

  test('game loop', () => {
    game.update = jest.fn();
    game.timeIsOver = jest.fn();
    game.count = 50;
    game.timer = 10;
    game.loop();

    expect(game.timer).toBe(10);
    expect(game.count).toBe(51);
    expect(game.update.mock.calls.length).toBe(1);
    expect(game.timeIsOver.mock.calls.length).toBe(0);
  });

  test('game update no bullets', () => {
    game.bullets = [];
    game.update();

    expect(player1.update.mock.calls.length).toBe(1);
    expect(player2.update.mock.calls.length).toBe(1);

    expect(player1.notifyUpdate.mock.calls.length).toBe(1);
    expect(player2.notifyUpdate.mock.calls.length).toBe(1);
  });
});
