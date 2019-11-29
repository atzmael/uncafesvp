<script>
    import {xpStageIndex, xpStageName} from "../js/stores/xpStageStore"
    import {fade} from "svelte/transition"

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

    .stage-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: 50px;
        position: absolute;
    }

    [class*="step"], .home {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s;
    }

    [class*="step"] .inner-step {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        position:relative;
    }

    [class*="step"] .inner-step::before {
        content:"";
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        top: 30%;
        left: 70%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease-in;
        position:absolute;
    }

    [class*="step"] .inner-step::after {
        content:"";
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease-in;
        position:absolute;
    }

    [class*="step"].active .inner-step {
        background-color: rgb(196, 80, 37);
        border-color: rgb(196, 80, 37);
    }

    [class*="step"].selected .inner-step::before,
    [class*="step"].selected .inner-step::after {
        transform: translate(-50%, -50%) scale(1);
    }

    [class*="step"].selected {
        width: 23px;
        height: 23px;
    }

    .separator {
        height: 2px;
        width: 40px;
        background-color: rgb(188, 132, 89);
        margin-left: 5px;
        margin-right: 5px;
    }
</style>

<main>
    {#if $xpStageName === 'home'}
        <div transition:fade class="overlay">
            <p>This is the homepage</p>
            <Loader progress={Math.round(loadingPercentage)}/>
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
        <div class="stage-indicator">
            <div class="home"><img src="test.svg" alt=" "></div>
            <div class="separator"></div>
            <div class="step1" class:active="{$xpStageName == 'choice1'}" class:selected="{$xpStageIndex > 2}"><div class="inner-step"></div></div>
            <div class="separator"></div>
            <div class="step2" class:active="{$xpStageName == 'choice2'}" class:selected="{$xpStageIndex > 4}"><div class="inner-step"></div></div>
            <div class="separator"></div>
            <div class="step3" class:active="{$xpStageName == 'choice3'}" class:selected="{$xpStageIndex > 6}"><div class="inner-step"></div></div>
            <div class="separator"></div>
            <div class="step4" class:active="{$xpStageName == 'choice4'}" class:selected="{$xpStageIndex > 8}"><div class="inner-step"></div></div>
        </div>
    {/if}
</main>
