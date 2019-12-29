import View from '../../src/client/js/view';

describe('view', () => {
  let view;

  beforeEach(() => {
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
    view = new View();
  });

  test('constructor', () => {
    // jest/jsdom defines the window innerWidth and innerHeight to be 1024 x 768
    expect(view.windowHeight).toBe(768 * 0.95);
    expect(view.windowWidth).toBe(1024);
    expect(view.color).toBe('#232529');
    expect(view.scale).toBe(0.8);
    expect(view.height).toBe(576);
    expect(view.width).toBe(1024);
    expect(view.canvas.style.backgroundColor).toBe('#232529');
  });
});
