import * as THREE from "three"
import { visibleWidthAtZDepth } from "./utils/visibleAtZDepth.js"

import basicVertexShader from "../../glsl/basicVertexShader.glsl"
import basicFragmentShader from "../../glsl/basicFragmentShader.glsl"

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

    const planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.name = "testPlane"
    planeMesh.position.z = -(activeCamera.far * 0.99999)
    const planeWidth = visibleWidthAtZDepth(activeCamera.far, activeCamera)
    planeMesh.scale.set(planeWidth, planeWidth * activeCamera.aspect, 1)
    activeCamera.add(planeMesh)

    // TODO: onCanvasResize() : re-scale / re-position the plane

    const update = () => {
        planeMat.uniforms.time.value = Date.now()
        // console.log(planeMat.uniforms.time.value)
    }

    return {
        planeMesh,
        update
    }
}

export default BgPlane
