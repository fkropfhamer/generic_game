import { powerUpTypes, iceSandTypes } from './enums';
import Util from './util';

const config = Util.deepFreeze({
  BULLET_SPEED: 5,
  PLAYER_SPEED: 3,
  PLAYER_RADIUS: 25,
  PLAYER_REPULSION: 10,
  GAME_DURATION: 180,
  PLAYER_LIVES: 3,
  BULLET_RADIUS: 10,
  TEAM_SIZE: 2,
  POWERUP_RADIUS: 20,
  ICESAND_RADIUS: 70,
  ICE_SPEED: 4,
  SAND_SPEED: 0.2,
  POWERUP_DURATION: 7500,
  POWERUP_SPAWN_DELAY: 5000,
  MAX_POWERUPS_ON_FIELD: 3,
  POWERUP_TYPES: [
    powerUpTypes.FIRERATE,
    powerUpTypes.FREEZE,
    powerUpTypes.SPEED,
    powerUpTypes.SPEED,
    powerUpTypes.SHIELD,
    powerUpTypes.SHIELD,
    powerUpTypes.ADDHEALTH,
    powerUpTypes.ADDHEALTH,
    powerUpTypes.ADDHEALTH,
    powerUpTypes.SHIELD,
    powerUpTypes.SHIELD,
    powerUpTypes.SPEED,
    powerUpTypes.SPEED,
    powerUpTypes.FREEZE,
    powerUpTypes.FIRERATE,
  ],
  ICE_SAND_FIELDS: [
    { x: 750, y: 250, type: iceSandTypes.ICE },
    { x: 750, y: 550, type: iceSandTypes.SAND },
  ],
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
  POWER_UPS_POSITION: [
    { x: 150, y: 100 },
    { x: 640, y: 100 },
    { x: 1130, y: 100 },
    { x: 150, y: 360 },
    { x: 480, y: 455 },
    { x: 800, y: 455 },
    { x: 480, y: 265 },
    { x: 800, y: 265 },
    { x: 1130, y: 360 },
    { x: 150, y: 620 },
    { x: 640, y: 620 },
    { x: 1130, y: 620 },
  ],

  portals: [
    {
      x1: 300,
      y1: 100,
      x2: 900,
      y2: 600,
      starttime: 160,
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
