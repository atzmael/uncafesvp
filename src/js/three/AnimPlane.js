import * as THREE from 'three'

import vertexShader from '../../glsl/animPlane.vert'
import fragmentShader from '../../glsl/animPlane.frag'
/**
 *
 */
const AnimPlane = (videoTexture, hexColor1, hexColor2, hexColor3) => {
    const animPlaneGeo = new THREE.PlaneBufferGeometry(4, 4, 1)
    // const animPlaneMat = new THREE.MeshBasicMaterial({ map: videoTexture })

    hexColor1 = 0xff00ff
    hexColor2 = 0xffff00
    hexColor3 = 0xee99ff

    const animPlaneMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            myTexture: { value: videoTexture },
            col1: { value: new THREE.Color(hexColor1) },
            col2: { value: new THREE.Color(hexColor2) },
            col3: { value: new THREE.Color(hexColor3) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.NormalBlending,
        transparent: true
    })
    const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
    animPlane.renderOrder = 9999
    animPlane.material.depthTest = false

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
