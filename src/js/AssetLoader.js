import GLTFLoader from "three-gltf-loader"
import * as THREE from "three"

const AssetsLoader = () => {
    const assets = {}
    const promises = []
    const gltfLoader = new GLTFLoader()
    const textureLoader = new THREE.TextureLoader()

    const load = (path, ref, childArr) => {
        const extension = path.substr(path.indexOf("."))
        // console.log("chemin : ", path)
        if (extension === ".gltf" || extension === ".glb") {
            promises.push(loadGLTF(path, ref, childArr))
        } else if (extension === ".png" || extension === ".jpg") {
            promises.push(loadTexture(path, ref))
        }
    }

    const loadGLTF = (path, ref, childArr) => {
        return new Promise((resolve, reject) => {
            if (path && ref) {
                gltfLoader.load(path, (gltf) => {
                    if (childArr) {
                        let object = gltf
                        childArr.forEach((child, index) => {
                            object = object[child]
                        })
                        assets[ref] = object
                    } else {
                        assets[ref] = gltf
                    }
                    // console.log("resolved:", ref)
                    resolve()
                })
            } else {
                reject("Can't load GLTF")
            }
        })
    }

    const loadTexture = (path, ref) => {
        if (!path || !ref) {
            throw "Trying to load a texture with missing arguments"
        }
        return new Promise((resolve, reject) => {
            const texture = textureLoader.load(
                path,
                (t) => {
                    assets[ref] = t
                    resolve()
                },
                undefined, // onProgress callback currently not supported
                (err) => {
                    reject(`Can't load texture with path '${path}'`)
                }
            )
        })
    }

    const onComplete = (callback) => {
        // console.log("promises : ", promises)
        Promise.all(promises)
            .then(() => {
                callback(assets)
            })
            .catch((error) => {
                console.error("A promise has failed : ", error)
            })
    }

    return {
        load,
        onComplete
    }
}
export default AssetsLoader
