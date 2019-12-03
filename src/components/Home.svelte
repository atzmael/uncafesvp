<script>
    import { fade } from "svelte/transition"

    import Loader from "./Loader.svelte"
    import { xpStageIndex } from "../js/stores/xpStageStore"

    export let loadingPercentage
    export let isLoaded
</script>

<style>
    .infront {
        z-index: 9999;
    }
    .start-button {
        border-radius: 50%;
        background: red;
        margin: auto;
        width: 5rem;
        height: 5rem;
    }
</style>

<div class="center infront" transition:fade>
    <Loader progress={Math.round(loadingPercentage)} />
    <button
        class="start-button"
        on:click={() => xpStageIndex.setName('intro')}
        class:hidden={!isLoaded}>
        Next
    </button>
    {loadingPercentage}
</div>

<p class="bottom infront" transition:fade>
    Pour une meilleure expérience, utiliser un casque audio
</p>

<div
    transition:fade
    style={`
    background: url(./assets/maps/background.jpg);
    background-size: cover;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 0;
    `} />
