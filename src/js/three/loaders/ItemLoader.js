import * as THREE from 'three'
import ModelLoader from './ModelLoader.js'
import VideoTextureLoader from './videoTextureLoader.js'
import promisifyLoader from './promisifyLoader.js'

// TODO: replace ItemLoad and ModelLoader by a single function
// (to load an object, using regexp on properties to check for "path" (modelPath, animPath, etc.))
// and use loaders accordingly
const ItemLoader = (manager) => {
    const load = (itemToLoad, onLoad, onProgress, onError) => {
        const promises = []

        const { modelPath, animPath, soundPath } = itemToLoad
        const modelLoader = promisifyLoader(ModelLoader(manager), onProgress)
        const videoTextureLoader = promisifyLoader(new VideoTextureLoader(manager))
        const soundLoader = promisifyLoader(
            new THREE.AudioLoader(manager),
            onProgress
        )

        const modelPromise = modelLoader
            .load({ type: 'model', path: modelPath })
            .then((model) => {
                Object.assign(itemToLoad, { model })
            })
            .catch((err) => console.error(err))

        const videoTexturePromise = videoTextureLoader
            .load(animPath)
            .then((videoTexture) => {
                Object.assign(itemToLoad, { videoTexture })
            })
            .catch((err) => console.error(err))

        const soundPromise = soundLoader
            .load(soundPath)
            .then((sound) => {
                Object.assign(itemToLoad, { sound })
            })
            .catch((err) => console.error(err))

        promises.push(modelPromise)
        promises.push(videoTexturePromise)
        promises.push(soundPromise)

        Promise.all(promises)
            .then(() => {
                onLoad(itemToLoad)
            })
            .catch((err) => {
                onError(err)
                console.error('An item has failed to load:', itemToLoad, error)
            })
    }

    return Object.assign(new THREE.Loader(manager), {
        load
    })
}

export default ItemLoader
