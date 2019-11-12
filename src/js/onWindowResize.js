import { onDestroy } from "svelte"

export default function onWindowResize(callback) {
    window.addEventListener("resize", callback)

    onDestroy(() => {
        window.removeEventListener("resize", callback)
    })
}
