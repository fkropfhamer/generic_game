import '../css/index.css';
import View from './view';
import red1life from '../img/red1life.png';
import red2life from '../img/red2life.png';
import red from '../img/red.png';
import blue1life from '../img/blue1life.png';
import blue2life from '../img/blue2life.png';
import blue from '../img/blue.png';
import player1 from '../img/player1.png';
import player4 from '../img/player4.png';
import AssetLoader from './assetloader';
import Game from './game';

window.onload = () => {
  const view = new View();
  AssetLoader.loadAssets([
    { name: 'red1life', url: red1life },
    { name: 'red2life', url: red2life },
    { name: 'red', url: red },
    { name: 'blue1life', url: blue1life },
    { name: 'blue2life', url: blue2life },
    { name: 'blue', url: blue },
    { name: 'player1', url: player1 },
    { name: 'player4', url: player4 },
  ]).then((assets) => {
    // eslint-disable-next-line no-new
    new Game(view, assets);
  });
};
