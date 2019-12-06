const config = {
  bulletSpeed: 5,
  bulletDuration: 1000,
  playerSpeed: 1,
  playerRadius: 27.5,
  playerRepulsion: 10,
  gameDuration: 60,
  playerLives: 3,
  bulletRadius: 10,
  fieldWidth: 1366,
  fieldHeigth: 768,

  playerstartingPositions: [
    { x: 100, y: 100 },
    { x: 500, y: 100 },
    { x: 100, y: 200 },
    { x: 500, y: 200 },
  ],

  walls: [
    {
      x: 500,
      y: 10,
      height: 20,
      width: 100,
      angle: 0,
      color: 'white',
    },
    {
      x: 500,
      y: 300,
      height: 20,
      width: 100,
      angle: Math.PI / 8,
      color: 'white',
    },
  ],
};

export default config;
