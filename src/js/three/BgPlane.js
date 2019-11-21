import * as THREE from "three"

import vertexShader from "../../glsl/bgPlane.vert"
import fragmentShader from "../../glsl/bgPlane.frag"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 */

const BgPlane = () => {
  const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      myTexture: { value: null }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  /**
   * @param {THREE.Texture} texture
   */
  const setTexture = (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    planeMat.uniforms.myTexture.value = texture
  }

  const onCanvasResize = (camera) => {
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
    setTexture,
    onCanvasResize,
    update
  }
}

export default BgPlane
