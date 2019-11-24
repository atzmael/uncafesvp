/*
 heavily based on THREE.TextureLoader
*/

import VideoLoader from "./VideoLoader.js"
import * as THREE from "three"

function VideoTextureLoader(manager) {
  THREE.Loader.call(this, manager)
}

VideoTextureLoader.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
  constructor: VideoTextureLoader,

  load: function(url, onLoad, onError) {
    let videoTexture

    const loader = new VideoLoader(this.manager)

    loader.setCrossOrigin(this.crossOrigin)
    loader.setPath(this.path)

    loader.load(
      url,
      (video) => {
        videoTexture = new THREE.VideoTexture(video)
        if (onLoad !== undefined) {
          onLoad(videoTexture)
        }
      },
      onError
    )

    return videoTexture
  }
})

export default VideoTextureLoader
