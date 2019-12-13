import Player from '../../src/server/player';
import config from '../../src/server/config';

describe('player test', () => {
  let player;
  let socket;
  let gameHandler;
  const socketEventMocks = {};

  beforeEach(() => {
    socket = {
      on: jest.fn((event, cb) => {
        socketEventMocks[event] = cb;
      }),
      emit: jest.fn(),
    };
    gameHandler = { waitingPlayerDisconnected: jest.fn(), playerIsReady: jest.fn() };
    player = new Player(socket, gameHandler);
  });

  test('player constructor', () => {
    expect(player.socket).toBe(socket);
    expect(player.gameHandler).toBe(gameHandler);
    expect(player.speed).toBe(1);
    expect(player.radius).toBe(27.5);
    expect(player.angle).toBe(0);
    expect(socket.on.mock.calls.length).toBe(5);
    expect(socket.on.mock.calls[0][0]).toBe('keyspressed');
    expect(socket.on.mock.calls[1][0]).toBe('shoot');
    expect(socket.on.mock.calls[2][0]).toBe('update angle');
    expect(socket.on.mock.calls[3][0]).toBe('disconnect');
  });

  test('socket event onkeyspressed', () => {
    player.onKeysPressed({
      right: true,
      left: true,
      down: true,
      up: true,
    });

    expect(player.pressedRight).toBe(true);
    expect(player.pressedLeft).toBe(true);
    expect(player.pressedDown).toBe(true);
    expect(player.pressedUp).toBe(true);
  });

  test('socket event shoot', () => {
    player.createBullet = jest.fn();
    socketEventMocks.shoot({ angle: Math.PI });

    expect(player.angle).toBe(Math.PI);
    expect(player.createBullet.mock.calls.length).toBe(1);
    expect(player.shootingCount).toBe(config.shootingRate);
  });

  test('socket event shoot limited by shooting count', () => {
    player.createBullet = jest.fn();
    player.shootingCount = 10;
    socketEventMocks.shoot({ angle: Math.PI });

    expect(player.angle).toBe(0);
    expect(player.createBullet.mock.calls.length).toBe(0);
    expect(player.shootingCount).toBe(10);
  });

  test('socket event update angle', () => {
    socketEventMocks['update angle']({ angle: 3000 });

    expect(player.angle).toBe(3000);
  });

  test('socket event disconnect player is waiting', () => {
    player.isWaiting = true;
    socketEventMocks.disconnect();

    expect(gameHandler.waitingPlayerDisconnected.mock.calls.length).toBe(1);
    expect(gameHandler.waitingPlayerDisconnected.mock.calls[0][0]).toBe(player);
  });

  test('socket event disconnect game has started', () => {
    player.game = { playerDisconnected: jest.fn() };
    socketEventMocks.disconnect();

    expect(gameHandler.waitingPlayerDisconnected.mock.calls.length).toBe(0);
    expect(player.game.playerDisconnected.mock.calls.length).toBe(1);
    expect(player.game.playerDisconnected.mock.calls[0][0]).toBe(player);
  });

  test('socket event disconnect player not waiting and no game', () => {
    socketEventMocks.disconnect();

    expect(gameHandler.waitingPlayerDisconnected.mock.calls.length).toBe(0);
  });

  test('socket event ready', () => {
    socketEventMocks.ready({ face: 'face1', mode: 'normal' });

    expect(player.face).toBe('face1');
    expect(player.mode).toBe('normal');
    expect(gameHandler.playerIsReady.mock.calls.length).toBe(1);
    expect(gameHandler.playerIsReady.mock.calls[0][0]).toBe(player);
    expect(gameHandler.playerIsReady.mock.calls[0][1]).toBe('normal');
  });

  test('player create bullet', () => {
    player.game = { addBullet: jest.fn() };
    player.createBullet();
    expect(player.game.addBullet.mock.calls.length).toBe(1);
  });

  test('player notify start', () => {
    player.color = 'blue';
    player.x = 400;
    player.y = 300;
    player.face = 'face2';
    player.lives = 3;

    const opponent = {
      x: 100,
      y: 200,
      angle: Math.PI,
      color: 'blue',
      face: 'face1',
      lives: 2,
    };

    player.notifyStart([opponent], 30);
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('start');
    expect(socket.emit.mock.calls[0][1]).toEqual({
      x: 400,
      y: 300,
      face: 'face2',
      lives: 3,
      angle: 0,
      color: 'blue',
      players: [opponent],
      timer: 30,
    });
  });

  test('player notify waiting', () => {
    player.notifyWaiting();

    expect(player.isWaiting).toBe(true);
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('wait');
  });

  test('player notify update', () => {
    player.x = 400;
    player.y = 300;
    player.lives = 1;
    const opponent = {
      x: 100,
      y: 200,
      angle: Math.PI,
      face: 'face3',
      color: 'blue',
      lives: 3,
    };

    player.notifyUpdate([opponent], [], 25);

    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('update');
    expect(socket.emit.mock.calls[0][1]).toEqual({
      x: 400,
      y: 300,
      angle: 0,
      lives: 1,
      players: [opponent],
      bullets: [],
      timer: 25,
    });
  });

  test('player notify win', () => {
    player.notifyWin();

    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('win');
  });

  test('player notify lose', () => {
    player.notifyLose();

    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('lose');
  });

  test('player notify opponent disconnected', () => {
    player.notifyOpponentDisconnected();
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('opponent disconnected');
  });

  test('player notify time over', () => {
    player.notifyTimeOver();
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('time over');
  });

  test('player update no button in bound', () => {
    player.x = 100;
    player.y = 200;
    player.update();

    expect(player.x).toBe(100);
    expect(player.y).toBe(200);
  });

  test('player update up button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedUp = true;
    player.update();

    expect(player.x).toBe(100);
    expect(player.y).toBe(199);
  });

  test('player update down button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedDown = true;
    player.update();

    expect(player.x).toBe(100);
    expect(player.y).toBe(201);
  });

  test('player update left button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedLeft = true;
    player.update();

    expect(player.x).toBe(99);
    expect(player.y).toBe(200);
  });

  test('player update right button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(101);
    expect(player.y).toBe(200);
  });

  test('player update right button and up', () => {
    player.x = 100;
    player.y = 200;
    player.pressedRight = true;
    player.pressedUp = true;
    player.update();

    expect(player.x).toBe(100.5);
    expect(player.y).toBe(199.5);
  });

  test('player update left button and down', () => {
    player.x = 100;
    player.y = 200;
    player.pressedLeft = true;
    player.pressedDown = true;
    player.update();

    expect(player.x).toBe(99.5);
    expect(player.y).toBe(200.5);
  });

  test('player update decrements shooting count if gt 0', () => {
    player.shootingCount = 100;

    player.update();

    expect(player.shootingCount).toBe(99);
  });
});
