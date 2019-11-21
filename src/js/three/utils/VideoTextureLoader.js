/*
 heavily based on THREE.TextureLoader
*/

import { Loader } from "three"
import VideoLoader from "./VideoLoader.js"
import { VideoTexture } from "three"

function VideoTextureLoader(manager) {
  Loader.call(this, manager)
}

VideoTextureLoader.prototype = Object.assign(Object.create(Loader.prototype), {
  constructor: VideoTextureLoader,

  load: function(url, onLoad, onError) {
    let videoTexture

    const loader = new VideoLoader(this.manager)

    loader.setCrossOrigin(this.crossOrigin)
    loader.setPath(this.path)

    loader.load(
      url,
      (video) => {
        videoTexture = new VideoTexture(video)
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
