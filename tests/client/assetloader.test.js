/* eslint-disable max-classes-per-file */
import AssetLoader from '../../src/client/js/assetloader';

describe('assetloader', () => {
  let imageToLoad;
  let audioToLoad;

  beforeEach(() => {
    global.Image = class {
      constructor() {
        imageToLoad = this;
      }
    };

    global.Audio = class {
      constructor(url) {
        audioToLoad = this;
        this.src = url;
      }
    };
  });

  it('works for empty array', () => {
    const testImgs = [];
    AssetLoader.loadImages(testImgs).then((loadedImages) => {
      expect(loadedImages).toEqual({});
    });

    const testAudios = [];
    AssetLoader.loadAudios(testAudios).then((loadedAudios) => {
      expect(loadedAudios).toEqual({});
    });
  });

  it('loads images', (done) => {
    const testImgs = [{ name: 'test', url: 'https:www.google.de' }];
    AssetLoader.loadImages(testImgs).then((loadedImages) => {
      expect(loadedImages.test.src).toBe('https:www.google.de');
      expect(loadedImages.test).toBe(imageToLoad);
      done();
    });
    imageToLoad.onload();
  });

  it('loads audios', (done) => {
    const testAudios = [{ name: 'test', url: 'https:www.google.de' }];
    AssetLoader.loadAudios(testAudios).then((loadedAudios) => {
      expect(loadedAudios.test.src).toBe('https:www.google.de');
      expect(loadedAudios.test).toBe(audioToLoad);
      done();
    });
    audioToLoad.onloadeddata();
  });

  test('assetloader load image', (done) => {
    AssetLoader.loadImage('img', 'www.example.com').then((loadedImage) => {
      expect(loadedImage.name).toBe('img');
      expect(loadedImage.asset).toBe(imageToLoad);
      done();
    });

    imageToLoad.onload();
  });

  test('assetloader load image', (done) => {
    AssetLoader.loadAudio('audio', 'www.example.com').then((loadedAudio) => {
      expect(loadedAudio.name).toBe('audio');
      expect(loadedAudio.asset).toBe(audioToLoad);
      done();
    });

    audioToLoad.onloadeddata();
  });

  it('is an abstract class', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new AssetLoader();
    }).toThrow('Assetloader is an abstract class and and cant be initiated');
  });

  it('throw as an error on not loaded picture', () => {
    function errorFn() {
      return new Promise(() => {
        throw Error('error');
      });
    }

    expect(AssetLoader.loadAssets([{}], errorFn)).rejects.toEqual(
      new Error('Not all assets could be loaded.')
    );
  });
});
