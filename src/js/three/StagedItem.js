import * as THREE from "three"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"
import AnimPlane from "./AnimPlane.js"

/**
 * This return an object with the model positionned, and an animation associated to it, plus some functionnality
 * The returned object.model must be added to the scene to be visible
 * @param {Object} item
 * @param {THREE.PerspectiveCamera} camera
 * @returns {Object} an object containing the staged item and some animations / methods related to it
 */
const StagedItem = (item, camera) => {
  const { model, anim, viewBasePosition, stage } = item
  if (model == null) console.warn("StagedItem didn't receive a model")
  const getHeightUnit = () => visibleHeightAtZDepth(model.position.z, camera) * 0.33
  const getOutOfStagePosOffset = () =>
    new THREE.Vector3(0, getHeightUnit() * -1.6, 0)
  let outOfViewMaxOffsetPos = getOutOfStagePosOffset()

  let isInView = false

  let position = new THREE.Vector3(...viewBasePosition)
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

  const animPlane = AnimPlane(anim)
  model.add(animPlane)

  const focusedAnimate = () => {
    // animPlane.play()
    console.log("TODO: tweens and stuff")
  }

  const onCanvasResize = () => {
    positionFromCamera()
    outOfViewMaxOffsetPos = getOutOfStagePosOffset()
  }

  const checkIfEnterOrLeave = (stageIndex) => {
    if (isInView && stage != stageIndex) {
      leaveView()
    } else if (!isInView && stage == stageIndex) {
      enterView()
    }
  }

  const enterView = () => {
    animPlane.play()
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

  return Object.assign(item, {
    _basePos, // exposed for GUI only
    animPlane,
    focusedAnimate,
    onCanvasResize,
    checkIfEnterOrLeave,
    update
  })
}

export default StagedItem
