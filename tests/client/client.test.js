import Client from '../../src/client/js/client';
import config from '../../src/server/config';
// import View from '../../src/client/js/view';
jest.mock('../../src/client/js/view');

describe('client', () => {
  let client;
  let view;
  let assets;
  let socket;

  beforeEach(() => {
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };

    global.io = jest.fn(() => socket);

    view = {
      showStartScreen: jest.fn((fn) => {
        fn('face1', 'normal');
      }),
      hideStartScreen: jest.fn(),
      drawImageAtAngle: jest.fn(),
      drawRing: jest.fn(),
      reset: jest.fn(),
      showTimer: jest.fn(),
      drawPlayerIndicator: jest.fn(),
      showPlayerColorInfo: jest.fn(),
      drawCircle: jest.fn(),
      drawRectangle: jest.fn(),
    };

    assets = {};

    client = new Client(view, assets);
  });

  test('constructor', () => {
    // TODO: mock static methods
    expect(client.view).toBe(view);
    expect(client.assets).toBe(assets);

    expect(view.showStartScreen).toHaveBeenCalledTimes(1);
    // expect(view.hideStartScreen).toHaveBeenCalledTimes(1);
  });

  test('client setup', () => {
    expect(client.socket).toEqual(socket);
    expect(global.io).toHaveBeenCalledTimes(1);

    expect(client.socket.on).toHaveBeenCalledTimes(8);
    expect(client.socket.on.mock.calls[0][0]).toBe('connect');
    expect(client.socket.on.mock.calls[1][0]).toBe('start');
    expect(client.socket.on.mock.calls[2][0]).toBe('update');
    expect(client.socket.on.mock.calls[3][0]).toBe('wait');
    expect(client.socket.on.mock.calls[4][0]).toBe('time over');
    expect(client.socket.on.mock.calls[5][0]).toBe('win');
    expect(client.socket.on.mock.calls[6][0]).toBe('lose');
    expect(client.socket.on.mock.calls[7][0]).toBe('death');

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
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(1, assets.blue, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(2, assets.face1, 4, 8, 0, 0.5);
    expect(view.drawRing).toHaveBeenCalledTimes(0);
  });

  test('client draw player shield and lives < 3', () => {
    client.drawPlayer('blue', 2, 'face1', 4, 8, 0, 0, true);

    expect(view.drawImageAtAngle).toHaveBeenCalledTimes(3);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(1, assets.blue, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(2, assets.blue2life, 4, 8, 0, 0.5);
    expect(view.drawImageAtAngle).toHaveBeenNthCalledWith(3, assets.face1, 4, 8, 0, 0.5);
    expect(view.drawRing).toHaveBeenCalledTimes(1);
    expect(view.drawRing).toHaveBeenCalledWith(4, 8, config.PLAYER_RADIUS, 'blue');
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
    expect(view.showTimer).toHaveBeenCalledTimes(1);
    expect(view.showTimer).toHaveBeenCalledWith(100);
    expect(view.drawCircle).toHaveBeenCalledTimes(2);
    expect(view.drawCircle).toHaveBeenNthCalledWith(1, 1, 2, config.BULLET_RADIUS, 'blue');
    expect(view.drawRectangle).toHaveBeenCalledTimes(1);
    expect(view.drawRectangle).toHaveBeenCalledWith(1, 2, 4, 3, 5, 'green', 'black');
    expect(client.drawPlayer).toHaveBeenCalledTimes(2);
    expect(client.drawPlayer).toHaveBeenNthCalledWith(1, 'pink', 3, 'face12', 5, 10, 2, 4, true);
    expect(client.drawPlayerIndicator).toHaveBeenCalledTimes(1);
    expect(client.displayPlayerColorInfo).toHaveBeenCalledTimes(1);
    expect(client.drawPlayer).toHaveBeenNthCalledWith(2, 'grey', 2, 'face2', 1, 2, 3, 7, false);
    expect(view.drawCircle).toHaveBeenNthCalledWith(2, 1, 2, 3, 'brown');
  });
});
