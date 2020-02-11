import { powerUpTypes, iceSandTypes, Color } from './enums';
import Util from './util';

const config = Util.deepFreeze({
  INITIALIZE_WITH_ZERO: 0,

  GAME_DURATION: 180,
  TIMER_RATE: 100,
  TEAM_SIZE: 2,
  FIELD_WIDTH: 1280, // 16:9
  FIELD_HEIGHT: 720,

  PLAYER_SCALE: 0.5,
  PLAYER_SPEED: 2,
  PLAYER_RADIUS: 25,
  PLAYER_REPULSION: 10,
  PLAYER_LIVES: 3,
  PLAYER_STARTING_POSITIONS: [
    { x: 100, y: 100 },
    { x: 1180, y: 620 },
    { x: 100, y: 620 },
    { x: 1180, y: 100 },
  ],

  BULLET_INDICATOR_RADIUS: 10,
  BULLET_INDICATOR_DISTANCE: 20,
  BULLET_INDICATOR_COLOR: Color.YELLOW,

  PLAYER_INDICATOR_COLOR: Color.YELLOW,

  SHOOTING_RATE: 100,
  BULLET_SPEED: 5,
  BULLET_RADIUS: 10,

  POWERUP_SCALE: 0.4,
  MAX_POWERUPS_ON_FIELD: 3,
  POWERUP_RADIUS: 20,
  POWERUP_DURATION: 750,
  POWERUP_SPAWN_DELAY: 3,

  POWERUP_SHIELD_DISTANCE_TO_PLAYER: 5,
  POWERUP_SHIELD_LINEWIDTH: 6,
  POWERUP_FIRERATE_BOOSTER: 4,
  POWERUP_SPEED_BOOSTER: 2,
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
  POWER_UPS_POSITION: [
    { x: 150, y: 100 },
    { x: 640, y: 100 },
    { x: 1130, y: 100 },
    { x: 150, y: 360 },
    { x: 480, y: 450 },
    { x: 800, y: 450 },
    { x: 480, y: 270 },
    { x: 800, y: 270 },
    { x: 1130, y: 360 },
    { x: 150, y: 620 },
    { x: 640, y: 620 },
    { x: 1130, y: 620 },
  ],

  ICE_SPEED: 2,
  SAND_SPEED: 1 / 2,
  ICE_SAND_FIELDS: [
    { x: 800, y: 270, type: iceSandTypes.ICE },
    { x: 800, y: 450, type: iceSandTypes.SAND },
    { x: 400, y: 270, type: iceSandTypes.ICE },
    { x: 400, y: 450, type: iceSandTypes.SAND },
  ],
  ICE_SAND_EXTENT: {
    height: 100,
    width: 100,
  },

  PORTAL_RADIUS: 41.25, // 1.5*PLAYER_RADIUS
  PORTAL_RING_LINEWIDTH: 3,
  PORTAL_ANIMATION: 5,
  PORTAL_OFFSET: 1.1,
  PORTAL_COLOR: Color.GREY,
  PORTALS: [
    {
      x1: 160,
      y1: 180,
      x2: 1120,
      y2: 540,
      starttime: 140,
      endtime: 100,
    },
    {
      x1: 160,
      y1: 540,
      x2: 1120,
      y2: 180,
      starttime: 80,
      endtime: 40,
    },
  ],

  WALL_LINEWIDTH: 3,
  NUMBER_OF_VERTICAL_WALLS: 10,
  NUMBER_OF_HORIZONTAL_WALLS: 12,
  NUMBER_OF_HORIZONTAL_BARRIERS: 3,
  NUMBER_OF_VERTICAL_BARRIERS: 3,
  constraintWalls: {
    x: 0,
    y: 10,
    height: 20,
    angle: 0,
    fillColor: Color.WHITE,
    strokeColor: Color.BLACK,
  },

  barrierWalls: {
    x: 50,
    y: 10,
    height: 20,
    width: 60,
    angle: Math.PI / 4,
    fillColor: Color.WHITE,
    strokeColor: Color.WHITE,
  },
});

export default config;
