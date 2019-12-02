import { onMount, onDestroy } from "svelte"

import { xpStageIndex } from "../stores/xpStageStore"

const delayBeforeNextStep = (ms) => {
    let timeout
    onMount(() => {
        timeout = setTimeout(() => {
            xpStageIndex.next()
        }, ms)
    })
    onDestroy(() => {
        clearTimeout(timeout)
    })
}

export default delayBeforeNextStep
