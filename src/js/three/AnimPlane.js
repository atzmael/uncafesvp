import * as THREE from "three"
/**
 *
 */
const AnimPlane = (videoTexture) => {
  const animPlaneGeo = new THREE.PlaneBufferGeometry(4, 4, 1)
  const animPlaneMat = new THREE.MeshBasicMaterial({ map: videoTexture })
  const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)

  const play = () => {
    videoTexture.image.play()
  }

  return Object.assign(animPlane, {
    play
  })
}

export default AnimPlane
