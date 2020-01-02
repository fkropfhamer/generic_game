import View from '../../src/client/js/view';

describe('view', () => {
  let view;
  Object.defineProperty(document, 'getElementById', {
    value: () => {
      return { appendChild: jest.fn() };
    },
  });
  Object.defineProperty(document, 'createElement', {
    value: (element) => {
      if (element === 'canvas') {
        return {
          getContext: () => {
            return {};
          },
          style: {},
        };
      }
      return { appendChild: jest.fn() };
    },
  });

  beforeEach(() => {
    view = new View();
  });

  test('constructor', () => {
    // jest/jsdom defines the window innerWidth and innerHeight to be 1024 x 768
    expect(view.windowHeight).toBe(768 * 0.95);
    expect(view.windowWidth).toBe(1024);
    expect(view.scale).toBe(0.8);
    expect(view.height).toBe(576);
    expect(view.width).toBe(1024);
  });

  test('view resize', () => {
    view.setupCanvas = jest.fn();

    view.resize();

    expect(view.windowHeight).toBe(768 * 0.95);
    expect(view.windowWidth).toBe(1024);
    expect(view.setupCanvas).toHaveBeenCalledTimes(1);
  });

  test('view drawCircle', () => {
    const mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
    };

    view.ctx = mockContext;
    view.scale = 1;

    view.drawCircle(100, 100, 5, 'red');

    expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockContext.arc).toHaveBeenCalledTimes(1);
    expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 5, 0, 2 * Math.PI, false);
    expect(mockContext.fillStyle).toBe('red');
    expect(mockContext.fill).toHaveBeenCalledTimes(1);
  });
});
