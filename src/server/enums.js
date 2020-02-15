export const powerUpTypes = Object.freeze({
  ADDHEALTH: 'health',
  SHIELD: 'shield',
  SPEED: 'speed',
  FIRERATE: 'firerate',
  FREEZE: 'freeze',
});

export const iceSandTypes = Object.freeze({
  ICE: 'ice',
  SAND: 'sand',
});

export const Color = Object.freeze({
  BLUE: 'blue',
  RED: 'red',
  BLACK: 'black',
  WHITE: 'white',
  YELLOW: 'yellow',
  GREY: 'grey',
});

export const Mode = Object.freeze({
  TEAMS: 'teams',
  NORMAL: 'normal',
});

export const Key = Object.freeze({
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  KEY_S: 'KeyS',
  KEY_W: 'KeyW',
  KEY_D: 'KeyD',
  KEY_A: 'KeyA',
});

export const SocketEvent = Object.freeze({
  CONNECTION: 'connection',
  KEYSPRESSED: 'keyspressed',
  SHOOT: 'shoot',
  UPDATE_ANGLE: 'update angle',
  DISCONNECT: 'disconnect',
  READY: 'ready',
  START: 'start',
  WAIT: 'wait',
  UPDATE: 'update',
  TIME_OVER: 'time over',
  WIN: 'win',
  LOSE: 'lose',
  SPLASH_SOUND: 'splash sound',
  DEATH: 'death',
  CONNECT: 'connect',
});

export const EventListener = Object.freeze({
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  CLICK: 'click',
  MOUSEMOVE: 'mousemove',
});
