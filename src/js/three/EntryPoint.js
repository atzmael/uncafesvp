import SceneManager from "./SceneManager.js"

const EntryPoint = (canvas) => {
    const sceneManager = SceneManager(canvas)

    const onWindowResize = () => {
        sceneManager.onCanvasResize()
    }

    window.addEventListener("resize", onWindowResize, false)
    onWindowResize()
}

export default EntryPoint
