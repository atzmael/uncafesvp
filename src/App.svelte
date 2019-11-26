<script>
    import { onMount } from 'svelte'
    import SmartLoader from './js/three/loaders/SmartLoader.js'
    import * as THREE from 'three'

    import Debugger from './components/Debugger.svelte'
    import UI from './components/UI.svelte'
    import CanvasContainer from './components/CanvasContainer.svelte'

    import data from './data.json'

    import {
        xpStageIndex,
        xpStageName,
        didUserInteract
    } from './js/stores/xpStageStore.js'
    // TODO? do not use a global store (encapsulate inside SmartLoader)
    import { isLoaded, loadingPercentage } from './js/stores/loadingStateStore.js'

    // TODO: use store for debugging variables ?
    const isDebugging = true

    let loadedData = {}
    const onProgress = (xhr) => {
        const percentage = Math.round((xhr.loaded / xhr.total) * 100)
        loadingPercentage.set(percentage)
        console.log(percentage)
    }
    const sLoader = SmartLoader(onProgress)

    const userInteracted = () => {
        didUserInteract.set(true) // write in store
        document.removeEventListener('click', userInteracted)
    }

    onMount(() => {
        document.addEventListener('click', userInteracted)
        sLoader.load('/assets/maps/TiledWaterColor_placeholder.png', 'maptest')
        sLoader.load('/assets/animations/test_background2048.mp4', 'animtest')
        // sLoader.load('/assets/sound/piste1.mp3', 'soundtest')
        data.items.forEach((item) => {
            sLoader.load(Object.assign(item, { type: 'item' }), item.name)
        })

        sLoader.onComplete((resolvedData) => {
            console.log('resolvedData:', resolvedData)
            loadedData = resolvedData
            isLoaded.set(true)
        })
    })
</script>

{#if isDebugging}
    <Debugger />
{/if}
<UI loadingPercentage={$loadingPercentage} isLoaded={$isLoaded} />
<CanvasContainer {loadedData} isLoaded={$isLoaded} />
