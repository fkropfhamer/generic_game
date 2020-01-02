import Game from '../../src/server/game';
import config from '../../src/server/config';

describe('game test', () => {
  let player1;
  let player2;
  let game;

  beforeEach(() => {
    player1 = {
      color: 'blue',
      notifyStart: jest.fn(),
      notifyOpponentDisconnected: jest.fn(),
      notifyTimeOver: jest.fn(),
      notifyUpdate: jest.fn(),
      notifyWin: jest.fn(),
      notifyLose: jest.fn(),
      update: jest.fn(),
    };
    player2 = {
      color: 'red',
      notifyStart: jest.fn(),
      notifyOpponentDisconnected: jest.fn(),
      notifyTimeOver: jest.fn(),
      notifyUpdate: jest.fn(),
      notifyWin: jest.fn(),
      notifyLose: jest.fn(),
      update: jest.fn(),
    };

    game = new Game([player1, player2]);
  });

  test('test constructor', () => {
    expect(game.players).toEqual([player1, player2]);
    expect(game.bullets).toEqual([]);
    expect(game.deadPlayers).toEqual([]);
  });

  test('test game start', () => {
    game.start();

    expect(game.timer).toBe(60);
    expect(game.count).toBe(0);

    expect(game.players[0].x).toBe(config.PLAYER_STARTING_POSITIONS[0].x);
    expect(game.players[0].y).toBe(config.PLAYER_STARTING_POSITIONS[0].y);
    expect(game.players[0].color).toBe('blue');

    expect(game.players[1].x).toBe(config.PLAYER_STARTING_POSITIONS[1].x);
    expect(game.players[1].y).toBe(config.PLAYER_STARTING_POSITIONS[1].y);
    expect(game.players[1].color).toBe('red');

    expect(game.players[0].notifyStart.mock.calls.length).toBe(1);
    expect(game.players[1].notifyStart.mock.calls.length).toBe(1);

    expect(game.players[0].notifyStart.mock.calls[0][0]).toEqual([player2]);
    expect(game.players[0].notifyStart.mock.calls[0][1]).toBe(60);
    expect(game.players[1].notifyStart.mock.calls[0][0]).toEqual([player1]);
    expect(game.players[1].notifyStart.mock.calls[0][1]).toBe(60);

    expect(game.players[0].game).toBe(game);
    expect(game.players[1].game).toBe(game);
  });

  test('game add bullet', () => {
    const bullet = {};
    game.addBullet(bullet);

    expect(game.bullets).toEqual([bullet]);
  });

  test('game player1 disconnected', () => {
    game.end = jest.fn();
    game.playerDisconnected(player1);

    expect(player2.notifyWin.mock.calls.length).toBe(1);
    expect(player1.notifyLose.mock.calls.length).toBe(1);
    expect(game.end.mock.calls.length).toBe(1);
  });

  test('game player2 disconnected', () => {
    game.end = jest.fn();
    game.playerDisconnected(player2);

    expect(player1.notifyWin.mock.calls.length).toBe(1);
    expect(player2.notifyLose.mock.calls.length).toBe(1);
    expect(game.end.mock.calls.length).toBe(1);
  });

  test('game player disconnected game has ended', () => {
    game.playerDied = jest.fn();
    game.ended = true;

    game.playerDisconnected(player1);

    expect(game.playerDied).toHaveBeenCalledTimes(0);
  });

  test('game time is over', () => {
    game.end = jest.fn();
    game.timeIsOver();

    expect(player1.notifyTimeOver.mock.calls.length).toBe(1);
    expect(player2.notifyTimeOver.mock.calls.length).toBe(1);
  });

  test('game loop decrement count', () => {
    game.update = jest.fn();
    game.count = 100;
    game.timer = 60;
    game.loop();

    expect(game.timer).toBe(59);
    expect(game.count).toBe(101);
    expect(game.update.mock.calls.length).toBe(1);
  });

  test('game loop decrement count end game', () => {
    game.update = jest.fn();
    game.timeIsOver = jest.fn();
    game.count = 100;
    game.timer = 1;
    game.loop();

    expect(game.timer).toBe(0);
    expect(game.count).toBe(101);
    expect(game.update.mock.calls.length).toBe(1);
    expect(game.timeIsOver.mock.calls.length).toBe(1);
  });

  test('game loop', () => {
    game.update = jest.fn();
    game.timeIsOver = jest.fn();
    game.count = 50;
    game.timer = 10;
    game.loop();

    expect(game.timer).toBe(10);
    expect(game.count).toBe(51);
    expect(game.update.mock.calls.length).toBe(1);
    expect(game.timeIsOver.mock.calls.length).toBe(0);
  });

  test('game update no bullets', () => {
    game.bullets = [];
    game.update();

    expect(player1.update.mock.calls.length).toBe(1);
    expect(player2.update.mock.calls.length).toBe(1);

    expect(player1.notifyUpdate.mock.calls.length).toBe(1);
    expect(player2.notifyUpdate.mock.calls.length).toBe(1);
  });

  test('game update bullets', () => {
    const bullet1 = { update: jest.fn() };
    const bullet2 = { update: jest.fn() };

    game.bullets = [bullet1, bullet2];

    game.update();

    expect(bullet1.update).toHaveBeenCalledTimes(1);
    expect(bullet2.update).toHaveBeenCalledTimes(1);
  });

  test('game calculate team lives 2 players', () => {
    player1.lives = 3;
    player2.lives = 3;
    expect(game.calculateTeamLives()).toEqual({ redLives: 3, blueLives: 3 });
  });

  test('game calculate team lives 4 players', () => {
    player1.lives = 3;
    player2.lives = 3;
    game.players.push({ color: 'blue', lives: 1 });
    game.players.push({ color: 'red', lives: 4 });
    expect(game.calculateTeamLives()).toEqual({ redLives: 7, blueLives: 4 });
  });

  test('game end', () => {
    game.end();

    expect(game.ended).toBe(true);
  });

  test('game checkPlayerCollisionPlayer', () => {
    game.players[0].x = 0;
    game.players[0].y = 0;
    game.players[0].radius = 1;

    const player = { x: 1, y: 0, radius: 2 };

    game.checkPlayerCollisionPlayer(player);
    expect(player.x).toBe(11);
    expect(player.y).toBe(0);
  });

  test('game playerdied teamgame not over', () => {
    const player = { x: 0, y: 0, notifyDeath: jest.fn() };
    game.playerDied(player);

    expect(game.players).toEqual([player1, player2]);
    expect(player.x).toBe(-500);
    expect(player.y).toBe(-500);
    expect(player.notifyDeath).toHaveBeenCalledTimes(1);
  });

  test('game playerdied red wins', () => {
    game.playerDied(game.players[0]);

    expect(player1.notifyLose).toHaveBeenCalledTimes(1);
    expect(player2.notifyWin).toHaveBeenCalledTimes(1);
  });

  test('game playerdied blue wins', () => {
    game.playerDied(game.players[1]);

    expect(player1.notifyWin).toHaveBeenCalledTimes(1);
    expect(player2.notifyLose).toHaveBeenCalledTimes(1);
  });

  test('game playerdied teamgame over notify dead players red wins', () => {
    const deadBluePlayer = { color: 'blue', notifyLose: jest.fn() };
    const deadRedPlayer = { color: 'red', notifyWin: jest.fn() };

    game.deadPlayers = [deadBluePlayer, deadRedPlayer];

    game.playerDied(game.players[0]);

    expect(player1.notifyLose).toHaveBeenCalledTimes(1);
    expect(player2.notifyWin).toHaveBeenCalledTimes(1);

    expect(deadRedPlayer.notifyWin).toHaveBeenCalledTimes(1);
    expect(deadBluePlayer.notifyLose).toHaveBeenCalledTimes(1);
  });

  test('game playerdied teamgame over notify dead players blue wins', () => {
    const deadBluePlayer = { color: 'blue', notifyWin: jest.fn() };
    const deadRedPlayer = { color: 'red', notifyLose: jest.fn() };

    game.deadPlayers = [deadBluePlayer, deadRedPlayer];

    game.playerDied(game.players[1]);

    expect(player2.notifyLose).toHaveBeenCalledTimes(1);
    expect(player1.notifyWin).toHaveBeenCalledTimes(1);

    expect(deadBluePlayer.notifyWin).toHaveBeenCalledTimes(1);
    expect(deadRedPlayer.notifyLose).toHaveBeenCalledTimes(1);
  });

  test('game checkwallcollisionbullet', () => {
    const bullet = {
      x: 20,
      y: 10,
      radius: 6,
      color: 'grey',
    };

    const wall = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    game.walls = [wall];
    game.bullets = [bullet];

    game.checkWallCollisionBullet(bullet);

    expect(game.bullets).toEqual([]);
    expect(wall.fillColor).toBe('grey');
  });

  test('game checkwallcollisionplayer', () => {
    const wall = {
      x: 10,
      y: 10,
      angle: 0,
      width: 10,
      height: 10,
    };

    const player = { x: 15, y: 10, radius: 5 };

    game.walls = [wall];

    game.checkWallCollisionPlayer(player);

    expect(player.x).toBe(42.5);
    expect(player.y).toBe(10);
  });

  test('game checkplayerhitspowerup', () => {
    const powerUp = {
      x: 0,
      y: 0,
      radius: 1,
      update: jest.fn(),
    };

    const player = {
      x: 1,
      y: 1,
      radius: 1,
    };

    game.powerUps = [powerUp];
    game.checkPlayerHitsPowerUp(player);

    expect(game.powerUps).toEqual([]);
    expect(powerUp.update).toHaveBeenCalledTimes(1);
  });

  test('game checkbulletshitsplayer', () => {
    const bullet = {
      x: 0,
      y: 0,
      radius: 2,
      color: '',
    };

    const player = {
      x: 1,
      y: 0,
      radius: 1,
      lives: 3,
      color: 'test',
      angle: 0,
    };

    game.bullets = [bullet];

    game.checkBulletHitsPlayer(player);

    expect(player.lives).toBe(2);
    expect(game.bullets).toEqual([]);
    expect(player.hitAngle).toBe(Math.PI);
  });

  test('game checkbulletshitsplayer player is shielded', () => {
    const bullet = {
      x: 0,
      y: 0,
      radius: 2,
      color: '',
    };

    const player = {
      x: 1,
      y: 0,
      radius: 1,
      lives: 3,
      color: 'test',
      isShielded: true,
    };

    game.bullets = [bullet];

    game.checkBulletHitsPlayer(player);

    expect(player.lives).toBe(3);
    expect(player.isShielded).toBe(false);
    expect(game.bullets).toEqual([]);
  });

  test('game checkbullethitsplayer player died', () => {
    const bullet = {
      x: 0,
      y: 0,
      radius: 2,
      color: '',
    };

    const player = {
      x: 1,
      y: 0,
      radius: 1,
      lives: 1,
      color: 'test',
    };

    game.playerDied = jest.fn();
    game.bullets = [bullet];

    game.checkBulletHitsPlayer(player);

    expect(player.lives).toBe(0);
    expect(game.bullets).toEqual([]);
    expect(game.playerDied).toHaveBeenCalledTimes(1);
    expect(game.playerDied).toHaveBeenCalledWith(player);
  });

  test('game checkbullethitsplayer no teamfire', () => {
    const bullet = {
      x: 0,
      y: 0,
      radius: 2,
      color: 'test',
    };

    const player = {
      x: 1,
      y: 0,
      radius: 1,
      lives: 1,
      color: 'test',
    };

    game.bullets = [bullet];

    game.checkBulletHitsPlayer(player);

    expect(player.lives).toBe(1);
    expect(game.bullets).toEqual([bullet]);
  });
});
