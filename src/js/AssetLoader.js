import GLTFLoader from "three-gltf-loader"
import * as THREE from "three"

const AssetsLoader = () => {
    const assets = {}
    const promises = []
    const gltfLoader = new GLTFLoader()
    const textureLoader = new THREE.TextureLoader()

    const load = (path, ref, childArr) => {
        if (!path || !ref) {
            throw "Trying to load an asset, but missing arguments"
        }
        const extension = path.substr(path.indexOf("."))
        // console.log("chemin : ", path)
        if (extension === ".gltf" || extension === ".glb") {
            promises.push(loadGLTF(path, ref, childArr))
        } else if (extension === ".png" || extension === ".jpg") {
            promises.push(loadTexture(path, ref))
        }
    }

    const loadGLTF = (path, ref, childArr = ["scene"]) => {
        return new Promise((resolve, reject) => {
            gltfLoader.load(
                path,
                (gltf) => {
                    let object = gltf
                    childArr.forEach((child, index) => {
                        object = object[child]
                    })
                    assets[ref] = object
                    resolve()
                },
                (xhr) =>
                    console.log(`${ref}: ${(xhr.loaded / xhr.total) * 100}% loaded`),
                (err) => reject(`Failed to load GLTF with path ${path}`)
            )
        })
    }

    const loadTexture = (path, ref) => {
        return new Promise((resolve, reject) => {
            textureLoader.load(
                path,
                (t) => {
                    assets[ref] = t
                    resolve()
                },
                undefined, // onProgress callback currently not supported
                (err) => {
                    reject(`Failed to load texture with path '${path}'`)
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
