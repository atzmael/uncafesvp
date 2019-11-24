import * as THREE from "three"

import vertexShader from "../../glsl/animPlane.vert"
import fragmentShader from "../../glsl/animPlane.frag"
/**
 *
 */
const AnimPlane = (videoTexture) => {
  const animPlaneGeo = new THREE.PlaneBufferGeometry(4, 4, 1)
  // const animPlaneMat = new THREE.MeshBasicMaterial({ map: videoTexture })
  const animPlaneMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      myTexture: { value: videoTexture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.NormalBlending,
    transparent: true
  })
  const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
  animPlane.renderOrder = 999
  animPlane.material.depthTest = false

  const play = () => {
    if (videoTexture.image && videoTexture.image.play) videoTexture.image.play()
    else console.error(`Cannot play videoTexture.image`, videoTexture)
  }

  return Object.assign(animPlane, {
    play
  })
}

export default AnimPlane
