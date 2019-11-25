import Player from '../../src/server/player';

describe('player test', () => {
  let player;
  let socket;
  let gameHandler;

  beforeEach(() => {
    socket = { on: jest.fn(), emit: jest.fn() };
    gameHandler = {};
    player = new Player(socket, gameHandler);
  });

  test('player constructor', () => {
    expect(player.socket).toBe(socket);
    expect(player.gameHandler).toBe(gameHandler);
    expect(player.speed).toBe(1);
    expect(player.radius).toBe(60);
    expect(player.angle).toBe(0);
    expect(socket.on.mock.calls.length).toBe(4);
    expect(socket.on.mock.calls[0][0]).toBe('keys');
    expect(socket.on.mock.calls[1][0]).toBe('shoot');
    expect(socket.on.mock.calls[2][0]).toBe('update angle');
    expect(socket.on.mock.calls[3][0]).toBe('disconnect');
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
    const opponent = { x: 100, y: 200, angle: Math.PI };

    player.notifyStart(opponent, 30);
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('start');
    expect(socket.emit.mock.calls[0][1]).toEqual({
      x: 400,
      y: 300,
      angle: 0,
      color: 'blue',
      opponentX: 100,
      opponentY: 200,
      opponentAngle: Math.PI,
      timer: 30,
    });
  });

  test('player notify waiting', () => {
    player.notifyWaiting();

    expect(player.waiting).toBe(true);
    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('waiting');
  });

  test('player notify update', () => {
    player.x = 400;
    player.y = 300;
    const opponent = { x: 100, y: 200, angle: Math.PI };

    player.notifyUpdate(opponent, [], 25);

    expect(socket.emit.mock.calls.length).toBe(1);
    expect(socket.emit.mock.calls[0][0]).toBe('update');
    expect(socket.emit.mock.calls[0][1]).toEqual({
      x: 400,
      y: 300,
      angle: 0,
      opponentX: opponent.x,
      opponentY: opponent.y,
      opponentAngle: opponent.angle,
      bullets: [],
      timer: 25,
    });
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

  test('player update', () => {
    player.update();
    // TODO
  });
});
