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

    // let cube = Cube()
    // scene.add(cube.mesh)

    let ambiLight = new THREE.AmbientLight("white", 0.1)
    // scene.add(ambiLight)
    let hemiLight = new THREE.HemisphereLight("white", "red", 0.7)
    scene.add(hemiLight)

    let bgPlane = BgPlane(camera)
    camera.add(bgPlane.mesh)
    scene.add(camera) // this is needed to add objects attached to camera in the scene

    camera.position.z = 20

    // GUI.addMeshToGui(cube)
    GUI.addMeshToGui(bgPlane.mesh)

    /**
     * @param {Object} assets
     */
    const updateAssets = (assets) => {
        for (let [assetName, asset] of Object.entries(assets)) {
            // if (assetName === "modeltest") scene.add(asset)
            if (assetName === "gobelet") scene.add(asset)
        }
    }

    const changeXpStage = (change = "next") => {
        // TODO: Math.min with number of max stages
        if (change == "next") activeXpStageIndx += 1
        else if (change == "prev")
            activeXpStageIndx = Math.max(activeXpStageIndx - 1, 0)
        else if (typeof change == "number") activeXpStageIndx = Math.max(change, 0)
        else throw `Could not changeXpStage to ${change}`
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
        changeXpStage,
        updateAssets
    }
}

export default SceneManager
