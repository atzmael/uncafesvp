<script>
    import { onMount, tick } from "svelte"
    import SmartLoader from "./js/three/loaders/SmartLoader.js"
    import * as THREE from "three"

    import onAnimationFrame from "./js/onAnimationFrame.js"

    import Debugger from "./components/Debugger.svelte"
    import UI from "./components/UI.svelte"
    import CanvasContainer from "./components/CanvasContainer.svelte"

    import data from "./data.json"

    import {
        xpStageIndex,
        xpStageName,
        didUserInteract
    } from "./js/stores/xpStageStore.js"

    // TODO: use store for debugging variables ?
    const isDebugging = false

    let loadedData = {}
    let isLoaded = false
    let loadingPercentage = 0

    const loadAssets = () => {
        const onProgress = (loadedPath, loadedQtty, totalQtty) => {
            loadingPercentage = Math.round((loadedQtty / totalQtty) * 100)
        }
        const sLoader = SmartLoader(onProgress)
        sLoader.onComplete((resolvedData) => {
            // console.log("resolvedData:", resolvedData)
            loadedData = resolvedData
            isLoaded = true
        })

        sLoader.load("/assets/maps/background4.jpg", "bg1")
        sLoader.load("/assets/maps/background2.jpg", "bg2")
        sLoader.load("/assets/maps/background3.jpg", "bg3")
        sLoader.load("/assets/maps/noise_center_tiled.jpg", "noise")

        sLoader.load("/assets/sound/temoignage1.mp3", "temoignage1")
        sLoader.load("/assets/sound/temoignage2.mp3", "temoignage2")
        sLoader.load("/assets/animations/climax.mp4", "climax")
        data.items.forEach((item) => {
            sLoader.load(Object.assign(item, { type: "item" }), item.name)
        })
    }

    const userInteracted = () => {
        didUserInteract.set(true) // write in store
        document.removeEventListener("click", userInteracted)
    }

    onMount(() => {
        document.addEventListener("click", userInteracted)
        loadAssets()
    })
</script>

{#if isDebugging}
    <Debugger />
{/if}
<UI {loadingPercentage} />
<CanvasContainer {loadedData} {isLoaded} />
