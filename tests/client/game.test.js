import Game from '../../src/client/js/game';

const socketEventMocks = {};
const socket = {
  on: jest.fn((event, cb) => {
    socketEventMocks[event] = cb;
  }),
  emit: jest.fn(),
};

global.io = jest.fn(() => socket);

describe('game', () => {
  let game;
  let view;
  let assets;

  beforeEach(() => {
    view = {
      showStartScreen: jest.fn((fn) => {
        fn('face1', 'normal');
      }),
      hideStartScreen: jest.fn(),
    };
    assets = {};
    game = new Game(view, assets);
  });

  test('constructor', () => {
    expect(game.view).toBe(view);
    expect(game.assets).toBe(assets);

    expect(view.showStartScreen).toHaveBeenCalledTimes(1);
    expect(view.hideStartScreen).toHaveBeenCalledTimes(1);

    expect(game.socket).toEqual(socket);
    expect(global.io).toHaveBeenCalledTimes(1);

    expect(game.socket.on).toHaveBeenCalledTimes(8);
    expect(game.socket.on.mock.calls[0][0]).toBe('connect');
    expect(game.socket.on.mock.calls[1][0]).toBe('start');
    expect(game.socket.on.mock.calls[2][0]).toBe('update');
    expect(game.socket.on.mock.calls[3][0]).toBe('waiting');
    expect(game.socket.on.mock.calls[4][0]).toBe('opponent disconnected');
    expect(game.socket.on.mock.calls[5][0]).toBe('time over');
    expect(game.socket.on.mock.calls[6][0]).toBe('win');
    expect(game.socket.on.mock.calls[7][0]).toBe('lose');

    expect(game.pressedUp).toBe(false);
    expect(game.pressedDown).toBe(false);
    expect(game.pressedLeft).toBe(false);
    expect(game.pressedRight).toBe(false);
  });
});
