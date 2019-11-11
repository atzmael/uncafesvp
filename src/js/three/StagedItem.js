import * as THREE from "three"
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
  options = {
    stage: 1,
    position: new THREE.Vector3(0, 0, 0)
  }
) => {
  if (model == null) console.warn("StagedItem didn't receive a model")

  const positionFromCanvasSize = () => {
    const newPos = model.position.copy(options.position)
    newPos.x *= window.innerWidth * 0.006 // TODO: do a proper units remapping, use canvas instead of window
    newPos.y *= window.innerHeight * 0.006 // TODO: do a proper units remapping, use canvas instead of window
  }

  const onCanvasResize = () => {
    positionFromCanvasSize()
  }

  const focusedAnimate = () => {
    console.log("TODO: tweens and stuff")
  }

  const update = (time) => {
    // model.position.y += 0.01
    //TODO: floating in midair ?
  }

  positionFromCanvasSize()
  parent.add(model)

  return {
    model,
    onCanvasResize,
    focusedAnimate,
    update
  }
}

export default StagedItem
