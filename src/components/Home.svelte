<script>
    import { fade } from "svelte/transition"

    import Loader from "./Loader.svelte"
    import { xpStageIndex } from "../js/stores/xpStageStore"

    export let loadingPercentage
    let isButtonVisible = false
</script>

<style>
    .infront {
        z-index: 9999;
    }

    #headphones {
        height: 1.5em;
        margin-left: 0.7em;
        transform: translateY(-25%);
    }
</style>

<div
    class="center infront"
    in:fade={{ delay: 600, duration: 600 }}
    out:fade={{ duration: 600 }}>
    <Loader
        progress={Math.round(loadingPercentage)}
        on:loaded={() => (isButtonVisible = true)} />
    <button
        class="start-button"
        on:click={() => xpStageIndex.setName('intro')}
        class:hidden={!isButtonVisible}>
        Commencer
    </button>
    <!-- {loadingPercentage} -->
</div>

<p
    class="bottom infront"
    in:fade={{ delay: 600, duration: 600 }}
    out:fade={{ duration: 600 }}>
    Pour une meilleure expérience, utiliser un casque audio
    <img id="headphones" alt="headphones" src="./assets/ui/headphones.png" />
</p>

<div
    in:fade={{ delay: 600, duration: 600 }}
    out:fade={{ duration: 600 }}
    style={`
    background: url(./assets/maps/background.jpg);
    background-size: cover;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 0;
    `} />
