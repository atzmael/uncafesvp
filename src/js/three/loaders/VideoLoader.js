/*
 heavily based on THREE.ImageLoader
*/
import { Loader, Cache } from 'three'

function VideoLoader(manager) {
    Loader.call(this, manager)
}

VideoLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: VideoLoader,

    load: function(url, onLoad, onProgress, onError) {
        if (this.path !== undefined) url = this.path + url

        url = this.manager.resolveURL(url)
        var scope = this
        var cached = Cache.get(url)

        if (cached !== undefined) {
            scope.manager.itemStart(url)

            setTimeout(function() {
                if (onLoad) onLoad(cached)
                scope.manager.itemEnd(url)
            }, 0)

            return cached
        }

        // TODO: actually use these different extensions and sources
        const extensions = ['mp4']

        const video = document.createElement('video')

        // TODO: set options for video (loop, etc.) ???

        const sources = extensions.map(() => {
            const source = document.createElement('source')
            video.appendChild(source)
            return source
        })

        function onVideoLoad() {
            video.removeEventListener('canplaythrough', onVideoLoad, false)
            video.removeEventListener('error', onVideoError, false)

            Cache.add(url, this)

            if (onLoad) onLoad(this)

            scope.manager.itemEnd(url)
        }

        function onVideoError(event) {
            video.removeEventListener('canplaythrough', onVideoLoad, false)
            video.removeEventListener('error', onVideoError, false)
            sources.forEach((s) =>
                s.removeEventListener('error', onVideoError, false)
            )

            if (onError) onError(event)

            scope.manager.itemError(url)
            scope.manager.itemEnd(url)
        }

        video.addEventListener('canplaythrough', onVideoLoad, false)
        video.addEventListener('error', onVideoError, false)
        sources.forEach((s) => s.addEventListener('error', onVideoError, false))

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) video.crossOrigin = this.crossOrigin
        }

        scope.manager.itemStart(url)

        sources.forEach((sourceEl) => (sourceEl.src = url))

        return video
    }
})

export default VideoLoader
