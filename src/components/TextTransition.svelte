<script>
    import { fade } from "svelte/transition"

    import delayBeforeNextStep from "../js/utils/delayBeforeNextStep"

    export let text
    export let subText = ""
    export let duration

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
</style>

<div
    class="center"
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
    <div class="btn-container">
        <slot name="btn" />
    </div>
</div>
