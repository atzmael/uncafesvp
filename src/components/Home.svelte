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
        background: transparent;
        box-shadow: 0px 0px 0.5px 2.5px var(--color-brown);
        border: none;
        margin: auto;
        margin-top: 4rem;
        padding: 0 3rem;
        border-radius: 2.5rem;
        height: 2.5rem;
        transition: all 0.4s;
    }

    .start-button:hover {
        color: white;
        background: var(--color-brown);
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
    <Loader progress={Math.round(loadingPercentage)} />
    <button
        class="start-button"
        on:click={() => xpStageIndex.setName('intro')}
        class:hidden={!isLoaded}>
        Next
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
