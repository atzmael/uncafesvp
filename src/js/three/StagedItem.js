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

    model.position.copy(options.position).multiplyScalar(window.innerHeight * 0.005) // TODO: do a proper units remapping

    const focusedAnimate = () => {
        console.log("TODO: tweens and stuff")
    }

    const update = (time) => {
        // model.position.y += 0.01
        //TODO: floating in midair ?
    }

    parent.add(model)

    return {
        model,
        focusedAnimate,
        update
    }
}

export default StagedItem
