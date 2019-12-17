import { powerUpTypes } from './enums';

const config = {
  BULLET_SPEED: 5,
  BULLET_DURATION: 1000,
  PLAYER_SPEED: 1,
  PLAYER_RADIUS: 27.5,
  PLAYER_REPULSION: 10,
  GAME_DURATION: 60,
  PLAYER_LIVES: 3,
  BULLET_RADIUS: 10,
  TEAM_SIZE: 2,

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
  initPowerUps: [{ x: 500, y: 500, type: powerUpTypes.ADDHEALTH }],

  constraintWalls: {
    x: 0,
    y: 10,
    height: 20,
    width: 100,
    angle: 0,
    fillColor: 'black',
    strokeColor: 'white',
  },

  barrierWalls: {
    x: 50,
    y: 10,
    height: 20,
    width: 60,
    angle: Math.PI / 4,
    fillColor: 'black',
    strokeColor: 'black',
  },
};

export default config;
