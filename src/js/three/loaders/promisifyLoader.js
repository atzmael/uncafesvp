/**
 * Based on function made by Lewy Blue
 * https://blackthread.io/blog/promisifying-threejs-loaders/
 * @param {THREE.Loader} loader
 * @param {Function} onProgress
 */
const pendings = {}
export default function promisifyLoader(loader, onProgress = undefined) {
    function promiseLoad(toLoad) {
        if (pendings[toLoad]) return pendings[toLoad]
        return (pendings[toLoad] = new Promise((resolve, reject) => {
            loader.load(
                toLoad,
                (a) => {
                    // console.log(toLoad)
                    resolve(a)
                },
                onProgress,
                reject
            )
        }))
    }
    return {
        originalLoader: loader,
        load: promiseLoad
    }
    // return Object.assign(loader, {
    //   load: promiseLoad
    // })
}
