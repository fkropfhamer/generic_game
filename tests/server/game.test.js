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
      notifySplashSound: jest.fn(),
      notifyStarting: jest.fn(),
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
      notifySplashSound: jest.fn(),
      notifyStarting: jest.fn(),
    };

    game = new Game([player1, player2]);
  });

  test('test constructor', () => {
    expect(game.players).toEqual([player1, player2]);
    expect(game.bullets).toEqual([]);
    expect(game.deadPlayers).toEqual([]);
  });

  test('test game start', () => {
    jest.useFakeTimers();

    game.notifyPlayersUpdate = jest.fn();
    game.starting = jest.fn();
    game.start();

    expect(game.timer).toBe(180);
    expect(game.count).toBe(0);

    expect(game.players[0].x).toBe(config.PLAYER_STARTING_POSITIONS[0].x);
    expect(game.players[0].y).toBe(config.PLAYER_STARTING_POSITIONS[0].y);
    expect(game.players[0].color).toBe('blue');

    expect(game.players[1].x).toBe(config.PLAYER_STARTING_POSITIONS[1].x);
    expect(game.players[1].y).toBe(config.PLAYER_STARTING_POSITIONS[1].y);
    expect(game.players[1].color).toBe('red');

    expect(game.players[0].game).toBe(game);
    expect(game.players[1].game).toBe(game);

    expect(game.notifyPlayersUpdate).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(game.starting).toHaveBeenCalledTimes(0);

    jest.runAllTimers();
    expect(game.starting).toHaveBeenCalledTimes(1);
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

    expect(player1.update).toHaveBeenCalledTimes(1);
    expect(player2.update).toHaveBeenCalledTimes(1);
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

    expect(player.x).toBe(40);
    expect(player.y).toBe(10);
  });

  test('game player hits powerup', () => {
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

    game.displayedPowerUps = [powerUp];
    game.checkPlayerHitsPowerUp(player);

    expect(game.displayedPowerUps).toEqual([]);
    expect(powerUp.update).toHaveBeenCalledTimes(1);
  });

  test('game player not hits powerup', () => {
    const powerUp = {
      x: 0,
      y: 0,
      radius: 1,
      update: jest.fn(),
    };

    const player = {
      x: 100,
      y: 100,
      radius: 1,
    };

    game.displayedPowerUps = [powerUp];
    game.checkPlayerHitsPowerUp(player);

    expect(game.displayedPowerUps).toEqual([powerUp]);
    expect(powerUp.update).toHaveBeenCalledTimes(0);
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
    expect(player1.notifySplashSound).toHaveBeenCalledTimes(1);
    expect(player2.notifySplashSound).toHaveBeenCalledTimes(1);
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

  test('game checkbulletshitsplayer player is frozen', () => {
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
      isFrozen: true,
    };

    game.bullets = [bullet];

    game.checkBulletHitsPlayer(player);

    expect(player.lives).toBe(2);
    expect(player.isFrozen).toBe(false);
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

  test('game something not hits portal', () => {
    const portal = {
      x1: 1,
      y1: 2,
      x2: 3,
      y2: 4,
      starttime: 8,
      endtime: 1,
    };

    const player = { x: 1000, y: 2000 };

    game.portals = [portal];
    game.timer = 3;

    game.checkObjectHitsPortal(player);

    expect(player.x).toBe(1000);
    expect(player.y).toBe(2000);
  });

  test('game something hits portal out of time', () => {
    const portal = {
      x1: 1,
      y1: 2,
      x2: 3,
      y2: 4,
      starttime: 5,
      endtime: 6,
    };

    const player = { x: 1, y: 2 };

    game.portals = [portal];
    game.timer = 1000;

    game.checkObjectHitsPortal(player);

    expect(player.x).toBe(1);
    expect(player.y).toBe(2);
  });

  test('game something hits portal1 and gets teleported', () => {
    const portal = {
      x1: 1,
      y1: 2,
      x2: 100,
      y2: 500,
      starttime: 8,
      endtime: 5,
    };

    const player = { x: 3, y: 4, radius: 5 };

    game.portals = [portal];
    game.timer = 6;

    game.checkObjectHitsPortal(player);

    expect(player.x).toBe(97.8);
    expect(player.y).toBe(497.8);
  });

  test('game something hits portal2 and gets teleported', () => {
    const portal = {
      x1: 1,
      y1: 2,
      x2: 100,
      y2: 500,
      starttime: 8,
      endtime: 5,
    };

    const player = { x: 98, y: 498, radius: 5 };

    game.portals = [portal];
    game.timer = 6;

    game.checkObjectHitsPortal(player);

    expect(player.x).toBe(3.2);
    expect(player.y).toBe(4.2);
  });

  test('game player walks on ice', () => {
    const iceField = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      type: 'ice',
    };

    const player = { x: 0, y: 0 };

    game.iceSandFields = [iceField];
    game.checkPlayerWalksOnIceOrSand(player);

    expect(player.isOnIce).toBe(true);
    expect(player.isOnSand).toBe(false);
  });

  test('game player walks on sand', () => {
    const sandField = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      type: 'sand',
    };

    const player = { x: 0, y: 0 };

    game.iceSandFields = [sandField];
    game.checkPlayerWalksOnIceOrSand(player);

    expect(player.isOnIce).toBe(false);
    expect(player.isOnSand).toBe(true);
  });

  test('game player walks not on ice and sand', () => {
    const sandField = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      type: 'sand',
    };
    const iceField = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      type: 'ice',
    };

    const player = { x: 1000, y: 1000 };

    game.iceSandFields = [iceField, sandField];
    game.checkPlayerWalksOnIceOrSand(player);

    expect(player.isOnIce).toBe(false);
    expect(player.isOnSand).toBe(false);
  });

  test('game starting counter > 0', () => {
    jest.useFakeTimers();
    game.startCounter = 10;

    game.starting();

    expect(player1.notifyStarting).toHaveBeenCalledTimes(1);
    expect(player1.notifyStarting).toHaveBeenCalledWith(10);
    expect(player2.notifyStarting).toHaveBeenCalledTimes(1);
    expect(player2.notifyStarting).toHaveBeenCalledWith(10);
    expect(game.startCounter).toBe(9);
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('game starting counter = 0', () => {
    jest.useFakeTimers();
    game.startCounter = 0;

    game.starting();

    expect(player1.notifyStart).toHaveBeenCalledTimes(1);
    expect(player2.notifyStart).toHaveBeenCalledTimes(1);
    expect(game.startCounter).toBe(0);
    expect(setInterval).toHaveBeenCalledTimes(1);
  });

  test('game place random powerup', () => {
    const powerUp = {};

    game.displayedPowerUps = [];
    game.powerUps = [powerUp];

    game.placeRandomPowerUp();

    expect(game.displayedPowerUps).toEqual([powerUp]);
  });

  test('game place random powerup more than max power up are placed', () => {
    const powerUp = {};
    const displayedPowerUps = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    game.displayedPowerUps = displayedPowerUps;
    game.powerUps = [powerUp];

    game.placeRandomPowerUp();

    expect(game.displayedPowerUps).toEqual(displayedPowerUps);
  });

  test('game place random powerup is allready placed', () => {
    let counter = -0.5;
    const mockMath = Object.create(global.Math);
    mockMath.random = () => {
      counter += 0.5;
      return counter;
    };
    global.Math = mockMath;

    const powerUp = {};
    const powerUp2 = {};
    const displayedPowerUps = [powerUp];
    game.displayedPowerUps = displayedPowerUps;
    game.powerUps = [powerUp, powerUp2];

    game.placeRandomPowerUp();

    expect(game.displayedPowerUps).toEqual([powerUp, powerUp2]);
  });

  test('game place ice sand fields', () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.1;
    global.Math = mockMath;

    game.placeIceSandFields();

    expect(game.iceSandFields.length).toBe(4);
  });

  test('game place ice sand fields random is bad  :[', () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.9;
    global.Math = mockMath;

    game.placeIceSandFields();

    expect(game.iceSandFields.length).toBe(0);
  });
});
