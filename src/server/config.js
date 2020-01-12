import { powerUpTypes } from './enums';
import { iceSandTypes } from './enums';
import Util from './util';

const config = Util.deepFreeze({
  BULLET_SPEED: 5,
  BULLET_DURATION: 1000,
  PLAYER_SPEED: 3,
  PLAYER_RADIUS: 27.5,
  PLAYER_REPULSION: 10,
  GAME_DURATION: 60,
  PLAYER_LIVES: 3,
  BULLET_RADIUS: 10,
  TEAM_SIZE: 2,
  POWERUP_RADIUS: 10,
  ICESAND_RADIUS: 70,
  FREEZE_DURATION: 1000000,

  FIELD_WIDTH: 1280, // 16:9
  FIELD_HEIGHT: 720,
  SHOOTING_RATE: 100,

  PLAYER_STARTING_POSITIONS: [
    { x: 100, y: 100 },
    { x: 1180, y: 620 },
    { x: 100, y: 620 },
    { x: 1180, y: 100 },
  ],

  NUMBER_OF_VERTICAL_WALLS: 10,
  NUMBER_OF_HORIZONTAL_WALLS: 12,
  POWER_UPS: [
    { x: 480, y: 455, type: powerUpTypes.ADDHEALTH },
    { x: 800, y: 455, type: powerUpTypes.SHIELD },
    { x: 480, y: 265, type: powerUpTypes.SHIELD },
    { x: 200, y: 550, type: powerUpTypes.FREEZE },
  ],
  ICE_SAND_FIELDS: [
    { x: 750, y: 250, type: iceSandTypes.ICE },
    { x: 750, y: 550, type: iceSandTypes.SAND },
  ],

  constraintWalls: {
    x: 0,
    y: 10,
    height: 20,
    angle: 0,
    fillColor: 'white',
    strokeColor: 'black',
  },

  barrierWalls: {
    x: 50,
    y: 10,
    height: 20,
    width: 60,
    angle: Math.PI / 4,
    fillColor: 'white',
    strokeColor: 'white',
  },
});

export default config;
