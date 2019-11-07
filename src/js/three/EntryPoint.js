import SceneManager from "./SceneManager.js"

const EntryPoint = (container) => {
    const sceneManager = SceneManager(container)

    const onWindowResize = () => {
        sceneManager.onCanvasResize()
    }

    window.addEventListener("resize", onWindowResize, false)
    onWindowResize()
}

export default EntryPoint
