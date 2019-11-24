import * as THREE from "three"
import GLTFLoader from "three-gltf-loader"

import promisifyLoader from "./promisifyLoader.js"
import ModelLoader from "./ModelLoader.js"

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

  // Object
  const basicLoaderTypes = {
    texture: { loader: THREE.TextureLoader, regexp: /\.(tga|png|jpg|jpeg)$/i },
    gltf: { loader: GLTFLoader, regexp: /\.(gltf|glb)$/i }
  }

  // Unused Array creation with side-effect :
  // add to loadinManager handlers (to check later in 'load' function with getHandler)
  const basicLoaders = Object.values(basicLoaderTypes).forEach((type) => {
    const loader = promisifyLoader(
      new type.loader(loadingManager) /*,  onProgress */
    )
    loadingManager.addHandler(type.regexp, loader)
    return loader
  })

  // Object
  const customLoaders = {
    model: promisifyLoader(ModelLoader(loadingManager))
  }

  /**
   * @param {String|Object} toLoad Path of asset to load, or object a type and additional infos
   * @param {String} name Name of the loaded asset/object in loadedData
   */
  function load(toLoad, name) {
    let appropriateLoader = null
    if (typeof toLoad === "string") {
      appropriateLoader = loadingManager.getHandler(toLoad)
      // TODO: logic to determine 'type' variable
    } else if (typeof toLoad === "object") {
      if (!toLoad.type) {
        console.error(`Need a valid 'type' property on loaded object:`, toLoad)
      }
      Object.entries(customLoaders).forEach(([type, loader]) => {
        if (toLoad.type === type) appropriateLoader = loader
      })
    }

    if (appropriateLoader === null)
      console.error(`No appropriate Loader found for:`, toLoad)

    appropriateLoader
      .load(toLoad)
      .then((loaded) => {
        console.log(name, loaded)
        // loadedData[type].push(Object.assign(loaded, { name}))
      })
      .catch((err) => console.error(err))
  }

  return {
    load
  }
}

export default SmartLoader
