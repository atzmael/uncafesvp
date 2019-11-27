import * as THREE from "three"

import vertexShader from "../../glsl/bgPlane.vert"
import fragmentShader from "../../glsl/bgPlane.frag"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 */

const BgPlane = (bgTexture) => {
    bgTexture.wrapS = THREE.RepeatWrapping
    bgTexture.wrapT = THREE.RepeatWrapping

    let hexColor1 = 0x000000
    let hexColor2 = 0x00ff00
    let hexColor3 = 0xff00ff

    const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
    const planeMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            bgTexture: { value: bgTexture },
            animTexture: { value: null },
            col1: { value: new THREE.Color(hexColor1) },
            col2: { value: new THREE.Color(hexColor2) },
            col3: { value: new THREE.Color(hexColor3) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    const playAnimTexture = (
        videoTexture,
        newCol1 = hexColor1,
        newCol2 = hexColor2,
        newCol3 = hexColor3
    ) => {
        // TODO: crossfades
        console.log(hexColor1, hexColor2, hexColor3)
        planeMat.uniforms.animTexture.value = videoTexture
        planeMat.uniforms.animTexture.col1 = newCol1
        planeMat.uniforms.animTexture.col2 = newCol2
        planeMat.uniforms.animTexture.col3 = newCol3
        videoTexture.image.play()
    }

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
        playAnimTexture,
        onCanvasResize,
        update
    }
}

export default BgPlane
