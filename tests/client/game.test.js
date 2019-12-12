import Game from '../../src/client/js/game';

const socketEventMocks = {};

global.io = jest.fn(() => {
  return {
    on: jest.fn((event, cb) => {
      socketEventMocks[event] = cb;
    }),
    emit: jest.fn(),
  };
});

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

  test('constructor', () => {});
});
