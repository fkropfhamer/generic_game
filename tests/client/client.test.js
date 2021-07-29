import Client from '../../client/js/client';
import config from '../../shared/config';

jest.mock('../../client/js/view');

const mockAddEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', { value: mockAddEventListener });

describe('client', () => {
  let client;
  let view;
  let images;
  let socket;
  let audios;

  beforeEach(() => {
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };

    global.io = jest.fn(() => socket);

    view = {
      showStartScreen: jest.fn(),
      hideStartScreen: jest.fn(),
      drawImageAtAngle: jest.fn(),
      drawRing: jest.fn(),
      reset: jest.fn(),
      showTimer: jest.fn(),
      drawPlayerIndicator: jest.fn(),
      showPlayerColorInfo: jest.fn(),
      drawCircle: jest.fn(),
      drawRectangle: jest.fn(),
      drawNestedRings: jest.fn(),
      drawCrossHair: jest.fn(),
      canvas: {
        offsetLeft: 3,
        offsetTop: 4,
      },
      hideCursor: jest.fn(),
      showCursor: jest.fn(),
    };

    audios = { backgroundMusic: { play: jest.fn() }, splash: { play: jest.fn() } };

    images = {};
    client = new Client(view, images, audios);
    client.socket = socket;
  });

  test('constructor', () => {
    expect(client.view).toBe(view);
    expect(client.audios).toBe(audios);
    expect(client.images).toBe(images);
    expect(client.isWaiting).toBe(true);
    expect(view.showStartScreen).toHaveBeenCalledTimes(1);
  });

  test('client setup', () => {
    client.setupSocket = jest.fn();
    client.setup('face1', 'normal');
    expect(client.setupSocket).toHaveBeenCalledTimes(1);
    expect(client.socket).toEqual(socket);

    expect(client.pressedUp).toBe(false);
    expect(client.pressedDown).toBe(false);
    expect(client.pressedLeft).toBe(false);
    expect(client.pressedRight).toBe(false);

    expect(client.socket.emit).toHaveBeenCalledTimes(1);
    expect(client.socket.emit.mock.calls[0][0]).toBe('ready');
    expect(client.socket.emit.mock.calls[0][1]).toEqual({ face: 'face1', mode: 'normal' });
  });

  test('client draw player', () => {
    client.drawPlayer('blue', 3, 'face1', 4, 8, 0, 0, false);

    expect(view.drawImageAtAngle).toHaveBeenCalledTimes(2);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(1, images.blue, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(2, images.face1, 4, 8, 0, 0.5);
    expect(view.drawRing).toHaveBeenCalledTimes(0);
  });

  test('client draw player is Frozen', () => {
    client.drawPlayer('blue', 3, 'face1', 4, 8, 0, 0, false, true);

    expect(view.drawImageAtAngle).toHaveBeenCalledTimes(3);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(1, images.blue, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(2, images.face1, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(3, images.playerIced, 4, 8, 0, 0.5);
    expect(view.drawRing).toHaveBeenCalledTimes(0);
  });

  test('client draw player shield and lives < 3', () => {
    client.drawPlayer('blue', 2, 'face1', 4, 8, 0, 0, true);

    expect(view.drawImageAtAngle).toHaveBeenCalledTimes(3);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(1, images.blue, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(2, images.blue2life, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(3, images.face1, 4, 8, 0, 0.5);
    expect(view.drawRing).toHaveBeenCalledTimes(1);
    expect(view.drawRing).toHaveBeenCalledWith(4, 8, config.PLAYER_RADIUS, 5, 6, 'blue');
  });

  test('client draw', () => {
    client.color = 'pink';
    client.face = 'face12';
    client.lives = 3;
    client.x = 5;
    client.y = 10;
    client.angle = 2;
    client.hitAngle = 4;
    client.isShielded = true;
    client.timer = 100;
    client.bullets = [{ x: 1, y: 2, color: 'blue' }];
    client.iceSandFields = [{}];
    client.portals = [{}];
    client.walls = [
      {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        angle: 5,
        fillColor: 'green',
        strokeColor: 'black',
      },
    ];
    client.otherPlayers = [
      {
        x: 1,
        y: 2,
        color: 'grey',
        lives: 2,
        face: 'face2',
        angle: 3,
        hitAngle: 7,
        isShielded: false,
      },
    ];
    client.powerUps = [
      {
        x: 1,
        y: 2,
        radius: 3,
        color: 'brown',
      },
    ];
    client.drawPlayer = jest.fn();
    client.displayPlayerColorInfo = jest.fn();
    client.drawPlayerIndicator = jest.fn();

    client.draw();

    expect(view.reset).toHaveBeenCalledTimes(1);
    expect(view.drawCircle).toHaveBeenCalledTimes(1);
    expect(view.drawCircle).toHaveBeenNthCalledWith(1, 1, 2, config.BULLET_RADIUS, 'blue');
    expect(view.drawRectangle).toHaveBeenCalledTimes(1);
    expect(view.drawRectangle).toHaveBeenCalledWith(1, 2, 4, 3, 5, 'green', 'black', 3);
    expect(client.drawPlayer).toHaveBeenCalledTimes(2);
    expect(client.drawPlayer).toHaveBeenNthCalledWith(
      1,
      'pink',
      3,
      'face12',
      5,
      10,
      2,
      4,
      true,
      undefined
    );
    expect(client.drawPlayerIndicator).toHaveBeenCalledTimes(1);
    expect(client.drawPlayer).toHaveBeenNthCalledWith(
      2,
      'grey',
      2,
      'face2',
      1,
      2,
      3,
      7,
      false,
      undefined
    );
    expect(view.drawCrossHair).toHaveBeenCalledTimes(1);
    expect(view.drawCrossHair).toHaveBeenCalledWith(0, 0, NaN);
  });

  test('client draw player indicator', () => {
    client.x = 1;
    client.y = 2;

    client.drawPlayerIndicator();

    expect(view.drawPlayerIndicator).toHaveBeenCalledTimes(1);
    expect(view.drawPlayerIndicator).toHaveBeenCalledWith(1, 2);
  });

  test('client setup key pressed events', () => {
    client.setupKeyPressedEvents();

    expect(mockAddEventListener).toHaveBeenCalledTimes(4);
    expect(mockAddEventListener.mock.calls[0][0]).toBe('keydown');
    expect(mockAddEventListener.mock.calls[1][0]).toBe('keyup');
    expect(mockAddEventListener.mock.calls[2][0]).toBe('click');
    expect(mockAddEventListener.mock.calls[3][0]).toBe('mousemove');
  });

  test('client mouse move', () => {
    client.x = 4;
    client.y = 5;
    client.calculateAngle = jest.fn(() => 1);

    client.mouseMove({ clientX: 2, clientY: 3 });

    expect(client.mouseX).toBe(-1);
    expect(client.mouseY).toBe(-1);

    expect(client.calculateAngle).toHaveBeenCalledTimes(1);
    expect(client.calculateAngle).toHaveBeenCalledWith(2, 3, 4, 5);
    expect(client.angle).toBe(1);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('update angle', { angle: 1 });
  });

  test('client calculate angle', () => {
    view.scale = 1;
    view.canvas = { offsetTop: 0, offsetLeft: 0 };
    const angle = client.calculateAngle(1, 2, 4, 2);
    expect(angle).toBe(Math.PI);
  });

  test('client shoot', () => {
    client.calculateAngle = jest.fn(() => 10);
    client.x = 1;
    client.y = 2;

    client.shoot({ clientX: 3, clientY: 4 });

    expect(client.angle).toBe(10);
    expect(client.calculateAngle).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('shoot', { angle: 10 });
  });

  test('client key pressed ArrowDown', () => {
    const event = { code: 'ArrowDown' };
    client.keyPressed(event);

    expect(client.pressedDown).toBe(true);
  });

  test('client key pressed ArrowUp', () => {
    const event = { code: 'ArrowUp' };
    client.keyPressed(event);

    expect(client.pressedUp).toBe(true);
  });

  test('client key pressed ArrowRight', () => {
    const event = { code: 'ArrowRight' };
    client.keyPressed(event);

    expect(client.pressedRight).toBe(true);
  });

  test('client key pressed ArrowLeft', () => {
    const event = { code: 'ArrowLeft' };
    client.keyPressed(event);

    expect(client.pressedLeft).toBe(true);
  });

  test('client key pressed not used key', () => {
    const event = { code: 'test' };
    client.keyPressed(event);

    expect(client.pressedDown).toBeFalsy();
    expect(client.pressedLeft).toBeFalsy();
    expect(client.pressedRight).toBeFalsy();
    expect(client.pressedUp).toBeFalsy();
  });

  test('client key up ArrowDown', () => {
    const event = { code: 'ArrowDown' };
    client.keyUp(event);

    expect(client.pressedDown).toBe(false);
  });

  test('client key up ArrowUp', () => {
    const event = { code: 'ArrowUp' };
    client.keyUp(event);

    expect(client.pressedUp).toBe(false);
  });

  test('client key up ArrowRight', () => {
    const event = { code: 'ArrowRight' };
    client.keyUp(event);

    expect(client.pressedRight).toBe(false);
  });

  test('client key up ArrowLeft', () => {
    const event = { code: 'ArrowLeft' };
    client.keyUp(event);

    expect(client.pressedLeft).toBe(false);
  });

  test('client on start', () => {
    client.setupKeyPressedEvents = jest.fn();
    client.loop = jest.fn();

    client.onStart();

    expect(view.hideCursor).toHaveBeenCalled();
    expect(audios.backgroundMusic.loop).toBe(true);
    expect(audios.backgroundMusic.play).toHaveBeenCalled();
    expect(client.loop).toHaveBeenCalled();
    expect(client.setupKeyPressedEvents).toHaveBeenCalled();
  });

  test('client on update', () => {
    client.draw = jest.fn();

    const mockData = {
      x: 1,
      y: 2,
      angle: 3,
      lives: 5,
      players: 7,
      timer: 8,
      walls: 9,
      isShielded: 10,
      teamLives: 11,
      powerUps: 12,
      bullets: 13,
    };

    client.onUpdate(mockData);

    expect(client.x).toBe(1);
    expect(client.y).toBe(2);
    expect(client.angle).toBe(3);
    expect(client.lives).toBe(5);
    expect(client.otherPlayers).toBe(7);
    expect(client.timer).toBe(8);
    expect(client.walls).toBe(9);
    expect(client.isShielded).toBe(10);
    expect(client.teamLives).toBe(11);
    expect(client.powerUps).toBe(12);
    expect(client.bullets).toEqual(13);
    expect(client.draw).toHaveBeenCalledTimes(0);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('keyspressed', {
      up: undefined,
      down: undefined,
      left: undefined,
      right: undefined,
    });
  });

  test('client on connected', () => {
    client.onConnected();

    expect(client.isConnected).toBe(true);
  });

  test('client onWait', () => {
    client.onWait({ numberofPlayers: 3 });

    expect(client.isWaiting).toBe(true);
  });

  test('client on time over', () => {
    client.onTimeOver();

    expect(view.showCursor).toHaveBeenCalled();
    expect(client.isEnded).toBe(true);
  });

  test('client on win', () => {
    client.onWin();

    expect(view.showCursor).toHaveBeenCalled();
    expect(client.isEnded).toBe(true);
  });

  test('client on lose', () => {
    client.onLose();

    expect(view.showCursor).toHaveBeenCalled();
    expect(client.isEnded).toBe(true);
  });

  test('client on death', () => {
    client.onDeath();

    expect(view.showCursor).toHaveBeenCalled();
    expect(client.isDead).toBe(true);
  });

  test('client on spash sound', () => {
    client.onSplashSound();

    expect(audios.splash.play).toHaveBeenCalledTimes(1);
  });

  test('client on starting', () => {
    const data = { face: 'face123', color: 'color123' };

    client.draw = jest.fn();
    client.isWaiting = false;
    client.onStarting(data);

    expect(client.face).toBe(data.face);
    expect(client.color).toBe(data.color);
    expect(client.draw).toHaveBeenCalledTimes(1);
  });

  test('client on starting is waiting', () => {
    const data = { face: 'face123', color: 'color123' };

    client.draw = jest.fn();
    client.isWaiting = true;
    client.onStarting(data);

    expect(client.face).toBe(data.face);
    expect(client.color).toBe(data.color);
    expect(client.draw).toHaveBeenCalledTimes(1);
    expect(client.isWaiting).toBe(false);
  });

  test('client setup socket', () => {
    client.configureSocket();

    expect(client.socket.on).toHaveBeenCalledTimes(10);
    expect(client.socket.on.mock.calls[0][0]).toBe('connect');
    expect(client.socket.on.mock.calls[1][0]).toBe('start');
    expect(client.socket.on.mock.calls[2][0]).toBe('update');
    expect(client.socket.on.mock.calls[3][0]).toBe('wait');
    expect(client.socket.on.mock.calls[4][0]).toBe('time over');
    expect(client.socket.on.mock.calls[5][0]).toBe('win');
    expect(client.socket.on.mock.calls[6][0]).toBe('lose');
    expect(client.socket.on.mock.calls[7][0]).toBe('splash sound');
    expect(client.socket.on.mock.calls[8][0]).toBe('death');
    expect(client.socket.on.mock.calls[9][0]).toBe('starting');
  });

  test('client drawPortals out of time range', () => {
    client.timer = 1000;

    client.drawPortals(1, 2, 3, 4, 5, 6, 7);

    expect(view.drawCircle).toHaveBeenCalledTimes(0);
    expect(view.drawNestedRings).toHaveBeenCalledTimes(0);
  });

  test('client drawPortals out of time range', () => {
    client.timer = 7;

    client.drawPortals(1, 2, 3, 4, 8, 5, 7);

    expect(view.drawCircle).toHaveBeenCalledTimes(2);
    expect(view.drawCircle).toHaveBeenNthCalledWith(1, 1, 2, 41.25, 'black');
    expect(view.drawCircle).toHaveBeenNthCalledWith(2, 3, 4, 41.25, 'black');
    expect(view.drawNestedRings).toHaveBeenCalledTimes(2);
    expect(view.drawNestedRings).toHaveBeenNthCalledWith(1, 1, 2, 41.25, 3, 'grey', 2);
    expect(view.drawNestedRings).toHaveBeenNthCalledWith(2, 3, 4, 41.25, 3, 'grey', 2);
  });

  test('client loop', () => {
    client.draw = jest.fn();

    client.loop();

    expect(client.draw).toHaveBeenCalledTimes(1);
  });

  test('client loop ended', () => {
    client.draw = jest.fn();
    client.isEnded = true;

    client.loop();

    expect(client.draw).toHaveBeenCalledTimes(1);
  });

  test('client draw cross hair', () => {
    client.shootingCount = 1000;
    client.drawCrossHair();

    expect(client.view.drawCrossHair).toHaveBeenCalledTimes(1);
    expect(client.view.drawCrossHair).toHaveBeenCalledWith(0, 0, 10);
  });

  test('client draw cross hair firerateactivated', () => {
    client.shootingCount = 1000;
    client.fireRateActivated = true;
    client.drawCrossHair();

    expect(client.view.drawCrossHair).toHaveBeenCalledTimes(1);
    expect(client.view.drawCrossHair).toHaveBeenCalledWith(0, 0, 40);
  });

  test('client create Socket', () => {
    const io = jest.fn();

    client.createSocket(io);

    expect(io).toHaveBeenCalledTimes(1);
  });

  test('client setup socket', () => {
    client.configureSocket = jest.fn();
    client.createSocket = jest.fn();

    client.setupSocket();

    expect(client.configureSocket).toHaveBeenCalledTimes(1);
    expect(client.createSocket).toHaveBeenCalledTimes(1);
  });
});
