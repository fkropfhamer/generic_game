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

  walls: [],
};

const constraintWalls = {
  x: 50,
  y: 10,
  height: 20,
  width: 100,
  angle: 0,
  fillColor: 'white',
  strokeColor: 'black',
};
const barrierWalls = {
  x: 50,
  y: 10,
  height: 20,
  width: 60,
  angle: Math.PI / 4,
  fillColor: 'white',
  strokeColor: 'white',
};

function addConstraintWalls() {
  for (let i = 0; i < config.fieldWidth; i += 100) {
    config.walls.push({
      ...constraintWalls,
      x: constraintWalls.x + i,
    });
    config.walls.push({
      ...constraintWalls,
      x: constraintWalls.x + i,
      y: config.fieldHeight - 10,
    });
    config.walls.push({
      ...constraintWalls,
      x: 10,
      y: 50 + i,
      angle: Math.PI / 2,
    });
    config.walls.push({
      ...constraintWalls,
      x: config.fieldWidth - 10,
      y: 50 + i,
      angle: Math.PI / 2,
    });
  }
}

function addBarrierWalls() {
  for (let i = 1; i <= 3; i += 1) {
    for (let j = 1; j <= 3; j += 1) {
      config.walls.push({
        ...barrierWalls,
        x: ((config.fieldWidth * 1) / 4) * i,
        y: ((config.fieldHeight * 1) / 4) * j,
      });
      config.walls.push({
        ...barrierWalls,
        x: ((config.fieldWidth * 1) / 4) * i,
        y: ((config.fieldHeight * 1) / 4) * j,
        angle: -barrierWalls.angle,
      });
    }
  }
}

addBarrierWalls();
addConstraintWalls();

export default config;
