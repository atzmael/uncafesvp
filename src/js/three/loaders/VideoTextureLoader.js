/*
 heavily based on THREE.TextureLoader
*/

import VideoLoader from './VideoLoader.js'
import promisifyLoader from './promisifyLoader.js'
import * as THREE from 'three'

function VideoTextureLoader(manager) {
    THREE.Loader.call(this, manager)
}

VideoTextureLoader.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
    constructor: VideoTextureLoader,

    load: function(url, onLoad, onProgress, onError) {
        let videoTexture

        const loader = promisifyLoader(new VideoLoader(this.manager))

        loader.originalLoader.setCrossOrigin(this.crossOrigin)
        loader.originalLoader.setPath(this.path)

        loader
            .load(url)
            .then((video) => {
                videoTexture = new THREE.VideoTexture(video)
                if (onLoad !== undefined) {
                    onLoad(videoTexture)
                }
            })
            .catch((err) => {
                onError(err)
                console.error(`Could not load model from:`, url)
            })

        // return videoTexture
    }
})

export default VideoTextureLoader
