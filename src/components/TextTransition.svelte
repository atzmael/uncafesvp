<script>
    import { fade } from "svelte/transition"

    import { xpStageName } from "../js/stores/xpStageStore.js"

    import delayBeforeNextStep from "../js/utils/delayBeforeNextStep"

    export let text
    export let subText = ""
    export let duration
    export let isSas = false

    if (duration > 0) delayBeforeNextStep(duration)
</script>

<style>
    .picto-container {
        margin: auto;
    }
    .picto-container :global(svg) {
        margin-bottom: 2rem;
        height: 8rem;
    }
    .isSas {
        transform: translateY(4%);
    }

    .isSas :global(button) {
        margin-top: 3.5rem;
    }
</style>

<div
    class="center"
    class:isSas
    in:fade={{ delay: 400, duration: 600 }}
    out:fade={{ duration: 600 }}>

    <div class="picto-container">
        <slot />
    </div>

    <h3>
        {@html text}
    </h3>
    {#if subText}
        <h4>
            {@html subText}
        </h4>
    {/if}
    <slot name="btn" />
</div>
