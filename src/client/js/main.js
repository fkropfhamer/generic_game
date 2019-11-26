import '../css/index.css';
import View from './view';
import life1 from '../img/1 life left.png';
import life2 from '../img/2 lives left.png';
import life3 from '../img/3 lives left.png';
import player1 from '../img/player1.png';
import player4 from '../img/player4.png';
import AssetLoader from './assetloader';
import Game from './game';

window.onload = () => {
  const view = new View();
  AssetLoader.loadAssets([
    { name: 'life1', url: life1 },
    { name: 'life2', url: life2 },
    { name: 'life3', url: life3 },
    { name: 'player1', url: player1 },
    { name: 'player4', url: player4 },
  ]).then((assets) => {
    // eslint-disable-next-line no-new
    new Game(view, assets);
  });
};
