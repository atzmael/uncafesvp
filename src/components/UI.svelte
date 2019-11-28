<script>
    import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore"
    import { fade } from "svelte/transition"

    import Loader from "./Loader.svelte"

    export let loadingPercentage
    export let isLoaded
</script>

<style>
    /* TODO: use display:grid for all the layouts */
    main {
        pointer-events: none;
        color: rgb(38, 21, 6);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: grid;
        place-content: center center;
    }
    .overlay {
        background: lemonchiffon;
    }
    button {
        pointer-events: auto;
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

<main>
    {#if $xpStageName === 'home'}
        <div transition:fade class="overlay">
            <p>This is the homepage</p>
            <Loader progress={Math.round(loadingPercentage)} />
            {loadingPercentage}
            <button
                on:click={() => xpStageIndex.setName('intro')}
                class:hidden={!isLoaded}>
                Next
            </button>
        </div>
    {:else if $xpStageName === 'intro'}
        <div transition:fade class="overlay">
            <div>THIS IS THE INTRO</div>
            <button on:click={() => xpStageIndex.setName('choice1')}>Begin</button>
        </div>
    {:else if $xpStageName === 'transition1'}
        <div class="overlay">Impressive</div>
    {:else if $xpStageName === 'transition2'}
        <div class="overlay">Amazing</div>
    {:else if $xpStageName === 'transition3'}
        <div class="overlay">Spetacular</div>
    {/if}

    {#if $xpStageName === 'choice2' || $xpStageName === 'choice3' || $xpStageName === 'choice4'}
        <button
            on:click={() => xpStageIndex.setIndex($xpStageIndex - 2)}
            class="previous-arrow">
            ⬅ ⬅ ⬅
        </button>
    {/if}

    {#if $xpStageIndex > 1}
        <div class="stage-indactor">O --- O --- O --- O</div>
    {/if}
</main>
