export default function promisifyLoader(loader, onProgress) {
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
