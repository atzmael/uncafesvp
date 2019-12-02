import * as THREE from "three"

import frontVertexShader from "../../glsl/animPlane.vert"
import frontFragmentShader from "../../glsl/animPlane.frag"

const AnimPlane = ({
    videoTexture,
    hexColor1 = 0xff00ff,
    hexColor2 = 0xffff00,
    hexColor3 = 0xee99ff
}) => {
    const scale = 4
    const animPlaneGeo = new THREE.PlaneBufferGeometry(scale, scale, 1)

    const animPlaneMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            animTexture: { value: videoTexture },
            col1: { value: new THREE.Color(hexColor1) },
            col2: { value: new THREE.Color(hexColor2) },
            col3: { value: new THREE.Color(hexColor3) }
        },
        vertexShader: frontVertexShader,
        fragmentShader: frontFragmentShader,
        blending: THREE.NormalBlending,
        transparent: true
    })
    const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
    animPlane.renderOrder = 9999
    animPlane.material.depthTest = false

    videoTexture.image.loop = true;

    console.log(videoTexture);

    const play = (offset = 0) => {
        if (videoTexture.image && videoTexture.image.play) {
            console.log(videoTexture, videoTexture.image);
            videoTexture.image.currentTime = offset;
            videoTexture.image.play();
        } else {
            console.error(`Cannot play videoTexture.image`, videoTexture)
        }
    }

    const stop = () => {
        // TODO: decrease opacity to hide it before pausing
        videoTexture.image.pause();
    }

    return Object.assign(animPlane, {
        play,
        stop,
        hexColor1,
        hexColor2,
        hexColor3
    })
}

export default AnimPlane
