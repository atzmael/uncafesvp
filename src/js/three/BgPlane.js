import * as THREE from "three"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"

import basicVertexShader from "../../glsl/basicVertexShader.glsl"
import basicFragmentShader from "../../glsl/basicFragmentShader.glsl"
import onWindowResize from "../onWindowResize.js"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 * positionned on its "far" plane
 */

const BgPlane = (activeCamera) => {
    const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
    const planeMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: basicVertexShader,
        fragmentShader: basicFragmentShader
    })

    // TODO:OPTIMIZE: do NOT add to camera
    // (not good to position in 3D space and recalculate 3D stuff,
    // when we could just remove projection and view matrices from vertexshader)
    // This implies to find a way to change renderOrder (or other parameter to draw BEHIND 3D scene?)

    const scaleToFitCanvas = () => {
        const planeHeight =
            visibleHeightAtZDepth(activeCamera.far, activeCamera) * 0.5
        const planeWidth = planeHeight * activeCamera.aspect
        planeMesh.scale.set(planeWidth, planeHeight, 1)
    }

    const planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.name = "testPlane"
    planeMesh.position.z = -(activeCamera.far * 0.99999)
    scaleToFitCanvas()

    const update = () => {
        // planeMat.uniforms.time.value = Date.now()
    }

    onWindowResize(() => {
        scaleToFitCanvas()
    })

    return {
        mesh: planeMesh,
        update
    }
}

export default BgPlane
