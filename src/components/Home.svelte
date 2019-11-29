<script>
    import { fade } from "svelte/transition"

    import Loader from "./Loader.svelte"
    import { xpStageIndex } from "../js/stores/xpStageStore"

    export let loadingPercentage
    export let isLoaded
</script>

<style>
    .start-button {
        border-radius: 50%;
        background: red;
        margin: auto;
        width: 5rem;
        height: 5rem;
    }
</style>

<div class="center" transition:fade>
    <Loader progress={Math.round(loadingPercentage)} />
</div>

<button
    class="start-button"
    on:click={() => xpStageIndex.setName('intro')}
    class:hidden={!isLoaded}>
    Next
</button>
{loadingPercentage}
<p class="bottom">Pour une meilleure expérience, utiliser un casque audio</p>
