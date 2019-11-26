import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import EventsEmitter from "./EventsEmitter"
import AssetsInfos from "../../../datas/assets.json"

export default class Loader extends EventsEmitter {
  /**
   * Constructor
   */
  constructor() {
    super()

    this.resources = {
      models: {},
      textures: {}
    }

    // Set up
    this.load()
  }

  load() {
    AssetsInfos.forEach((asset) => {
      if (asset.type === "texture") {
        // Loading a texture
        const loader = new THREE.TextureLoader()

        // load a resource
        loader.load(
          // resource URL
          "./static/" + asset.source,

          (texture) => {
            this.resources.textures[asset.name] = texture
          },

          // onError callback
          (err) => {
            console.error("An error happened", err)
          }
        )
      } else if (asset.type === "model" || asset.type === undefined) {
        // Loading a model
        const loader = new GLTFLoader()

        // Load a glTF resource
        loader.load(
          // resource URL
          "./static/" + asset.source,
          // called when the resource is loaded
          (gltf) => {
            this.resources.models[asset.name] = gltf.scene

            console.log("___ LOADED RESOURCES ___", this.resources)
            this.trigger("loaded", this.resources)
          },
          // called while loading is progressing
          (xhr) => {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
          },
          // called when loading has errors
          (err) => {
            console.error("An error happened", err)
          }
        )
      }
    })
  }
}
