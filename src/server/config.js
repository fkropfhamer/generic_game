import { powerUpTypes } from './enums';
import Util from './util';

const config = Util.deepFreeze({
  BULLET_SPEED: 5,
  BULLET_DURATION: 1000,
  PLAYER_SPEED: 1,
  PLAYER_RADIUS: 27.5,
  PLAYER_REPULSION: 10,
  GAME_DURATION: 60,
  PLAYER_LIVES: 3,
  BULLET_RADIUS: 10,
  TEAM_SIZE: 2,
  POWERUP_RADIUS: 10,
  POWERUP_SHIELD_DISTANCE_TO_PLAYER: 5,
  POWERUP_SHIELD_LINEWIDTH: 6,

  PORTAL_RADIUS: 41.25, // 1.5*PLAYER_RADIUS
  PORTAL_RING_LINEWIDTH: 3,
  PORTAL_ANIMATION: 5,
  PORTAL_COLOR: 'grey',

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
    { x: 800, y: 265, type: powerUpTypes.ADDHEALTH },
  ],

  portals: [
    {
      x1: 300,
      y1: 100,
      x2: 900,
      y2: 600,
      starttime: 50,
      endtime: 35,
    },
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
