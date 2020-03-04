import Player from '../../src/server/player';
import config from '../../src/server/config';

describe('player test', () => {
  let player;
  let socket;
  let server;

  beforeEach(() => {
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };
    server = { waitingPlayerDisconnected: jest.fn(), playerIsReady: jest.fn() };
    player = new Player(socket, server);
  });

  test('player constructor', () => {
    expect(player.socket).toBe(socket);
    expect(player.server).toBe(server);
    expect(player.speed).toBe(2);
    expect(player.radius).toBe(25);
    expect(player.angle).toBe(0);
    expect(player.shootingCount).toBe(0);
    expect(player.isShielded).toBe(false);
    expect(player.fireRateActivated).toBe(false);
    expect(player.changedSpeedPowerupActive).toBe(false);
    expect(player.isFrozen).toBe(false);
    expect(player.isOnIce).toBe(false);
    expect(player.isOnSand).toBe(false);
    expect(socket.on.mock.calls.length).toBe(5);
    expect(socket.on.mock.calls[0][0]).toBe('keyspressed');
    expect(socket.on.mock.calls[1][0]).toBe('shoot');
    expect(socket.on.mock.calls[2][0]).toBe('update angle');
    expect(socket.on.mock.calls[3][0]).toBe('disconnect');
    expect(socket.on.mock.calls[4][0]).toBe('ready');
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
    player.game = {};
    player.onShoot({ angle: Math.PI });

    expect(player.angle).toBe(Math.PI);
    expect(player.createBullet.mock.calls.length).toBe(1);
    expect(player.shootingCount).toBe(config.SHOOTING_RATE);
  });

  test('socket event shoot limited by shooting count', () => {
    player.createBullet = jest.fn();
    player.shootingCount = 10;
    player.onShoot({ angle: Math.PI });

    expect(player.angle).toBe(0);
    expect(player.createBullet.mock.calls.length).toBe(0);
    expect(player.shootingCount).toBe(10);
  });

  test('socket event shoot powerup firerate', () => {
    player.createBullet = jest.fn();
    player.game = {};
    player.fireRateActivated = true;
    player.onShoot({ angle: Math.PI });

    expect(player.angle).toBe(Math.PI);
    expect(player.createBullet.mock.calls.length).toBe(1);
    expect(player.shootingCount).toBe(config.SHOOTING_RATE / 4);
  });

  test('socket event update angle', () => {
    player.onUpdateAngle({ angle: 3000 });

    expect(player.angle).toBe(3000);
  });

  test('socket event disconnect player is waiting', () => {
    player.isWaiting = true;
    player.onDisconnect();

    expect(server.waitingPlayerDisconnected.mock.calls.length).toBe(1);
    expect(server.waitingPlayerDisconnected.mock.calls[0][0]).toBe(player);
  });

  test('socket event disconnect game has started', () => {
    player.game = { playerDisconnected: jest.fn() };
    player.onDisconnect();

    expect(server.waitingPlayerDisconnected.mock.calls.length).toBe(0);
    expect(player.game.playerDisconnected.mock.calls.length).toBe(1);
    expect(player.game.playerDisconnected.mock.calls[0][0]).toBe(player);
  });

  test('socket event disconnect player not waiting and no game', () => {
    player.onDisconnect();

    expect(server.waitingPlayerDisconnected.mock.calls.length).toBe(0);
  });

  test('socket event ready', () => {
    player.onReady({ face: 'face1', mode: 'normal' });

    expect(player.face).toBe('face1');
    expect(player.mode).toBe('normal');
    expect(server.playerIsReady.mock.calls.length).toBe(1);
    expect(server.playerIsReady.mock.calls[0][0]).toBe(player);
    expect(server.playerIsReady.mock.calls[0][1]).toBe('normal');
  });

  test('player create bullet', () => {
    player.game = { addBullet: jest.fn() };
    player.createBullet();
    expect(player.game.addBullet.mock.calls.length).toBe(1);
  });

  test('player notify start', () => {
    player.notifyStart();
    expect(player.isWaiting).toBe(false);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('start');
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
    player.hitAngle = Math.PI / 2;
    player.isShielded = false;
    const opponent = {
      x: 100,
      y: 200,
      angle: Math.PI,
      face: 'face3',
      color: 'blue',
      lives: 3,
      isShielded: true,
      hitAngle: Math.PI,
      isFrozen: undefined,
    };

    player.notifyUpdate([opponent], [], 25, [], [], [], 3, []);

    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('update');
    expect(socket.emit.mock.calls[0][1]).toEqual({
      x: 400,
      y: 300,
      angle: 0,
      lives: 1,
      isFrozen: false,
      players: [opponent],
      bullets: [],
      timer: 25,
      walls: [],
      powerUps: [],
      isShielded: false,
      hitAngle: Math.PI / 2,
      iceSandFields: [],
      portals: [],
      teamLives: 3,
      shootingCount: 0,
      fireRateActivated: false,
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

  test('player notify time over', () => {
    player.notifyTimeOver();
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('time over');
  });

  test('player notify death', () => {
    player.notifyDeath();
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('death');
  });

  test('player notify splash sound', () => {
    player.notifySplashSound();
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('splash sound');
  });

  test('player notify starting', () => {
    const face = 'face123';
    const color = 'color123';
    const startCounter = 3;

    player.face = face;
    player.color = color;

    player.notifyStarting(startCounter);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('starting', { face, color, startCounter });
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
    expect(player.y).toBe(198);
  });

  test('player update down button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedDown = true;
    player.update();

    expect(player.x).toBe(100);
    expect(player.y).toBe(202);
  });

  test('player update left button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedLeft = true;
    player.update();

    expect(player.x).toBe(98);
    expect(player.y).toBe(200);
  });

  test('player update right button', () => {
    player.x = 100;
    player.y = 200;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(102);
    expect(player.y).toBe(200);
  });

  test('player update right button and up', () => {
    player.x = 100;
    player.y = 200;
    player.pressedRight = true;
    player.pressedUp = true;
    player.update();

    expect(player.x).toBe(101.4);
    expect(player.y).toBe(198.6);
  });

  test('player update left button and down', () => {
    player.x = 100;
    player.y = 200;
    player.pressedLeft = true;
    player.pressedDown = true;
    player.update();

    expect(player.x).toBe(98.6);
    expect(player.y).toBe(201.4);
  });

  test('player update decrements shooting count if gt 0', () => {
    player.shootingCount = 100;

    player.update();

    expect(player.shootingCount).toBe(99);
  });

  test('player update player is frozen', () => {
    player.x = 100;
    player.y = 200;
    player.isFrozen = 300;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(100);
    expect(player.y).toBe(200);
    expect(player.isFrozen).toBe(299);
  });

  test('player update player is on ice', () => {
    player.x = 100;
    player.y = 200;
    player.isOnIce = true;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(104);
    expect(player.y).toBe(200);
  });

  test('player update player is on sand', () => {
    player.x = 100;
    player.y = 200;
    player.isOnSand = true;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(101);
    expect(player.y).toBe(200);
  });

  test('player update player speed powerup is active', () => {
    player.x = 100;
    player.y = 200;
    player.changedSpeedPowerupActive = 300;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(104);
    expect(player.y).toBe(200);
    expect(player.changedSpeedPowerupActive).toBe(299);
  });

  test('player update player speed powerup is active', () => {
    player.x = 100;
    player.y = 200;
    player.fireRateActivated = 300;
    player.pressedRight = true;
    player.update();

    expect(player.x).toBe(102);
    expect(player.y).toBe(200);
    expect(player.fireRateActivated).toBe(299);
  });
});
