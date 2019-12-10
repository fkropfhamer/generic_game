const config = {
  bulletSpeed: 5,
  bulletDuration: 1000,
  playerSpeed: 1,
  playerRadius: 27.5,
  playerRepulsion: 10,
  gameDuration: 60,
  playerLives: 3,
  bulletRadius: 10,

  fieldWidth: 1280, // 16:9
  fieldHeight: 625,
  shootingRate: 100,

  playerstartingPositions: [
    { x: 100, y: 100 },
    { x: 1180, y: 100 },
    { x: 100, y: 200 },
    { x: 1180, y: 200 },
  ],

  constraintWalls: {
    x: 50,
    y: 10,
    height: 20,
    width: 100,
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
};

export default config;
