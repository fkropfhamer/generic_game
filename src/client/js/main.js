import '../css/index.css';
import View from './view';
import red1life from '../img/red1life.png';
import red2life from '../img/red2life.png';
import red from '../img/red.png';
import blue1life from '../img/blue1life.png';
import blue2life from '../img/blue2life.png';
import blue from '../img/blue.png';
import face1 from '../img/face1.png';
import face2 from '../img/face2.png';
import face3 from '../img/face3.png';
import face4 from '../img/face4.png';
import background from '../img/background.png';
import AssetLoader from './assetloader';
import Game from './game';

window.onload = () => {
  const view = new View();
  AssetLoader.loadAssets([
    { name: 'red0life', url: blue },
    { name: 'red1life', url: red1life },
    { name: 'red2life', url: red2life },
    { name: 'red', url: red },
    { name: 'blue0life', url: red },
    { name: 'blue1life', url: blue1life },
    { name: 'blue2life', url: blue2life },
    { name: 'blue', url: blue },
    { name: 'face1', url: face1 },
    { name: 'face2', url: face2 },
    { name: 'face3', url: face3 },
    { name: 'face4', url: face4 },
    {name: 'background', url: background}
  ]).then((assets) => {
    view.assets = assets;
    // eslint-disable-next-line no-new
    new Game(view, assets);
  });
};
