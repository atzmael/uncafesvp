import * as THREE from "three"
import BgPlane from "./BgPlane.js"
import StagedItem from "./StagedItem.js"
// import GUI from "../GUI.js"
// import Stats from "stats.js/src/Stats"
import {
    xpStageIndex,
    objectToInteract,
    soundsPlaying,
    soundsWaiting,
    xpStageName,
    songTiming
} from "../stores/xpStageStore"
import SoundHandler from "../SoundHandler"
import BgAnimPlane from "./BgAnimPlane"
import { gsap } from "gsap"

const SceneManager = (canvas) => {
    let width = canvas.parentNode.offsetWidth // assuming canvas width: 100%
    let height = canvas.parentNode.offsetHeight // assuming canvas height: 100%

    // let stats = Stats()
    // stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom)

    // Raycast settings
    let raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()
    let isRaycasting = false

    let songFinished = false

    // TODO: unsubscribe
    const unsubscribe = xpStageName.subscribe((value) => {
        if (value == "choice1" && interview1.isPlaying) {
            interview1.stop()
        } else if (value == "choice1" && interview2.isPlaying) {
            interview2.stop()
        }
        if (value == "choice1") {
            isRaycasting = true
        }
        if (value == "break") {
            songFinished = true
            soundsPlaying.forEach((e) => {
                e.soundHandler.pause(e.sound)
            })
        }
        if (value == "climax") {
            // TODO: launch climax
            console.log("in last stage", climax)
            gsap.killTweensOf(climax.fadeInOpa)
            gsap.to(climax.fadeInOpa, {
                value: 1,
                onUpdate: () => {
                    climax.video.play()
                    climax.video.material.uniforms.uAlpha.value =
                        climax.fadeInOpa.value
                }
            })
        }
    })

    const buildRenderer = ({ width, height }) => {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        })
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1
        renderer.setPixelRatio(DPR)
        renderer.setSize(width, height)
        renderer.gammaInput = true
        renderer.gammaOutput = true
        return renderer
    }

    const buildLights = () => {
        const lightGroup = new THREE.Group()

        // 0xf0e6dc 0xa09b96
        const ambiLight = new THREE.AmbientLight(0xa09b96, 0.2)
        lightGroup.add(ambiLight)
        const hemiLight = new THREE.HemisphereLight(0xf0e6dc, 0x232221, 1.2)
        lightGroup.add(hemiLight)
        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 3)
        hemiLight.position.set(6, 8, 7)
        hemiLight.add(hemiLightHelper)
        //GUI.addObject3D(hemiLight, "hemiLight") // TODO: find a way to modify hemilight in a sensible manner

        return lightGroup
    }

    const renderer = buildRenderer({ width, height })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.y = 3.5
    camera.position.z = 30
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    const stagedItems = []

    const lightGroup = buildLights()
    scene.add(lightGroup)

    let bgPlane

    // Sound vars
    const audioListener = new THREE.AudioListener()
    camera.add(audioListener)
    scene.add(camera)
    let songTime = 0
    let climax = {
        audio: null,
        video: null,
        fadeInOpa: { value: 0 }
    }
    let interview1
    let interview2

    let clock = new THREE.Clock()
    clock.start()

    const addLoadedData = (loadedData) => {
        loadedData.items.forEach((item) => {
            const stagedItem = StagedItem(item, camera, scene, audioListener)
            stagedItems.push(stagedItem)
            scene.add(stagedItem.collider)
            objectToInteract.push(stagedItem.collider)
            // GUI.addStagedItem(stagedItem)
        })

        interview1 = new THREE.Audio(audioListener)
        interview1.setBuffer(loadedData.sounds[0])
        interview2 = new THREE.Audio(audioListener)
        interview2.setBuffer(loadedData.sounds[1])
        let choice = Math.random() > 0.5
        if (choice) {
            interview1.play()
        } else {
            interview2.play()
        }

        climax.video = BgAnimPlane({
            videoTexture: loadedData.videoTextures[0],
            camera,
            active: true,
            looping: false
        })
        scene.add(climax.video)

        // TODO: static bg
        const backgroundTextures = loadedData.textures.filter((tex) =>
            tex.name.match(/^bg/i)
        )
        const noiseTexture = loadedData.textures.find(
            (tex) => tex.name === "noiseTexture"
        )
        // console.log(backgroundTextures)
        bgPlane = BgPlane({ bgTextures: backgroundTextures, noiseTexture })
        scene.add(bgPlane.mesh)
        bgPlane.onCanvasResize(camera)

        // loadedData.videoTextures.forEach((vt) => {
        //     if (vt.name == "animtestVideoTexture") {
        //         if (bgPlane) bgPlane.playAnimTexture(vt)
        //     }
        // })
    }

    const changeXpStage = (newXpStage) => {
        stagedItems.forEach((item) => item.checkIfEnterOrLeave(newXpStage))
    }

    const onCanvasResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        if (bgPlane) bgPlane.onCanvasResize(camera)
        stagedItems.forEach((item) => item.onCanvasResize())
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const onMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", onMouseMove, false)

    let INTERSECTED = false
    let lastIntersectedObjectName = null
    let objectIntersected = null
    const update = (time) => {
        // Debug
        // stats.begin()

        songTime = time

        // Get the current offset of the time timeline
        songTiming.value += clock.getDelta()
        if (songTiming.value > songTiming.duration) {
            songTiming.value = 0
        }

        // RAYCASTING
        raycaster.setFromCamera(mouse, camera)

        var intersects = raycaster.intersectObjects(objectToInteract)

        let lastItem = null
        if (intersects.length > 0 && isRaycasting) {
            if (
                !INTERSECTED ||
                lastIntersectedObjectName != intersects[0].object.name
            ) {
                if (null != lastIntersectedObjectName) {
                    lastItem = stagedItems.find(
                        (elmt) => elmt.name == lastIntersectedObjectName
                    )
                    lastItem.getBackToPlace()
                }
                objectIntersected = stagedItems.find(
                    (elmt) => elmt.name == intersects[0].object.name
                )
                objectIntersected.hasBeenTouched()
                lastIntersectedObjectName = intersects[0].object.name
                INTERSECTED = true
            }
        } else {
            if (null != lastIntersectedObjectName) {
                lastItem = stagedItems.find(
                    (elmt) => elmt.name == lastIntersectedObjectName
                )
                lastItem.getBackToPlace(objectIntersected.soundLooping)
                lastIntersectedObjectName = null
            }
            objectIntersected = null
            INTERSECTED = false
        }

        if (soundsPlaying.length > 0 && !songFinished) {
            soundsPlaying.forEach((e) => {
                if (e.sound.getVolume() == 0 || !e.sound.isPlaying) {
                    e.soundHandler.play("playloop", e.sound, songTiming.value)
                }
            })
        }

        if (bgPlane) bgPlane.update(time)
        stagedItems.forEach((item) => item.update(time))

        renderer.render(scene, camera)

        // stats.end()
    }

    canvas.addEventListener("click", (e) => {
        e.preventDefault()
        if (null != objectIntersected && objectIntersected.active) {
            objectIntersected.soundLooping = true
            soundsPlaying.push(objectIntersected)
            xpStageIndex.next()
        }
    })

    return {
        addLoadedData,
        onCanvasResize,
        changeXpStage,
        update
    }
}

export default SceneManager
