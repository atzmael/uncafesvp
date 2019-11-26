import * as THREE from 'three'
import {
    visibleHeightAtZDepth,
    visibleWidthAtZDepth
} from './utils/visibleAtZDepth.js'
import AnimPlane from './AnimPlane.js'
import SoundHandler from '../SoundHandler.js'
import GUI from '../GUI'

/**
 * This return an object with the model positionned, and an animation associated to it, plus some functionnality
 * The returned object.model must be added to the scene to be visible
 * @param {Object} item
 * @param {THREE.PerspectiveCamera} camera
 * @returns {Object} an object containing the staged item and some animations / methods related to it
 */
const StagedItem = (item, camera) => {
    const { models, videoTextures, sounds, viewBasePosition, stage } = item
    if (models[0] == null) console.warn("StagedItem didn't receive a model")
    const getHeightUnit = () =>
        visibleHeightAtZDepth(models[0].position.z, camera) * 0.33
    const getWidthUnit = () =>
        visibleWidthAtZDepth(models[0].position.z, camera) * 0.33
    const getOutOfStagePosOffset = () =>
        new THREE.Vector3(0, getHeightUnit() * -2.5, 0)
    let outOfViewMaxOffsetPos = getOutOfStagePosOffset()

    let isInView = false

    let position = new THREE.Vector3(...viewBasePosition)
    let _basePos = new THREE.Vector3(0, 0, 0)
    let floatOffsetPos = new THREE.Vector3(0, 0, 0)
    let outOffsetPos = outOfViewMaxOffsetPos

    const animPlane = AnimPlane(videoTextures[0])

    // Load sound
    let audioListener = new THREE.AudioListener()
    let soundHandler = SoundHandler()
    let sound = new THREE.Audio(audioListener)

    sound.setBuffer(sounds[0])
    sound.name = sounds[0].name

    // Add object3D to intercept raycast
    let geometry = new THREE.BoxBufferGeometry(
        getWidthUnit(),
        getHeightUnit() * 2,
        0.5
    ).setFromObject(models[0])
    let material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    const collider = new THREE.Mesh(geometry, material)
    collider.name = item.name
    console.log()
    collider.add(models[0])

    // GUI.addAnimationColors(animPlane)
    const colorFolder = GUI.addFolder(`${item.name}Color`)
    GUI.addColorUniform(
        { hexColor: animPlane.hexColor1 },
        animPlane.material.uniforms.col1,
        colorFolder
    )
    GUI.addColorUniform(
        { hexColor: animPlane.hexColor2 },
        animPlane.material.uniforms.col2,
        colorFolder
    )
    GUI.addColorUniform(
        { hexColor: animPlane.hexColor3 },
        animPlane.material.uniforms.col3,
        colorFolder
    )

    const positionFromCamera = () => {
        const heightUnit = getHeightUnit()
        _basePos.set(
            position.x * heightUnit * camera.aspect, // assumes camera is Perspective and not Orthographic
            position.y * heightUnit,
            position.z
        )
        applyPosition()

        animPlane.scale.set(2, 2, 1)
    }

    const applyPosition = () => {
        collider.position
            .copy(_basePos)
            .add(outOffsetPos)
            .add(floatOffsetPos)
    }

    const focusedAnimate = () => {
        // animPlane.play()
        console.log('TODO: tweens and stuff')
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
        // TODO: play anim on hover instead of here
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
    models[0].add(animPlane)

    return Object.assign(item, {
        _basePos, // exposed for GUI only
        collider,
        sound,
        soundHandler,
        animPlane,
        focusedAnimate,
        onCanvasResize,
        checkIfEnterOrLeave,
        update
    })
}

export default StagedItem
