import * as THREE from "three"
import Cube from "./Cube.js"
import BgPlane from "./BgPlane.js"
import GUI from "../GUI.js"

const SceneManager = (canvas) => {
    let width = canvas.parentNode.offsetWidth // assuming canvas width: 100%
    let height = canvas.parentNode.offsetHeight // assuming canvas height: 100%

    let activeXpStageIndx = 0

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

    const renderer = buildRenderer({ width, height })

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z = 10

    // TODO: load "dist/assets/3D/vertical_placeholder.glb" using AssetLoader and display just nearby the 1,1,1 threejs cube
    let cube = Cube()
    scene.add(cube.mesh)

    let bgPlane = BgPlane(camera)
    camera.add(bgPlane.mesh)
    scene.add(camera) // this is needed to add objects attached to camera in the scene

    // GUI.addMeshToGui(cube)
    GUI.addMeshToGui(bgPlane.mesh)

    const nextXpStage = () => {
        activeXpStageIndx += 1
        console.log(activeXpStageIndx)
        // TODO: activeXpStageIndx = Math.min(activeXpStageIndx + 1, XpStages.length);
    }
    const previousXpStage = () => {
        activeXpStageIndx = Math.max(activeXpStageIndx - 1, 0)
        console.log(activeXpStageIndx)
    }

    const onCanvasResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        // bgPlane.onCanvasResize()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const mainLoop = (time) => {
        bgPlane.update()
        renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(mainLoop)

    return {
        onCanvasResize,
        nextXpStage,
        previousXpStage
    }
}

export default SceneManager
