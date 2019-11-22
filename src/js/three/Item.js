import * as THREE from "three"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"

/**
 * This return an object with the model positionned, and an animation associated to it, plus some functionnality
 * The returned object.model must be added to the scene to be visible
 * @param {THREE.Object3D} model
 * @param {THREE.PerspectiveCamera} camera
 * @param {Object} param3 options
 * @returns {Object} an object containing the staged model and some animations / methods related to it
 */
const Item = (
  model,
  camera,
  {
    stage = 1,
    position = new THREE.Vector3(0, 0, 0)
    // TODO: add animPlane
  } = {}
) => {
  if (model == null) console.warn("Item didn't receive a model")
  const getHeightUnit = () => visibleHeightAtZDepth(model.position.z, camera) * 0.33
  const getOutOfStagePosOffset = () =>
    new THREE.Vector3(0, getHeightUnit() * -1.6, 0)
  let outOfViewMaxOffsetPos = getOutOfStagePosOffset()

  let isInView = false

  let _basePos = new THREE.Vector3(0, 0, 0)
  let floatOffsetPos = new THREE.Vector3(0, 0, 0)
  let outOffsetPos = outOfViewMaxOffsetPos

  const positionFromCamera = () => {
    const heightUnit = getHeightUnit()
    _basePos.set(
      position.x * heightUnit * camera.aspect, // assumes camera is Perspective and not Orthographic
      position.y * heightUnit,
      position.z
    )
    applyPosition()
  }

  const applyPosition = () => {
    model.position
      .copy(_basePos)
      .add(outOffsetPos)
      .add(floatOffsetPos)
  }

  const onCanvasResize = () => {
    positionFromCamera()
    outOfViewMaxOffsetPos = getOutOfStagePosOffset()
  }

  const focusedAnimate = () => {
    console.log("TODO: tweens and stuff")
  }

  const checkIfEnterOrLeave = (stageIndex) => {
    if (isInView && stage != stageIndex) {
      leaveView()
    } else if (!isInView && stage == stageIndex) {
      enterView()
    }
  }

  const enterView = () => {
    // TODO: tween instead of direct assign
    outOffsetPos = new THREE.Vector3(0, 0, 0)
    isInView = true
  }
  const leaveView = () => {
    // TODO: tween instead of direct assign
    outOffsetPos = outOfViewMaxOffsetPos
    // TODO: remove setTimeout and use onComplete hook (tween)
    setTimeout(() => {
      isInView = false
      applyPosition()
    }, 300)
  }

  const update = (time) => {
    if (!isInView) return
    floatOffsetPos.y = Math.cos(time * 1.7 + position.x) * 0.3
    applyPosition()
  }

  // TODO: add bounding boxes that trigger a 'focus' event on hover (raycaster)
  // This would play() the videoTexture and rotate/move the model
  // maybe add one bounding box for the resting position (stays in place),
  // and an other one for the focused position, that follows the model movements

  positionFromCamera()

  return {
    model,
    _basePos, // exposed for GUI only
    onCanvasResize,
    focusedAnimate,
    checkIfEnterOrLeave,
    update
  }
}

export default Item
