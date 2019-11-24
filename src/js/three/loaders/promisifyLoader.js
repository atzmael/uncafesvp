/**
 * Based on function made by Lewy Blue
 * https://blackthread.io/blog/promisifying-threejs-loaders/
 * @param {THREE.Loader} loader
 * @param {Function} onProgress
 */

export default function promisifyLoader(loader, onProgress = undefined) {
  function promiseLoad(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, onProgress, reject)
    })
  }
  return {
    originalLoader: loader,
    load: promiseLoad
  }
  // return Object.assign(loader, {
  //   load: promiseLoad
  // })
}
