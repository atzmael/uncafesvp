import * as THREE from "three"

import frontVertexShader from "../../glsl/animPlane.vert"
import bgVertexShader from "../../glsl/bgPlane.vert"
import frontFragmentShader from "../../glsl/animPlane.frag"
import bgFragmentShader from "../../glsl/bgPlane.frag"

const AnimPlane = ({
    videoTexture,
    hexColor1 = 0xff00ff,
    hexColor2 = 0xffff00,
    hexColor3 = 0xee99ff,
    isFront = true
}) => {
    const scale = isFront ? 4 : 1
    const animPlaneGeo = new THREE.PlaneBufferGeometry(scale, scale, 1)

    const animPlaneMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            animTexture: { value: videoTexture },
            col1: { value: new THREE.Color(hexColor1) },
            col2: { value: new THREE.Color(hexColor2) },
            col3: { value: new THREE.Color(hexColor3) }
        },
        vertexShader: isFront ? frontVertexShader : bgVertexShader,
        fragmentShader: isFront ? frontFragmentShader : bgFragmentShader,
        blending: THREE.NormalBlending,
        transparent: isFront ? true : false
    })
    const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
    animPlane.renderOrder = isFront ? 9999 : -1
    animPlane.material.depthTest = isFront ? false : true
    animPlane.position.z = isFront ? 0 : -5

    const play = () => {
        if (videoTexture.image && videoTexture.image.play) videoTexture.image.play()
        else console.error(`Cannot play videoTexture.image`, videoTexture)
    }

    return Object.assign(animPlane, {
        play,
        hexColor1,
        hexColor2,
        hexColor3
    })
}

export default AnimPlane
