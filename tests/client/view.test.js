import View from '../../src/client/js/view';
import config from '../../src/server/config';

describe('view', () => {
  let view;
  let elements = {};
  let createdElements = {};

  Object.defineProperty(document, 'getElementById', {
    value: (id) => {
      if (elements[id]) return elements[id];
      const element = { id, appendChild: jest.fn(), style: {} };
      elements[id] = element;
      return element;
    },
  });

  Object.defineProperty(document, 'createElement', {
    value: (type) => {
      const element = {
        getContext: () => {
          return {};
        },
        appendChild: jest.fn(),
        style: {},
      };
      createdElements[type] = element;
      return element;
    },
  });

  Object.defineProperty(window, 'addEventListener', {
    value: jest.fn(),
  });

  beforeEach(() => {
    view = new View();
    elements = {};
    createdElements = {};
  });

  test('constructor', () => {
    // jest/jsdom defines the window innerWidth and innerHeight to be 1024 x 768
    expect(view.windowHeight).toBe(768 * 0.95);
    expect(view.windowWidth).toBe(1024);
    expect(view.scale).toBe(0.8);
    expect(view.height).toBe(576);
    expect(view.width).toBe(1024);
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
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

  test('view setupcanvas window === field', () => {
    const canvas = {};
    const style = {};

    view.canvas = canvas;
    view.canvas.style = style;
    view.windowWidth = config.FIELD_WIDTH;
    view.windowHeight = config.FIELD_HEIGHT;

    view.setupCanvas();

    expect(view.scale).toBe(1);
    expect(canvas.width).toBe(config.FIELD_WIDTH);
    expect(canvas.height).toBe(config.FIELD_HEIGHT);
    expect(style.backgroundImage).toBe('url(backgroundimage)');
    expect(style.backgroundRepeat).toBe('no-repeat');
    expect(style.backgroundSize).toBe('cover');
  });

  test('view setupcanvas window.width < field', () => {
    const canvas = {};
    const style = {};

    view.canvas = canvas;
    view.canvas.style = style;
    view.windowWidth = config.FIELD_WIDTH;
    view.windowHeight = config.FIELD_HEIGHT / 2;

    view.setupCanvas();

    expect(view.scale).toBe(0.5);
  });

  test('view draw ring', () => {
    const mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
    };

    view.ctx = mockContext;
    view.scale = 1;

    view.drawRing(1, 2, 3, 'test');

    expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockContext.arc).toHaveBeenCalledTimes(1);
    expect(mockContext.arc).toHaveBeenCalledWith(1, 2, 8, 0, 2 * Math.PI, false);
    expect(mockContext.lineWidth).toBe(6);
    expect(mockContext.strokeStyle).toBe('test');
    expect(mockContext.stroke).toHaveBeenCalledTimes(1);
  });

  test('view draw rectangle', () => {
    const mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      fill: jest.fn(),
    };

    view.ctx = mockContext;
    view.scale = 0.5;

    view.drawRectangle(2, 4, 6, 8, 0, 'red', 'green');

    expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockContext.moveTo).toHaveBeenCalledTimes(1);
    expect(mockContext.moveTo).toHaveBeenCalledWith(-1, 1);
    expect(mockContext.lineTo).toHaveBeenCalledTimes(4);
    expect(mockContext.lineTo).toHaveBeenNthCalledWith(1, 3, 1);
    expect(mockContext.lineTo).toHaveBeenNthCalledWith(2, 3, 4);
    expect(mockContext.lineTo).toHaveBeenNthCalledWith(3, -1, 4);
    expect(mockContext.lineTo).toHaveBeenNthCalledWith(4, -1, 1);
    expect(mockContext.fillStyle).toBe('red');
    expect(mockContext.strokeStyle).toBe('green');
    expect(mockContext.lineWidth).toBe(3);
    expect(mockContext.fill).toHaveBeenCalledTimes(1);
    expect(mockContext.stroke).toHaveBeenCalledTimes(1);
  });

  test('view reset', () => {
    const mockContext = {
      clearRect: jest.fn(),
    };

    view.ctx = mockContext;

    view.reset();

    expect(mockContext.clearRect).toHaveBeenCalledTimes(1);
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 1024, 576);
  });

  test('view draw image at angle', () => {
    const mockContext = {
      save: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      drawImage: jest.fn(),
      restore: jest.fn(),
    };

    const mockImage = {
      width: 2,
      height: 3,
    };

    view.ctx = mockContext;
    view.scale = 1;

    view.drawImageAtAngle(mockImage, 2, 4, 5);

    expect(mockContext.save).toHaveBeenCalledTimes(1);
    expect(mockContext.translate).toHaveBeenCalledTimes(1);
    expect(mockContext.translate).toHaveBeenCalledWith(2, 4);
    expect(mockContext.rotate).toHaveBeenCalledTimes(1);
    expect(mockContext.rotate).toHaveBeenCalledWith(5);
    expect(mockContext.drawImage).toHaveBeenCalledTimes(1);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, -1, -1, 2, 3);
    expect(mockContext.restore).toHaveBeenCalledTimes(1);
  });

  test('view draw player indicator', () => {
    const mockContext = {
      beginPath: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
    };

    view.ctx = mockContext;
    view.scale = 0.5;

    view.drawPlayerIndicator(2, 4);

    expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
    expect(mockContext.moveTo).toHaveBeenCalledTimes(1);
    expect(mockContext.moveTo).toHaveBeenCalledWith(1, -13);
    expect(mockContext.lineTo).toHaveBeenCalledTimes(3);
    expect(mockContext.lineTo).toHaveBeenCalledWith(-4, -15);
    expect(mockContext.lineTo).toHaveBeenCalledWith(6, -15);
    expect(mockContext.lineTo).toHaveBeenCalledWith(1, -13);
    expect(mockContext.fillStyle).toBe('yellow');
    expect(mockContext.fill).toHaveBeenCalledTimes(1);
  });

  test('view show timer', () => {
    view.showTimer(30);

    expect(elements.timeprogress.style.width).toBe('50%');
  });

  test('view show waiting player === 1', () => {
    View.showWaitingScreen(1);

    expect(elements.waitingscreen.style.display).toBe('initial');
    expect(elements.waitingscreenheading.innerHTML).toBe('You have to wait for 1 other player!');
  });

  test('view show waiting player === 3', () => {
    View.showWaitingScreen(3);

    expect(elements.waitingscreen.style.display).toBe('initial');
    expect(elements.waitingscreenheading.innerHTML).toBe('You have to wait for 3 other players!');
  });

  test('view hied waiting screen', () => {
    View.hideWaitingScreen();

    expect(elements.waitingscreen.style.display).toBe('none');
  });

  test('view show time over screen', () => {
    View.showTimeOverScreen();

    expect(elements.deathmessage.style.display).toBe('none');
    expect(elements.timeoverscreen.style.display).toBe('initial');
  });

  test('view show win screen', () => {
    View.showWinScreen();

    expect(elements.deathmessage.style.display).toBe('none');
    expect(elements.winscreen.style.display).toBe('initial');
  });

  test('view show lose screen', () => {
    View.showLoseScreen();

    expect(elements.deathmessage.style.display).toBe('none');
    expect(elements.losescreen.style.display).toBe('initial');
  });

  test('view show death message', () => {
    View.showDeathMessage();

    expect(elements.deathmessage.style.display).toBe('initial');
  });

  test('view hide death message', () => {
    View.hideDeathMessage();

    expect(elements.deathmessage.style.display).toBe('none');
  });

  test('view update team live bar', () => {
    const mockTeamLives = {
      redLives: 1,
      blueLives: 3,
    };

    View.updateTeamLiveBar(mockTeamLives);

    expect(elements.redlivebar.style.width).toBe('25%');
    expect(elements.bluelivebar.style.width).toBe('75%');
  });

  test('view hide start screen', () => {
    View.hideStartScreen();

    expect(elements.startscreen.style.display).toBe('none');
  });

  test('view show start screen', () => {
    const assets = {
      face1: { classList: { add: jest.fn() } },
      face2: { classList: { add: jest.fn() } },
      face3: { classList: { add: jest.fn() } },
      face4: { classList: { add: jest.fn() } },
    };

    const callback = jest.fn();
    view.assets = assets;

    view.showStartScreen(callback);

    expect(elements.startscreen.style.display).toBe('initial');

    expect(assets.face1.classList.add).toHaveBeenCalledTimes(1);
    expect(assets.face1.classList.add).toHaveBeenCalledWith('img-thumbnail');
    expect(assets.face2.classList.add).toHaveBeenCalledTimes(1);
    expect(assets.face2.classList.add).toHaveBeenCalledWith('img-thumbnail');
    expect(assets.face3.classList.add).toHaveBeenCalledTimes(1);
    expect(assets.face3.classList.add).toHaveBeenCalledWith('img-thumbnail');
    expect(assets.face4.classList.add).toHaveBeenCalledTimes(1);
    expect(assets.face4.classList.add).toHaveBeenCalledWith('img-thumbnail');

    expect(elements['choice1-label'].appendChild).toHaveBeenCalledTimes(1);
    expect(elements['choice1-label'].appendChild).toHaveBeenCalledWith(assets.face1);
    expect(elements['choice2-label'].appendChild).toHaveBeenCalledTimes(1);
    expect(elements['choice2-label'].appendChild).toHaveBeenCalledWith(assets.face2);
    expect(elements['choice3-label'].appendChild).toHaveBeenCalledTimes(1);
    expect(elements['choice3-label'].appendChild).toHaveBeenCalledWith(assets.face3);
    expect(elements['choice4-label'].appendChild).toHaveBeenCalledTimes(1);
    expect(elements['choice4-label'].appendChild).toHaveBeenCalledWith(assets.face4);
  });

  test('view show start screen onclick nothing checked', () => {
    const assets = {
      face1: { classList: { add: jest.fn() } },
      face2: { classList: { add: jest.fn() } },
      face3: { classList: { add: jest.fn() } },
      face4: { classList: { add: jest.fn() } },
    };

    const callback = jest.fn();
    view.assets = assets;

    view.showStartScreen(callback);

    elements.startbutton.onclick();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('face1', 'normal');
  });

  test('view show start screen onclick everything checked', () => {
    const assets = {
      face1: { classList: { add: jest.fn() } },
      face2: { classList: { add: jest.fn() } },
      face3: { classList: { add: jest.fn() } },
      face4: { classList: { add: jest.fn() } },
    };

    const callback = jest.fn();
    view.assets = assets;

    view.showStartScreen(callback);
    elements.startbutton.onclick();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenNthCalledWith(1, 'face1', 'normal');

    elements.choice1.checked = true;
    elements.choice2.checked = true;
    elements.choice3.checked = true;
    elements.choice4.checked = true;

    elements['teamgame-checkbox'].checked = true;

    elements.startbutton.onclick();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(2, 'face4', 'teams');
  });
});
