import * as THREE from "three"
import Cube from "./Cube.js"

const SceneManager = (container) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z = 10

    const render = () => {
        renderer.render(scene, camera)
    }

    const onCanvasResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    renderer.animate(render)

    // TODO: load "dist/assets/3D/vertical_placeholder.glb" using AssetLoader and display just nearby the 1,1,1 threejs cube
    let cube = Cube()

    scene.add(cube)

    window.guiFunc.addMeshToGui(cube)

    render()

    return {
        onCanvasResize
    }
}

export default SceneManager
