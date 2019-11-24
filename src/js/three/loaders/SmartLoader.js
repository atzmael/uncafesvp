import * as THREE from "three"

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

  function load(toLoad) {}

  return {
    load
  }
}

// function promisifyLoader(loader, onProgress) {
//   function promiseLoader(url) {
//     return new Promise((resolve, reject) => {
//       loader.load(url, resolve, onProgress, reject)
//     })
//   }

//   return {
//     originalLoader: loader,
//     load: promiseLoader
//   }
// }
