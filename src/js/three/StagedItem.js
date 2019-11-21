import * as THREE from "three"
import { visibleHeightAtZDepth } from "./utils/visibleAtZDepth.js"
import { isRegExp } from "util"

/**
 * This adds the model to the parent (ex: in the scene)
 * @param {THREE.Object3D} model
 * @param {THREE.Object3D} parent
 * @param {THREE.PerspectiveCamera} camera
 * @param {Object} param3 options
 * @returns {Object} an object containing the staged model and some animations / methods related to it
 */
const StagedItem = (
  model,
  parent,
  camera,
  { stage = 1, position = new THREE.Vector3(0, 0, 0) } = {}
) => {
  if (model == null) console.warn("StagedItem didn't receive a model")

  const getHeightUnit = () => visibleHeightAtZDepth(model.position.z, camera) * 0.33
  const getOutOfStagePosOffset = () => new THREE.Vector3(0, getHeightUnit() * -3, 0)
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
    isInView = false
  }

  const update = (time) => {
    floatOffsetPos.y = Math.cos(time * 1.7 + position.x) * 0.3
    model.position
      .copy(_basePos)
      .add(outOffsetPos)
      .add(floatOffsetPos)
  }

  positionFromCamera()
  parent.add(model)

  return {
    model,
    _basePos, // exposed for GUI only
    onCanvasResize,
    focusedAnimate,
    checkIfEnterOrLeave,
    update
  }
}

export default StagedItem
