<script>
    import { fade } from "svelte/transition"

    import delayBeforeNextStep from "../js/utils/delayBeforeNextStep"

    export let text
    export let subText = ""
    export let duration

    // delayBeforeNextStep(duration)
</script>

<style>
    .picto-container {
        height: 8rem;
        margin: auto;
        margin-bottom: 2rem;
    }
    .picto-container :global(svg) {
        height: 100%;
    }
</style>

<div transition:fade class="center">
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
</div>
