import * as THREE from "three"
import Cube from "./Cube.js"

const EntryPoint = () => {
    const container = document.querySelector("#container")
    // document.body.appendChild(container)

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z = 10

    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const render = () => {
        renderer.render(scene, camera)
    }

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", onWindowResize.bind(this), false)
    onWindowResize()

    renderer.animate(render.bind(this))

    // TODO: load "dist/assets/3D/vertical_placeholder.glb" using AssetLoader and display just nearby the 1,1,1 threejs cube
    let cube = Cube()

    scene.add(cube)

    cube.position.x = 1

    render()
}

export default EntryPoint
