import '../css/index.css';
import View from './view';
import red33 from '../img/33%red.png';
import red66 from '../img/66%red.png';
import red from '../img/red.png';
import blue33 from '../img/33%blue.png';
import blue66 from '../img/66%blue.png';
import blue from '../img/blue.png';
import player1 from '../img/player1.png';
import player4 from '../img/player4.png';
import AssetLoader from './assetloader';
import Game from './game';

const init = () => {
  const view = new View();
  AssetLoader.loadAssets([
    { name: 'hitbyred', url: red33 },
    { name: '2hitsbyred', url: red66 },
    { name: 'red', url: red },
    { name: 'hitbyblue', url: blue33 },
    { name: '2hitsbyblue', url: blue66 },
    { name: 'blue', url: blue },
    { name: 'player1', url: player1 },
    { name: 'player4', url: player4 },
  ]).then((assets) => {
    // eslint-disable-next-line no-new
    new Game(view, assets);
  });
};

window.onload = init();
