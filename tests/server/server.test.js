import express from 'express';
import Server from '../../src/server/server';
import Player from '../../src/server/player';
import Game from '../../src/server/game';

// eslint-disable-next-line global-require
jest.mock('express', () => require('jest-express'));

jest.mock('../../src/server/player');
jest.mock('../../src/server/game');

jest.mock('socket.io', () => {
  return {
    default: jest.fn((s) => {
      return {
        webSocket: s,
        on: jest.fn(),
      };
    }),
    __esModule: true,
    on: jest.fn(),
  };
});

describe('server', () => {
  let server;

  beforeEach(() => {
    Game.mockClear();
    Player.mockClear();

    server = new Server();
  });

  test('constructor', () => {
    expect(server.waitingPlayer).toBe(false);
    expect(server.waitingPlayers).toEqual([]);
  });

  test('server start', () => {
    server.listen = jest.fn();
    server.setupSocket = jest.fn();

    server.start(8080);

    expect(server.listen).toHaveBeenCalledTimes(1);
    expect(server.listen).toHaveBeenCalledWith(8080);
    expect(server.setupSocket).toHaveBeenCalledTimes(1);
  });

  test('server listen', () => {
    const port = 80;

    server.listen(port);

    expect(express.static).toHaveBeenCalledTimes(1);
    expect(express.static).toHaveBeenCalledWith('public');

    expect(server.io.webSocket).toBe(server.fileServer);
  });

  test('server connection event', () => {
    const socket = {};

    const onConnectionMock = {};

    server.io = {
      on: jest.fn((event, cb) => {
        onConnectionMock[event] = cb;
      }),
    };

    server.setupSocket();

    onConnectionMock.connection(socket);
    expect(Player).toHaveBeenCalledTimes(1);
  });

  test('game handler waiting player disconnected mode = normal', () => {
    const player = { mode: 'normal' };

    server.waitingPlayer = player;
    server.waitingPlayerDisconnected(player);

    expect(server.waitingPlayer).toBe(false);
  });

  test('game handler waiting player disconnected mode = teams', () => {
    const player1 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player2 = { mode: 'teams', notifyWaiting: jest.fn() };

    server.waitingPlayers = [player1, player2];
    server.waitingPlayerDisconnected(player1);

    expect(server.waitingPlayers).toEqual([player2]);
    expect(player2.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player2.notifyWaiting.mock.calls[0][0]).toBe(3);
  });

  test('server notify waiting players', () => {
    const player1 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player2 = { mode: 'teams', notifyWaiting: jest.fn() };
    const player3 = { mode: 'teams', notifyWaiting: jest.fn() };

    server.waitingPlayers = [player1, player2, player3];

    server.notifyWaitingPlayers();

    expect(player1.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player2.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player3.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player1.notifyWaiting.mock.calls[0][0]).toBe(1);
    expect(player2.notifyWaiting.mock.calls[0][0]).toBe(1);
    expect(player3.notifyWaiting.mock.calls[0][0]).toBe(1);
  });

  test('server player is ready mode = normal and has to wait', () => {
    const player = { notifyWaiting: jest.fn() };

    server.playerIsReady(player, 'normal');

    expect(server.waitingPlayer).toBe(player);
    expect(player.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player.notifyWaiting.mock.calls[0][0]).toBe(1);
  });

  test('server player is ready mode = normal and game starts', () => {
    const player1 = {};
    const player2 = {};

    server.waitingPlayer = player1;

    server.playerIsReady(player2, 'normal');

    expect(server.waitingPlayer).toBe(false);
    expect(Game).toHaveBeenCalledTimes(1);
    expect(Game.mock.calls[0][0]).toEqual([player2, player1]);
    expect(Game.mock.instances[0].start).toHaveBeenCalledTimes(1);
  });

  test('server player is ready mode = teams and has to wait', () => {
    const player = { notifyWaiting: jest.fn() };

    server.playerIsReady(player, 'teams');

    expect(server.waitingPlayers).toEqual([player]);
    expect(player.notifyWaiting).toHaveBeenCalledTimes(1);
    expect(player.notifyWaiting).toHaveBeenCalledWith(3);
  });

  test('server player is ready mode = teams and has to wait', () => {
    const player1 = {};
    const player2 = {};
    const player3 = {};
    const player4 = {};

    server.waitingPlayers = [player1, player2, player3];

    server.playerIsReady(player4, 'teams');

    expect(server.waitingPlayers).toEqual([]);
    expect(Game).toHaveBeenCalledTimes(1);
    expect(Game.mock.calls[0][0]).toEqual([player1, player2, player3, player4]);
    expect(Game.mock.instances[0].start).toHaveBeenCalledTimes(1);
  });

  test('game player is ready unknown mode', () => {
    const exception = () => {
      server.playerIsReady({}, 'test');
    };

    expect(exception).toThrow(Error);
    expect(exception).toThrow('mode test unknown');
  });
});
