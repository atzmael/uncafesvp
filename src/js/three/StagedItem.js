import * as THREE from "three"
import {visibleHeightAtZDepth} from "./utils/visibleAtZDepth.js"
import {Camera} from "three"

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

	const positionFromCamera = () => {
		const newPos = model.position.copy(options.position)
		const heightUnit = visibleHeightAtZDepth(model.position.z, camera) * 0.33
		newPos.y *= heightUnit
		newPos.x *= heightUnit * camera.aspect
	}

	const onCanvasResize = () => {
		positionFromCamera()
	}

	const focusedAnimate = () => {
		console.log("TODO: tweens and stuff")
	}

	let increment = 0;
	const update = (time) => {
		increment+= 0.05;
		model.position.y = Math.cos(increment) * 0.1;
		//TODO: floating in midair ?
	}

	positionFromCamera()
	parent.add(model)

	return {
		model,
		onCanvasResize,
		focusedAnimate,
		update
	}
}

export default StagedItem
