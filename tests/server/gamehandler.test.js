import GameHandler from '../../src/server/gamehandler';
import server from '../../src/server/server';
import Player from '../../src/server/player';
import Game from '../../src/server/game';

jest.mock('../../src/server/player');
jest.mock('../../src/server/game');

jest.mock('socket.io', () => {
  return {
    default: jest.fn((s) => {
      return {
        server: s,
        on: jest.fn(),
      };
    }),
    __esModule: true,
    on: jest.fn(),
  };
});

describe('gamehandler', () => {
  let gamehandler;

  beforeEach(() => {
    Game.mockClear();
    Player.mockClear();

    server.listen = jest.fn((port) => {
      return { port };
    });
    gamehandler = new GameHandler();
  });

  test('constructor', () => {
    expect(gamehandler.waitingPlayer).toBe(false);
    expect(gamehandler.waitingPlayers).toEqual([]);
  });

  test('gamehandler listen', () => {
    const port = 80;

    gamehandler.listen(port);

    expect(gamehandler.server).toEqual({ port });
    expect(server.listen.mock.calls.length).toBe(1);
    expect(server.listen.mock.calls[0][0]).toBe(port);

    expect(gamehandler.io.server).toBe(gamehandler.server);
  });

  test('gamehandler connection event', () => {
    const socket = {};

    const onConnectionMock = {};

    gamehandler.io = {
      on: jest.fn((event, cb) => {
        onConnectionMock[event] = cb;
      }),
    };

    gamehandler.setup();

    onConnectionMock.connection(socket);
    expect(Player).toHaveBeenCalledTimes(1);
  });

  test('game handler waiting player disconnected mode = normal', () => {
    const player = { mode: 'normal' };

    gamehandler.waitingPlayer = player;
    gamehandler.waitingPlayerDisconnected(player);

    expect(gamehandler.waitingPlayer).toBe(false);
  });

  test('game handler waiting player disconnected mode = teams', () => {
    const player1 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player2 = { mode: 'teams', notifyWaiting: jest.fn() };

    gamehandler.waitingPlayers = [player1, player2];
    gamehandler.waitingPlayerDisconnected(player1);

    expect(gamehandler.waitingPlayers).toEqual([player2]);
    expect(player2.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player2.notifyWaiting.mock.calls[0][0]).toBe(3);
  });

  test('gamehandler notify waiting players', () => {
    const player1 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player2 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player3 = { mode: 'teams', notifyWaiting: jest.fn() };

    gamehandler.waitingPlayers = [player1, player2, player3];

    gamehandler.notifyWaitingPlayers();

    expect(player1.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player2.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player3.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player1.notifyWaiting.mock.calls[0][0]).toBe(1);
    expect(player2.notifyWaiting.mock.calls[0][0]).toBe(1);
    expect(player3.notifyWaiting.mock.calls[0][0]).toBe(1);
  });

  test('gamehandler player is ready mode = normal and has to wait', () => {
    const player = { notifyWaiting: jest.fn() };

    gamehandler.playerIsReady(player, 'normal');

    expect(gamehandler.waitingPlayer).toBe(player);
    expect(player.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player.notifyWaiting.mock.calls[0][0]).toBe(1);
  });

  test('gamehandler player is ready mode = normal and game starts', () => {
    const player1 = {};
    const player2 = {};

    gamehandler.waitingPlayer = player1;

    gamehandler.playerIsReady(player2, 'normal');

    expect(gamehandler.waitingPlayer).toBe(false);
    expect(Game).toHaveBeenCalledTimes(1);
    expect(Game.mock.calls[0][0]).toEqual([player2, player1]);
    expect(Game.mock.instances[0].start).toHaveBeenCalledTimes(1);
  });

  test('gamehandler player is ready mode = teams and has to wait', () => {
    const player = { notifyWaiting: jest.fn() };

    gamehandler.playerIsReady(player, 'teams');

    expect(gamehandler.waitingPlayers).toEqual([player]);
    expect(player.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player.notifyWaiting).toHaveBeenCalledWith(3);
  });

  test('gamehandler player is ready mode = teams and has to wait', () => {
    const player1 = {};
    const player2 = {};
    const player3 = {};
    const player4 = {};

    gamehandler.waitingPlayers = [player1, player2, player3];

    gamehandler.playerIsReady(player4, 'teams');

    expect(gamehandler.waitingPlayers).toEqual([]);
    expect(Game).toHaveBeenCalledTimes(1);
    expect(Game.mock.calls[0][0]).toEqual([player1, player2, player3, player4]);
    expect(Game.mock.instances[0].start).toHaveBeenCalledTimes(1);
  });

  test('game player is ready unknown mode', () => {
    const exception = () => {
      gamehandler.playerIsReady({}, 'test');
    };

    expect(exception).toThrow(Error);
  });
});
