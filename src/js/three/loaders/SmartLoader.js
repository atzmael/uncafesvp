import * as THREE from "three"
import promisifyLoader from "./promisifyLoader.js"

const SmartLoader = () => {
  let isLoaded = false
  let loadingPercentage = 0

  const loadedData = {
    // TODO: use Sets instead
    assets: [],
    items: []
    //...
  }

  const loadingManager = new THREE.LoadingManager(
    //onLoaded for all loaders
    () => (isLoaded = true),
    //onProgress for all loaders
    (url, loadedQtty, totalToLoad) => {
      loadingPercentage = (loadedQtty / totalToLoad) * 100
    },
    //onError for all loaders
    undefined
  )

  const textureLoader = promisifyLoader(
    new THREE.TextureLoader(loadingManager) /*,  onProgress */
  )
  // const textureLoader = promisifyLoader(new THREE.TextureLoader(loadingManager))

  const textureRegexp = /\.(tga|png|jpg|jpeg)$/i

  loadingManager.addHandler(textureRegexp, textureLoader)
  // loadingManager.addHandler(/\.(png|jpg|jpeg)$/i, textureLoader)

  function load(toLoad) {
    const appropriateLoader = loadingManager.getHandler(toLoad)
    if (appropriateLoader === null) throw `No appropriateLoader found for ${toLoad}`
    appropriateLoader.load(toLoad)
  }

  return {
    load
  }
}

export default SmartLoader
