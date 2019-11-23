class AssetLoader {
  static loadAsset(name, url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = url;
      image.onload = resolve({ name, image });
    });
  }

  static loadAssets(assetsToLoad) {
    return Promise.all(assetsToLoad.map((asset) => this.loadAsset(asset.name, asset.url)))
      .then((assets) =>
        assets.reduceRight((acc, elem) => {
          return { ...acc, [elem.name]: elem.image };
        }, {})
      )
      .catch(() => {
        throw new Error('Not all assets could be loaded.');
      });
  }
}

export default AssetLoader;
