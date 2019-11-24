import * as THREE from "three"
import promisifyLoader from "./promisifyLoader.js"
import GLTFLoader from "three-gltf-loader"

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

  const basicLoaderTypes = {
    texture: { loader: THREE.TextureLoader, regexp: /\.(tga|png|jpg|jpeg)$/i },
    gltf: { loader: GLTFLoader, regexp: /\.(gltf|glb)$/i }
  }

  const basicLoaders = Object.values(basicLoaderTypes).map((type) => {
    const loader = promisifyLoader(
      new type.loader(loadingManager) /*,  onProgress */
    )
    loadingManager.addHandler(type.regexp, loader)
    return loader
  })

  function load(toLoad) {
    let appropriateLoader = null
    if (typeof toLoad === "string") {
      appropriateLoader = loadingManager.getHandler(toLoad)
    } else if (typeof toLoad === "object") {
      if (!toLoad.type) {
        console.error(`Need a valid 'type' property on loaded object:`, toLoad)
      }
      // customLoaders.find(...)
    }

    if (appropriateLoader === null)
      console.error(`No appropriate Loader found for:`, toLoad)

    appropriateLoader
      .load(toLoad)
      .then((loaded) => console.log(loaded))
      .catch((err) => console.error(err))
  }

  return {
    load
  }
}

export default SmartLoader
