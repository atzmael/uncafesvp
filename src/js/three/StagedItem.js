import * as THREE from "three"
import {
    visibleHeightAtZDepth,
    visibleWidthAtZDepth
} from "./utils/visibleAtZDepth.js"
import AnimPlane from "./AnimPlane.js"
import BgAnimPlane from "./BgAnimPlane.js"
import SoundHandler from "../SoundHandler.js"
// import GUI from "../GUI.js"
import { songTiming, soundsWaiting } from "../stores/xpStageStore"
import { TweenLite, gsap, Power1, Power3 } from "gsap"

/**
 * This return an object with the model positionned, and an animation associated to it, plus some functionnality
 * The returned object.model must be added to the scene to be visible
 * @param {Object} item
 * @param {THREE.PerspectiveCamera} camera
 * @returns {Object} an object containing the staged item and some animations / methods related to it
 */
const StagedItem = (item, camera, scene, audioListener) => {
    // console.log(item)
    const {
        models,
        videoTextures,
        sounds,
        localScale,
        colors,
        haloColor,
        haloVerticalScale,
        viewBasePosition,
        focusedRotation,
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
        new THREE.Vector3(0, getHeightUnit() * -3.5, 0)
    let outOfViewMaxOffsetPos = getOutOfStagePosOffset()

    let isInView = false
    let isActive = false

    let position = new THREE.Vector3(...viewBasePosition)
    let _basePos = new THREE.Vector3(0, 0, 0)
    let floatOffsetPos = new THREE.Vector3(0, 0, 0)
    let outOffsetPos = outOfViewMaxOffsetPos

    const animPlane = AnimPlane({
        videoTexture: frontVideoTexture,
        active: item.active,
        hexColor1: colors[0],
        hexColor2: colors[1],
        hexColor3: colors[2]
    })
    const bgPlane = BgAnimPlane({
        videoTexture: bgVideoTexture,
        camera,
        active: item.active
    })

    // sound
    let sound = new THREE.Audio(audioListener)
    let soundLooping = false
    let soundHandler = SoundHandler()
    soundHandler.initSound(audio, item.name, sound)
    soundHandler.play("loadloop", sound)
    soundsWaiting.push({ sound: sound, soundHandler: soundHandler })

    // Animation
    let canAnimate = false
    let highlightOffsetPos = new THREE.Vector3(0, 3, 0)
    let highlightRotation = new THREE.Vector3(
        focusedRotation[0] * 2 * Math.PI,
        focusedRotation[1] * 2 * Math.PI,
        focusedRotation[2] * 2 * Math.PI
    )
    // Tweens
    let progress = { value: 0 }
    const staggerDelay = 0.27

    const fixedRotationGroup = new THREE.Group()
    model.scale.set(localScale * 2.3, localScale * 2.3, localScale * 2.3)
    fixedRotationGroup.add(model)

    const spriteMap = new THREE.TextureLoader().load("./assets/maps/halo.png")
    const maxHaloOpacity = 0.5
    const spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: haloColor,
        opacity: 0.0,
        transparent: true,
        blending: THREE.NormalBlending
    })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(13.5, 13.5 * haloVerticalScale, 13.5)
    sprite.position.z = -3
    sprite.position.x = position.x * getHeightUnit() * 0.05
    fixedRotationGroup.add(sprite)

    // Add object3D to intercept raycast
    let geometry = new THREE.BoxBufferGeometry(
        getWidthUnit() * 0.6,
        getHeightUnit() * 1.5,
        0.5
    ).setFromObject(model)
    let material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    const collider = new THREE.Mesh(geometry, material)
    collider.name = item.name
    collider.add(fixedRotationGroup)

    // const colorFolder = GUI.addFolder(`${item.name}Color`)
    // GUI.addColorUniform(
    //     { hexColor: animPlane.hexColor1 },
    //     animPlane.material.uniforms.col1,
    //     colorFolder
    // )
    // GUI.addColorUniform(
    //     { hexColor: animPlane.hexColor2 },
    //     animPlane.material.uniforms.col2,
    //     colorFolder
    // )
    // GUI.addColorUniform(
    //     { hexColor: animPlane.hexColor3 },
    //     animPlane.material.uniforms.col3,
    //     colorFolder
    // )

    // GUI.close()

    const hasBeenTouched = () => {
        gsap.killTweensOf(progress)
        TweenLite.to(progress, 0.5, {
            value: 1,
            onUpdate: () => {
                model.rotation.set(
                    highlightRotation.x * progress.value,
                    highlightRotation.y * progress.value,
                    highlightRotation.z * progress.value
                )
                animPlane.material.uniforms.uAlpha.value = progress.value
                bgPlane.material.uniforms.uAlpha.value = progress.value
                sprite.material.opacity = progress.value * maxHaloOpacity
            }
        })
        if (item.active) {
            soundHandler.play("playloop", sound, songTiming.value)
            animPlane.play(songTiming.value)
            bgPlane.play()
            bgPlane.checkIfIsFocused(true)
        }
        canAnimate = true
        isActive = true
        document.body.style.cursor = "pointer"
    }

    const getBackToPlace = (isLooping) => {
        isActive = false
        gsap.killTweensOf(progress)
        if (!isLooping && item.active) {
            soundHandler.stop("loop", sound)
        }
        TweenLite.to(progress, 0.5, {
            value: 0,
            onUpdate: () => {
                // TODO: slerp: this 0.25 value is dependant on framerate, use deltaTime or something instead
                model.quaternion.slerp(new THREE.Quaternion(0, 0, 0, 1), 0.25)
                animPlane.material.uniforms.uAlpha.value = progress.value
                bgPlane.material.uniforms.uAlpha.value = progress.value
                sprite.material.opacity = progress.value * maxHaloOpacity
            },
            onComplete: () => {
                canAnimate = false
                if (item.active) {
                    animPlane.stop()
                    bgPlane.checkIfIsFocused(false)
                }
            }
        })
        document.body.style.cursor = "auto"
    }

    const positionFromCamera = () => {
        const heightUnit = getHeightUnit()
        _basePos.set(
            position.x * heightUnit * camera.aspect * 0.85, // assumes camera is Perspective and not Orthographic
            position.y * heightUnit,
            position.z
        )
        applyPosition()

        animPlane.scale.set(3, 3, 3)
    }

    const applyPosition = () => {
        collider.position.copy(_basePos).add(outOffsetPos)
        fixedRotationGroup.position.y =
            _basePos.y + floatOffsetPos.y + highlightOffsetPos.y * progress.value
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
        setTimeout(() => {
            gsap.killTweensOf(outOffsetPos)
            isInView = true
            TweenLite.to(outOffsetPos, {
                y: -getHeightUnit() * 0.1,
                duration: 1.3,
                delay: 0.2,
                ease: Power3.easeOut
            })
        }, staggerDelay)
    }
    const leaveView = () => {
        console.log()
        gsap.killTweensOf(outOffsetPos)
        TweenLite.to(outOffsetPos, {
            y: getOutOfStagePosOffset().y,
            delay: isActive ? staggerDelay : 0, // add a delay if it is hovered
            ease: Power1.easeIn,
            onComplete: () => {
                isInView = false
            }
        })
    }

    const update = (time) => {
        if (!isInView) return
        applyPosition()
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
