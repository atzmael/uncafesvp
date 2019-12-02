import * as THREE from "three"

import vertexShader from "../../glsl/bgPlane.vert"
import fragmentShader from "../../glsl/bgPlane.frag"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 */

const BgPlane = ({ bgTextures, noiseTexture }) => {
    const textures = [...bgTextures, noiseTexture]
    textures.forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    })

    const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
    const planeMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            bgTextures: { value: bgTextures },
            noiseTexture: { value: noiseTexture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    const onCanvasResize = (camera) => {
        planeMesh.scale.y = Math.min(1, window.innerWidth / window.innerHeight)
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
        mesh: planeMesh,
        onCanvasResize,
        update
    }
}

export default BgPlane
