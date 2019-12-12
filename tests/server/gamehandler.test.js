import GameHandler from '../../src/server/gamehandler';
import server from '../../src/server/server';
import Player from '../../src/server/player';

jest.mock('../../src/server/player');

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
});
