import * as THREE from "three"
import promisifyLoader from "./promisifyLoader.js"
import GLTFLoader from "three-gltf-loader"
import ModelLoader from "./ModelLoader.js"
import VideoTextureLoader from "./VideoTextureLoader.js"

/**
 * This aims to be an async LoadingManager, with added functionnality
 */
const SmartLoader = (onProgress) => {
    const promises = []
    const loadedData = {}

    const loadingManager = new THREE.LoadingManager(
        undefined, //onLoad
        onProgress,
        undefined //onError
    )

    const defaultOnProgress = (xhr) => {
        const percentage = Math.round((xhr.loaded / xhr.total) * 100)
        // console.log(`${percentage}%`)
        console.log("defaultOnProgress")
    }

    const decorateLoader = (loader, instantiatingAs = "constructor") => {
        if (instantiatingAs === "constructor") {
            return promisifyLoader(new loader(loadingManager))
        } else if (instantiatingAs === "factory") {
            return promisifyLoader(loader(loadingManager))
        }
    }

    // Object
    const loaders = {
        texture: {
            loader: decorateLoader(THREE.TextureLoader),
            regexp: /\.(tga|png|jpg|jpeg)$/i
        },
        gltf: {
            loader: decorateLoader(GLTFLoader),
            regexp: /\.(gltf|glb)$/i
        },
        model: {
            loader: decorateLoader(ModelLoader, "factory"),
            regexp: /model.(gltf|glb)$/i
        },
        videoTexture: {
            loader: decorateLoader(VideoTextureLoader),
            regexp: /\.mp4$/i
        },
        sound: {
            loader: decorateLoader(THREE.AudioLoader),
            regexp: /\.(mp3|wav)$/i
        }
    }

    const defineLoaderFromStr = (path) => {
        let appropriateLoader = null
        Object.values(loaders).find(({ loader, regexp }) => {
            if (path.match(regexp)) appropriateLoader = loader
        })
        if (appropriateLoader == null) {
            console.error(`No appropriate Loader found for:`, path)
        }
        return appropriateLoader
    }

    const defineTypeFromStr = (path) => {
        let matchingType = null
        Object.entries(loaders).forEach(([type, { loader, regexp }]) => {
            if (path.match(regexp)) matchingType = `${type}`
        })
        if (matchingType == null) {
            console.error(`No appropriate Loader found for:`, path)
        }
        return matchingType
    }

    /**
     * @param {String|Object} toLoad Path of asset to load, or object a type and additional infos
     * @param {String} name Name of the loaded asset/object in loadedData
     */
    function load(toLoad, name) {
        /** @param {string} path  */
        const loadFromString = (
            path,
            parentObject = loadedData,
            propName = undefined
        ) => {
            const promise = defineLoaderFromStr(path)
                .load(path)
                .then((loaded) => {
                    const type = defineTypeFromStr(path)
                    if (!parentObject.hasOwnProperty(`${type}s`)) {
                        parentObject[`${type}s`] = []
                    }
                    parentObject[`${type}s`].push(
                        Object.assign(loaded, {
                            name: propName
                                ? `${name +
                                      propName.charAt(0).toUpperCase() +
                                      propName.slice(1)}`
                                : `${name +
                                      type.charAt(0).toUpperCase() +
                                      type.slice(1)}`
                        })
                    )
                })
                .catch((err) => console.error(err))
            promises.push(promise)
        }

        if (typeof toLoad === "string") {
            loadFromString(toLoad)
        } else if (typeof toLoad === "object") {
            const objectToLoad = toLoad
            if (!objectToLoad.type)
                throw `The loaded object needs a property 'type' (string)`
            Object.entries(objectToLoad).forEach(([key, value]) => {
                if (key.match(/\path$/i)) {
                    loadFromString(value, objectToLoad, key)
                }
            })
            if (!loadedData.hasOwnProperty(`${objectToLoad.type}s`)) {
                loadedData[`${objectToLoad.type}s`] = []
            }
            loadedData[`${objectToLoad.type}s`].push(
                Object.assign(objectToLoad, { name })
            )
        }
    }

    /**
     @param {function} callback called when all promises are resolved (all assets are loaded)
     */
    const onComplete = (callback) => {
        // TODO: remove settimeouts and Fix async issue
        setTimeout(() => {
            Promise.all(promises)
                .then(() => {
                    callback(loadedData)
                })
                .catch((error) => {
                    console.error("A promise has failed:", error)
                })
        }, 500)
    }

    return {
        load,
        onComplete
    }
}

export default SmartLoader
