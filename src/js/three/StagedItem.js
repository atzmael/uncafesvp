import * as THREE from "three"
import {
    visibleHeightAtZDepth,
    visibleWidthAtZDepth
} from "./utils/visibleAtZDepth.js"
import AnimPlane from "./AnimPlane.js"
import BgAnimPlane from "./BgAnimPlane.js"
import SoundHandler from "../SoundHandler.js"
//import GUI from "../GUI"
import {songTiming, soundsWaiting} from "../stores/xpStageStore"
import {gsap} from "gsap"

/**
 * This return an object with the model positionned, and an animation associated to it, plus some functionnality
 * The returned object.model must be added to the scene to be visible
 * @param {Object} item
 * @param {THREE.PerspectiveCamera} camera
 * @returns {Object} an object containing the staged item and some animations / methods related to it
 */
const StagedItem = (item, camera, scene, audioListener) => {
    const {
        models,
        videoTextures,
        sounds,
        localScale,
        viewBasePosition,
        stage
    } = item
    const model = models[0]
    const audio = sounds[0]
    const frontVideoTexture = videoTextures.find((t) => t.name.includes("FrontAnim"))
    const bgVideoTexture = videoTextures.find((t) => t.name.includes("BgAnim"))

    if (model == null) console.warn("StagedItem didn't receive a model")
    const getHeightUnit = () =>
        visibleHeightAtZDepth(model.position.z, camera) * 0.33
    const getWidthUnit = () => visibleWidthAtZDepth(model.position.z, camera) * 0.33
    const getOutOfStagePosOffset = () =>
        new THREE.Vector3(0, getHeightUnit() * -3, 0)
    let outOfViewMaxOffsetPos = getOutOfStagePosOffset()

    let isInView = false
    let isActive = false

    let position = new THREE.Vector3(...viewBasePosition)
    let _basePos = new THREE.Vector3(0, 0, 0)
    let floatOffsetPos = new THREE.Vector3(0, 0, 0)
    let outOffsetPos = outOfViewMaxOffsetPos

    const animPlane = AnimPlane({videoTexture: frontVideoTexture, active: item.active})
    const bgPlane = BgAnimPlane({videoTexture: bgVideoTexture, camera, active: item.active})

    // sound
    let sound = new THREE.Audio(audioListener)
    let soundLooping = false
    let soundHandler = SoundHandler()
    soundHandler.initSound(audio, item.name, sound)
    soundHandler.play("loadloop", sound)
    soundsWaiting.push({sound: sound, soundHandler: soundHandler})

    // Animation
    let canAnimate = false
    let hasRotated = false
    let highlightOffsetPos = new THREE.Vector3(0, 3, 0)
    let highlightRotation = new THREE.Vector3(0, (-45 * Math.PI) / 180, 0)
    // Tweens
    let progress = {value: 0}

    const fixedRotationGroup = new THREE.Group()
    model.scale.set(localScale * 2.3, localScale * 2.3, localScale * 2.3)
    fixedRotationGroup.add(model)

    // Add object3D to intercept raycast
    let geometry = new THREE.BoxBufferGeometry(
        getWidthUnit(),
        getHeightUnit() * 1.5,
        0.5
    ).setFromObject(model)
    let material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
    const collider = new THREE.Mesh(geometry, material)
    collider.name = item.name
    collider.add(fixedRotationGroup)

    /*
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

    GUI.close()
     */

    const hasBeenTouched = () => {
        gsap.killTweensOf(progress)
        gsap.to(progress, {
            value: 1,
            onUpdate: () => {
                animPlane.material.uniforms.uAlpha.value = progress.value
                bgPlane.material.uniforms.uAlpha.value = progress.value
            }
        })
        if (item.active) {
            soundHandler.play("playloop", sound, songTiming.value)
            animPlane.play(songTiming.value)
            bgPlane.play()
            bgPlane.checkIfIsFocused(true)
        }
        canAnimate = true
    }

    const getBackToPlace = () => {
        gsap.killTweensOf(progress)
        if (!soundLooping && item.active) {
            soundHandler.stop("loop", sound)
        }
        gsap.to(progress, {
            value: 0,
            onUpdate: () => {
                animPlane.material.uniforms.uAlpha.value = progress.value
                bgPlane.material.uniforms.uAlpha.value = progress.value
            },
            onComplete: () => {
                canAnimate = false
                if (item.active) {
                    animPlane.stop()
                    bgPlane.checkIfIsFocused(false)
                }
            }
        })
    }

    const positionFromCamera = () => {
        const heightUnit = getHeightUnit()
        _basePos.set(
            position.x * heightUnit * camera.aspect * 0.85, // assumes camera is Perspective and not Orthographic
            position.y * heightUnit,
            position.z
        )
        applyPosition()

        animPlane.scale.set(2.6, 2.6, 2.6)
    }

    const applyPosition = () => {
        collider.position.copy(_basePos).add(outOffsetPos)
        fixedRotationGroup.position.y =
            _basePos.y + floatOffsetPos.y + highlightOffsetPos.y * progress.value
    }

    const applyRotation = () => {
        model.rotation.y = highlightRotation.y * progress.value
    }

    const onCanvasResize = () => {
        positionFromCamera()
        outOfViewMaxOffsetPos = getOutOfStagePosOffset()
        bgPlane.onCanvasResize()
    }

    const checkIfEnterOrLeave = (stageIndex) => {
        if (isInView && stage != stageIndex) {
            leaveView()
        } else if (!isInView && stage == stageIndex) {
            enterView()
        }
    }

    const enterView = () => {
        gsap.killTweensOf(outOffsetPos)
        isInView = true
        gsap.to(outOffsetPos, {y: -getHeightUnit() * 0.1})
    }
    const leaveView = () => {
        gsap.killTweensOf(outOffsetPos)
        gsap.to(outOffsetPos, {
            y: getOutOfStagePosOffset().y,
            onComplete: () => {
                isInView = false
            }
        })
    }

    const update = (time) => {
        if (!isInView) return
        applyPosition()
        applyRotation()
        if (!canAnimate) return
        floatOffsetPos.y = Math.cos(time * 1.7 + position.x) * 0.3
    }

    positionFromCamera()
    fixedRotationGroup.add(animPlane)
    scene.add(bgPlane)

    return Object.assign(item, {
        _basePos, // exposed for GUI only
        collider,
        sound,
        soundHandler,
        animPlane,
        soundLooping,
        hasBeenTouched,
        getBackToPlace,
        onCanvasResize,
        checkIfEnterOrLeave,
        update
    })
}

export default StagedItem
