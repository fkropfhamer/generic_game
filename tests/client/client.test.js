import Client from '../../src/client/js/client';

jest.mock('../../src/client/js/view');

describe('client', () => {
  let game;
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
    };
    assets = {};
    game = new Client(view, assets);
  });

  test('constructor', () => {
    expect(game.view).toBe(view);
    expect(game.assets).toBe(assets);

    expect(view.showStartScreen).toHaveBeenCalledTimes(1);
  });

  test('client setup', () => {
    expect(game.socket).toEqual(socket);
    expect(global.io).toHaveBeenCalledTimes(1);

    expect(game.socket.on).toHaveBeenCalledTimes(8);
    expect(game.socket.on.mock.calls[0][0]).toBe('connect');
    expect(game.socket.on.mock.calls[1][0]).toBe('start');
    expect(game.socket.on.mock.calls[2][0]).toBe('update');
    expect(game.socket.on.mock.calls[3][0]).toBe('wait');
    expect(game.socket.on.mock.calls[4][0]).toBe('time over');
    expect(game.socket.on.mock.calls[5][0]).toBe('win');
    expect(game.socket.on.mock.calls[6][0]).toBe('lose');
    expect(game.socket.on.mock.calls[7][0]).toBe('death');

    expect(game.pressedUp).toBe(false);
    expect(game.pressedDown).toBe(false);
    expect(game.pressedLeft).toBe(false);
    expect(game.pressedRight).toBe(false);

    expect(game.socket.emit).toHaveBeenCalledTimes(1);
    expect(game.socket.emit.mock.calls[0][0]).toBe('ready');
    expect(game.socket.emit.mock.calls[0][1]).toEqual({ face: 'face1', mode: 'normal' });
  });
});
