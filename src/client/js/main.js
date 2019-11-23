import '../css/index.css';
import View from './view';
import life1 from '../img/1 life left.png';
import life2 from '../img/2 lives left.png';
import life3 from '../img/3 lives left.png';
import AssetLoader from './assetLoader';
import Game from './game';

const init = () => {
  const view = new View();
  AssetLoader.loadAssets([
    { name: 'life1', url: life1 },
    { name: 'life2', url: life2 },
    { name: 'life3', url: life3 },
  ]).then((assets) => {
    console.log(assets);
    // this.view.drawCircle(100, 100, 50, 'red');

    view.drawImage(100, 100, assets.life1);
    // eslint-disable-next-line no-new
    new Game(view, assets);
  });
};

window.onload = init();
