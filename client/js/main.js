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
import speedPowerup from '../img/speedPowerup.png';
import healthPowerup from '../img/healthPowerup.png';
import fireratePowerup from '../img/fireratePowerup.png';
import shieldPowerup from '../img/shieldPowerup.png';
import freezePowerup from '../img/freezePowerup.png';
import sand from '../img/sand.png';
import ice from '../img/ice.png';
import playerIced from '../img/playerIced.png';
import AssetLoader from './assetloader';
import Client from './client';
import splash from '../sound/flyswatter4.mp3';
import backgroundMusic from '../sound/Tec.mp3';
import arrowbuttons from '../img/arrowButtons.png';
import mouseclick from '../img/mouseClick.png';
import portalinstruction from '../img/portal-instruction.png';

window.onload = () => {
  const view = new View();
  Promise.all([
    AssetLoader.loadImages([
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
      { name: 'speed', url: speedPowerup },
      { name: 'health', url: healthPowerup },
      { name: 'shield', url: shieldPowerup },
      { name: 'firerate', url: fireratePowerup },
      { name: 'freeze', url: freezePowerup },
      { name: 'sand', url: sand },
      { name: 'ice', url: ice },
      { name: 'playerIced', url: playerIced },
      { name: 'arrowbuttons', url: arrowbuttons },
      { name: 'mouseclick', url: mouseclick },
      { name: 'portalinstruction', url: portalinstruction },
    ]),
    AssetLoader.loadAudios([
      { name: 'splash', url: splash },
      { name: 'backgroundMusic', url: backgroundMusic },
    ]),
  ]).then((assets) => {
    const [images, audios] = assets;
    view.images = images;
    view.audios = audios;
    // eslint-disable-next-line no-new
    new Client(view, images, audios);
  });
};
