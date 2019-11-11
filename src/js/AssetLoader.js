import GLTFLoader from "three-gltf-loader"
import * as THREE from "three"

const AssetsLoader = () => {
  const assets = []
  const promises = []
  const gltfLoader = new GLTFLoader()
  const textureLoader = new THREE.TextureLoader()

  const load = (path, name, childArr) => {
    if (!path || !name) {
      throw "Trying to load an asset, but missing arguments"
    }
    const extension = path.substr(path.indexOf("."))
    // console.log("chemin : ", path)
    if (extension === ".gltf" || extension === ".glb") {
      promises.push(loadGLTF(path, name, childArr))
    } else if (extension === ".png" || extension === ".jpg") {
      promises.push(loadTexture(path, name))
    }
    // TODO: add sound loader
  }

  /**
   * This resolves an object instanceof THREE.Object3D, with added properties .name
   * @param {string} path of the wanted file, from a static folder (ex: dist)
   * @param {string} name of the asset that will be added into the returned object as a property
   * @param {string[]} childArr search in gltf structure and return it (ex: ["scene", "bleh"] would return bleh)
   */
  const loadGLTF = (path, name, childArr = ["scene"]) => {
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        path,
        // onLoaded
        (gltf) => {
          // this loop searches through the gltf structure and returns the last thing of the childArr
          childArr.forEach((child, index) => {
            if (gltf[child] == undefined)
              throw `Could not find "${child}" in gltf structure`
            gltf = gltf[child]
          })
          const addedParams = { name }
          const gltfAsset = Object.assign(gltf, addedParams)
          assets.push(gltfAsset)
          resolve()
        },
        // onProgress
        (xhr) => console.log(`${name}: ${(xhr.loaded / xhr.total) * 100}%`),
        // onError
        (err) => reject(`Failed to load GLTF with path ${path} : \n ${err}`)
      )
    })
  }

  /**
   * This resolves an object instanceof THREE.Texture, with added property .name
   * @param {string} path of the wanted file, from a static folder (ex: dist)
   * @param {string} name of the asset that will be added into the returned object as a property
   */
  const loadTexture = (path, name) => {
    return new Promise((resolve, reject) => {
      textureLoader.load(
        path,
        // onLoaded
        (texture) => {
          const addedParams = { name }
          const textureAsset = Object.assign(texture, addedParams)
          assets.push(textureAsset)
          resolve()
        },
        // onProgress callback currently not supported
        undefined,
        // onError
        (err) => {
          reject(`Failed to load texture with path '${path}'`)
        }
      )
    })
  }

  // TODO: add sound loader

  /**
   * @param {function} callback called when all promises are resolved (all assets are loaded)
   */
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
