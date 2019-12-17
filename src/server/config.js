const config = {
  bulletSpeed: 5,
  bulletDuration: 1000,
  playerSpeed: 1,
  playerRadius: 27.5,
  playerRepulsion: 10,
  gameDuration: 60,
  playerLives: 3,
  bulletRadius: 10,
  teamSize: 2,

  fieldWidth: 1280, // 16:9
  fieldHeight: 720,
  shootingRate: 100,

  playerstartingPositions: [
    { x: 100, y: 100 },
    { x: 1180, y: 620 },
    { x: 100, y: 620 },
    { x: 1180, y: 100 },
  ],

  walls: [],
  numberOfVerticalWalls: 10,
  numberOfHorizontalWalls: 12,
};

const constraintWalls = {
  x: 0,
  y: 10,
  height: 20,
  width: 100,
  angle: 0,
  fillColor: 'black',
  strokeColor: 'white',
};
const barrierWalls = {
  x: 50,
  y: 10,
  height: 20,
  width: 60,
  angle: Math.PI / 4,
  fillColor: 'black',
  strokeColor: 'black',
};

function setupConstraintWalls() {
  const horizontalWidth = config.fieldWidth / config.numberOfHorizontalWalls;
  for (let i = horizontalWidth / 2; i < config.fieldWidth; i += horizontalWidth) {
    config.walls.push({
      ...constraintWalls,
      x: i,
      width: horizontalWidth,
    });
    config.walls.push({
      ...constraintWalls,
      x: i,
      width: horizontalWidth,
      y: config.fieldHeight - 10,
    });
  }
}
const veritcalWidth = config.fieldHeight / config.numberOfVerticalWalls;
for (let i = veritcalWidth / 2; i < config.fieldHeight; i += veritcalWidth) {
  config.walls.push({
    ...constraintWalls,
    x: 10,
    y: i,
    width: veritcalWidth,
    angle: Math.PI / 2,
  });
  config.walls.push({
    ...constraintWalls,
    x: config.fieldWidth - 10,
    y: i,
    width: veritcalWidth,
    angle: Math.PI / 2,
  });
}

function setupBarrierWalls() {
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

setupBarrierWalls();
setupConstraintWalls();

export default config;
