class AssetLoader {
  static loadImage(name, url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve({ name, asset: image });
    });
  }

  static loadAudio(name, url) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadeddata = () => resolve({ name, asset: audio });
    });
  }

  static loadImages(imagesToLoad) {
    return AssetLoader.loadAssets(imagesToLoad, AssetLoader.loadImage);
  }

  static loadAudios(audiosToLoad) {
    return AssetLoader.loadAssets(audiosToLoad, AssetLoader.loadAudio);
  }

  static loadAssets(assetsToLoad, assetLoadFunction) {
    return Promise.all(assetsToLoad.map((asset) => assetLoadFunction(asset.name, asset.url)))
      .then((assets) =>
        assets.reduceRight((acc, elem) => {
          return { ...acc, [elem.name]: elem.asset };
        }, {})
      )
      .catch(() => {
        throw new Error('Not all assets could be loaded.');
      });
  }
}

export default AssetLoader;
