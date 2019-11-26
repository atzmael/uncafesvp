<script>
    import { xpStageIndex, xpStageName } from '../js/stores/xpStageStore'
    import { fade } from 'svelte/transition'

    export let loadingPercentage
    export let isLoaded
</script>

<style>
    /* TODO: use display:grid for all the layouts */
    main {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: grid;
        place-content: center center;
        color: white;

        background: rgba(127, 127, 127, 0.7);
        font-weight: bold;
    }

    button {
        cursor: pointer;
        transition: all 0.5s;
        visibility: visible;
        opacity: 1;
    }
    .hidden {
        visibility: hidden;
        opacity: 0;
    }
    .previous-arrow {
        position: absolute;
        bottom: 20px;
        left: 20px;
    }
</style>

{#if $xpStageName === 'home'}
    <!-- TODO: Make a custom transition ("fade" is built-in svelte) -->
    <main transition:fade>
        <!-- TODO: Loader ui -->
        <p>This is the homepage</p>
        <div>Loading: {Math.round(loadingPercentage)}%</div>
        <button on:click={xpStageIndex.next} class:hidden={!isLoaded}>Next</button>
    </main>
{:else}
    <button on:click={xpStageIndex.previous} class="previous-arrow">⬅ ⬅ ⬅</button>
{/if}
