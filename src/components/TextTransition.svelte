<script>
    import { fade } from "svelte/transition"

    import delayBeforeNextStep from "../js/utils/delayBeforeNextStep"

    export let text
    export let subText = ""
    export let duration

    delayBeforeNextStep(duration)
</script>

<div transition:fade class="center">
    <h3>
        {@html text}
    </h3>
    {#if subText}
        <h4>
            {@html subText}
        </h4>
    {/if}
</div>
