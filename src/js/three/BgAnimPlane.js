import * as THREE from "three"

import bgVertexShader from "../../glsl/bgPlane.vert"
import bgFragmentShader from "../../glsl/bgPlane.frag"

const BgAnimPlane = ({ videoTexture }) => {
    const animPlaneGeo = new THREE.PlaneBufferGeometry(1, 1, 1)

    const animPlaneMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            animTexture: { value: videoTexture }
        },
        vertexShader: bgVertexShader,
        fragmentShader: bgFragmentShader,
        blending: THREE.NormalBlending,
        transparent: true,
        opacity: 0
    })
    const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
    animPlane.renderOrder = -1
    animPlane.material.depthTest = false

    const play = () => {
        if (videoTexture.image && videoTexture.image.play) videoTexture.image.play()
        else console.error(`Cannot play videoTexture.image`, videoTexture)
    }

    return Object.assign(animPlane, {
        play
    })
}

export default BgAnimPlane
