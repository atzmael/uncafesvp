import * as THREE from "three"

import vertexShader from "../../glsl/bgPlane.vert"
import fragmentShader from "../../glsl/bgPlane.frag"
import { text } from "svelte/internal"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 */

const BgPlane = (texture) => {
    // texture.wrapS = THREE.RepeatWrapping
    // texture.wrapT = THREE.RepeatWrapping
    console.log(texture)

    const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
    const planeMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            myTexture: { value: texture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    const play = () => {
        if (texture.image && texture.image.play) texture.image.play()
        else console.error(`Cannot play texture.image`, texture)
    }

    const onCanvasResize = (camera) => {
        planeMesh.scale.y = Math.max(1, window.innerWidth / window.innerHeight)
        planeMesh.scale.x = Math.max(1, window.innerHeight / window.innerWidth)
        // planeMesh.scale.x *= biggestSide / smallestSide
        // TODO: planeMat.uniforms.aspectRatio.value = camera.aspect
    }

    const update = (time) => {
        planeMat.uniforms.time.value = time
    }

    const planeMesh = new THREE.Mesh(planeGeo, planeMat)

    planeMesh.name = "bgPlane" // needed for GUI
    planeMesh.renderOrder = -1
    planeMesh.material.depthTest = false
    onCanvasResize()

    return {
        play,
        mesh: planeMesh,
        // setTexture,
        onCanvasResize,
        update
    }
}

export default BgPlane
