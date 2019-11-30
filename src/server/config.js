const config = {
  bulletSpeed: 5,
  bulletDuration: 1000,
  playerSpeed: 1,
  playerRadius: 27.5,
  gameDuration: 60,
  playerLifes: 3,

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
      width: 50,
      color: 'white',
    },
    {
      x: 500,
      y: 500,
      height: 20,
      width: 50,
      color: 'white',
    },
  ],
};

export default config;
