import * as THREE from "three"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"

/**
 * This adds the model to the parent (ex: in the scene)
 * @param {THREE.Object3D} model
 * @param {THREE.Object3D} parent
 * @param {Object} options
 * @returns {Object} an object containing the staged model and some animations / methods related to it
 */
const StagedItem = (
  model,
  parent,
  camera,
  options = {
    stage: 1,
    position: new THREE.Vector3(0, 0, 0)
  }
) => {
  if (model == null) console.warn("StagedItem didn't receive a model")

  let _basePos = new THREE.Vector3(0, 0, 0)
  let floatOffsetPos = new THREE.Vector3(0, 0, 0)

  const positionFromCamera = () => {
    const heightUnit = visibleHeightAtZDepth(model.position.z, camera) * 0.33
    _basePos.set(
      options.position.x * heightUnit * camera.aspect,
      options.position.y * heightUnit,
      options.position.z
    )
  }

  const onCanvasResize = () => {
    positionFromCamera()
  }

  const focusedAnimate = () => {
    console.log("TODO: tweens and stuff")
  }

  const update = (time) => {
    floatOffsetPos.y = Math.cos(time * 1.7 + options.position.x) * 0.3
    model.position.copy(_basePos).add(floatOffsetPos)
  }

  positionFromCamera()
  parent.add(model)

  return {
    model,
    _basePos, // exposed for GUI only
    onCanvasResize,
    focusedAnimate,
    update
  }
}

export default StagedItem
