import GLTFLoader from "three-gltf-loader"
import * as THREE from "three"

const AssetsLoader = () => {
  const assets = []
  const promises = []
  const gltfLoader = new GLTFLoader()
  const textureLoader = new THREE.TextureLoader()
  const audioListener = new THREE.AudioListener()

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
    } else if (extension === ".mp3") {
      promises.push(loadSound(path, name))
    }
  }

  /**
   * This resolves an object instanceof THREE.Object3D, with added properties .name
   * @param {string} path of the wanted file, from a static folder (ex: dist)
   * @param {string} name of the asset that will be added into the returned object as a property
   * @param {string[]} [childArr] optional : search in gltf structure and return it
   *                              -> ["scene"] would return the scene
   *                              -> ["camera", "0"] would return the first camera
   *                              -> ["scene", "children", "0"] would return the first child of the scene
   */
  const loadGLTF = (path, name, childArr) => {
    // ↓↓↓ returnGltfAsObject3D is used ONLY if childArr is null
    // (it returns the gltf.scene.children as a single Object3D (Group or the only child as it is (could be Mesh or other maybe)))
    function returnGltfAsObject3D(gltf) {
      if (
        !(gltf.scene && gltf.scene.children && gltf.scene.children.length > 0)
      ) {
        throw `gltf has no child inside "scene", or a wrong structure`
      } else {
        if (gltf.scene.children.length == 1) {
          return gltf.scene.children[0]
        } else if (gltf.scene.children.length > 1) {
          const group = new THREE.Group()
          for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
            group.add(gltf.scene.children[i])
          }
          return group
        }
      }
    }

    return new Promise((resolve, reject) => {
      gltfLoader.load(
        path,
        // onLoaded
        gltf => {
          if (childArr) {
            // this loop searches through the gltf structure and returns the last thing of the childArr
            childArr.forEach((child, index) => {
              if (gltf[child] == undefined)
                throw `Could not find "${child}" in gltf structure`
              gltf = gltf[child]
            })
          } else {
            gltf = returnGltfAsObject3D(gltf)
          }

          if (!(gltf instanceof THREE.Object3D))
            throw `The gltf to be resolved is not an instanceof THREE.Object3D`

          const addedParams = { name }
          const gltfAsset = Object.assign(gltf, addedParams)
          assets.push(gltfAsset)
          resolve()
        },
        // onProgress
        xhr => console.log(`${name}: ${(xhr.loaded / xhr.total) * 100}%`),
        // onError
        err => reject(`Failed to load GLTF with path ${path} : \n ${err}`)
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
        texture => {
          const addedParams = { name }
          const textureAsset = Object.assign(texture, addedParams)
          assets.push(textureAsset)
          resolve()
        },
        // onProgress callback currently not supported
        undefined,
        // onError
        err => reject(`Failed to load texture with path '${path} :\n${err}'`)
      )
    })
  }

  // TODO: (?) const loadVideoTexture = (path, name) => {} ???

  // TODO: work on sound loader
  const loadSound = (path, name) => {
    return new Promise((resolve, reject) => {
      let sound = new THREE.Audio(audioListener)
      let audioLoader = new THREE.AudioLoader()
      audioLoader.load(
        // resource URL
        path,
        // onLoad callback (when load is completed)
        audioBuffer => {
          // set the audio object buffer to the loaded objectsound
          sound.setBuffer(audioBuffer)

          const addedParams = { name }
          const soundAsset = Object.assign(sound, addedParams)
          assets.push(soundAsset)
          resolve()
        },
        // onProgress callback
        xhr => console.log(`${name}: ${(xhr.loaded / xhr.total) * 100}%`),
        // onError callback
        err => reject(`Failed to load sound with path '${path} :\n${err}'`)
      )
    })
  }

  /**
   * @param {function} callback called when all promises are resolved (all assets are loaded)
   */
  const onComplete = callback => {
    // console.log("promises : ", promises)
    Promise.all(promises)
      .then(() => {
        callback(assets)
      })
      .catch(error => {
        console.error("A promise has failed : ", error)
      })
  }

  return {
    load,
    onComplete
  }
}
export default AssetsLoader
