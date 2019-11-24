import * as THREE from "three"
import GLTFLoader from "three-gltf-loader"

import promisifyLoader from "./promisifyLoader.js"
import ModelLoader from "./ModelLoader.js"

/**
 * This aims to be an async LoadingManager, with added functionnality
 */
const SmartLoader = () => {
  let isLoaded = false
  let loadingPercentage = 0

  const promises = []
  const loadedData = {}

  // TODO: maybe loadingManager is not necessary anymore :
  // onComplete is in Promise.all...then()
  // onProgress is passed through the promisifyLoader() function
  // onError is in Promise.all...catch()
  const loadingManager = new THREE.LoadingManager(
    //onLoaded for all loaders
    () => (isLoaded = true),
    //onProgress for all loaders
    (toLoad, loadedQtty, totalToLoad) => {
      loadingPercentage = (loadedQtty / totalToLoad) * 100
    },
    //onError for all loaders
    undefined
  )

  const onProgress = (xhr) => {
    loadingPercentage = Math.round((xhr.loaded / xhr.total) * 100)
    console.log(`${loadingPercentage}%`)
  }

  const decorateLoader = (loader, loaderType = "constructor") => {
    if (loaderType === "constructor") {
      return promisifyLoader(new loader(loadingManager), onProgress)
    } else if (loaderType === "factory") {
      return promisifyLoader(loader(loadingManager), onProgress)
    }
  }

  // Object
  const basicLoaders = {
    texture: {
      loader: decorateLoader(THREE.TextureLoader),
      regexp: /\.(tga|png|jpg|jpeg)$/i
    },
    gltf: {
      loader: decorateLoader(GLTFLoader),
      regexp: /\.(gltf|glb)$/i
    }
  }

  // Object
  const customLoaders = {
    model: decorateLoader(ModelLoader, "factory")
  }

  /**
   * @param {String|Object} toLoad Path of asset to load, or object a type and additional infos
   * @param {String} name Name of the loaded asset/object in loadedData
   */
  function load(toLoad, name) {
    let appropriateLoader = null
    let matchingType = null
    if (typeof toLoad === "string") {
      // TODO: logic to determine 'type' variable
      Object.entries(basicLoaders).forEach(([type, { loader, regexp }]) => {
        if (toLoad.match(regexp)) {
          matchingType = `${type}`
          appropriateLoader = loader
        }
      })
    } else if (typeof toLoad === "object") {
      if (!toLoad.type) {
        console.error(`Need a valid 'type' property on loaded object:`, toLoad)
      }
      Object.entries(customLoaders).forEach(([type, loader]) => {
        if (toLoad.type === type) {
          appropriateLoader = loader
          matchingType = `${type}`
        }
      })
    }

    if (appropriateLoader == null)
      console.error(`No appropriate Loader found for:`, toLoad)
    else {
      const promise = appropriateLoader
        .load(toLoad)
        .then((loaded) => {
          loadedData[`${matchingType}s`] = []
          loadedData[`${matchingType}s`].push(Object.assign(loaded, { name }))
        })
        .catch((err) => console.error(err))

      promises.push(promise)
    }
  }

  /**
   * @param {function} callback called when all promises are resolved (all assets are loaded)
   */
  const onComplete = (callback) => {
    // console.log("promises : ", promises)
    Promise.all(promises)
      .then(() => {
        callback(loadedData)
      })
      .catch((error) => {
        console.error("A promise has failed:", error)
      })
  }

  return {
    load,
    // isLoaded,
    // loadingPercentage,
    // onProgress,
    onComplete
  }
}

export default SmartLoader
