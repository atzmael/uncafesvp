import * as THREE from "three"

import bgAnimVertexShader from "../../glsl/bgAnimPlane.vert"
import bgAnimFragmentShader from "../../glsl/bgAnimPlane.frag"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"

const BgAnimPlane = ({ videoTexture, camera, active, looping = true }) => {
    const animPlaneGeo = new THREE.PlaneBufferGeometry(0.5, 0.5, 1)

    const animPlaneMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            animTexture: { value: videoTexture },
            opacity: { value: 0.0 },
            uAlpha: {value: 0.0}
        },
        vertexShader: bgAnimVertexShader,
        fragmentShader: bgAnimFragmentShader,
        blending: THREE.NormalBlending,
        transparent: true,
        side: THREE.DoubleSide
    })
    const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
    animPlane.renderOrder = -1
    animPlane.material.depthTest = true
    animPlane.position.z = -10

    const onCanvasResize = (camera) => {
        const viewHeight = visibleHeightAtZDepth(animPlane.position.z, camera)
        animPlane.scale.x =
            Math.max(
                window.innerWidth / window.innerHeight,
                window.innerHeight / window.innerWidth
            ) * viewHeight
        animPlane.scale.y =
            Math.max(1, window.innerWidth / window.innerHeight) * viewHeight
    }
    onCanvasResize(camera)

    if(!active) {
        animPlane.visible = false
    }

    videoTexture.image.loop = looping;

    const play = () => {
        if (videoTexture.image && videoTexture.image.play) {
            videoTexture.image.play()
        } else {
            console.error(`Cannot play videoTexture.image`, videoTexture)
        }
    }

    const checkIfIsFocused = (isFocused = true) => {
        //TODO: don't modifiy renderOrder dynamically, use transparency instead
        animPlaneMat.uniforms.opacity.value = isFocused ? 1 : 0
    }

    return Object.assign(animPlane, {
        play,
        onCanvasResize,
        checkIfIsFocused
    })
}

export default BgAnimPlane
