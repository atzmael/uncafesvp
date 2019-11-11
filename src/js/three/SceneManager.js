import * as THREE from "three"
import BgPlane from "./BgPlane.js"
import GUI from "../GUI.js"

const SceneManager = (canvas) => {
    let width = canvas.parentNode.offsetWidth // assuming canvas width: 100%
    let height = canvas.parentNode.offsetHeight // assuming canvas height: 100%

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

    // let ambiLight = new THREE.AmbientLight("white", 0.1)
    // scene.add(ambiLight)
    let hemiLight = new THREE.HemisphereLight("white", "red", 0.7)
    scene.add(hemiLight)

    let bgPlane = BgPlane(camera)
    camera.add(bgPlane.mesh)
    scene.add(camera) // this is needed to add objects attached to camera in the scene // TODO: remove this line (check BgPlane.js)

    camera.position.z = 20

    // GUI.addMeshToGui(cube)
    GUI.addMeshToGui(bgPlane.mesh)

    /**
     * @param {Array} assets
     */
    const updateAssets = (assets) => {
        assets.forEach((asset) => {
            // if (asset.name == "gobelet") scene.add(asset)
            // if (asset.name === "lait") scene.add(asset)
            if (asset instanceof THREE.Object3D) scene.add(asset)
            if (asset instanceof THREE.Texture) console.log(asset)
        })
        for (let [assetName, asset] of Object.entries(assets)) {
        }
    }

    // TODO: use ChosableItem.js

    const changeXpStage = (newXpStage) => {
        console.warn("TODO: threejs logic when the xpStage changes")
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
