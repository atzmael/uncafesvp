import * as THREE from "three"
/**
 *
 */
const AnimPlane = (videoTexture) => {
  const animPlaneGeo = new THREE.PlaneBufferGeometry(4, 4, 1)
  const animPlaneMat = new THREE.MeshBasicMaterial({ map: videoTexture })
  const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)

  videoTexture.image.play()

  return animPlane
}

export default AnimPlane
