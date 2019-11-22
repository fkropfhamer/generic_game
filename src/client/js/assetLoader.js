function loadAsset(name, url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = resolve({ name, image });
  });
}

function loadAssets(assetsToLoad) {
  return Promise.all(assetsToLoad.map((asset) => loadAsset(asset.name, asset.url)))
    .then((assets) => assets.reduceRight((acc, elem) => ({ ...acc, [elem.name]: elem.image }), {}))
    .catch((error) => {
      throw new Error('Not all assets could be loaded.');
    });
}

export default loadAssets;
