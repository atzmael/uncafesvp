<script>
    import { fade } from "svelte/transition"
    import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore"

    import CafeGrainPicto from "./pictos/CafeGrain.svelte"
    import CafetierePicto from "./pictos/CafetiereItalienne.svelte"
    import TasseCeramiquePicto from "./pictos/TasseCeramique.svelte"
    import BiscuitPicto from "./pictos/Biscuit.svelte"
</script>

<style>
    .stage-indicator {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc((300px + 25vw) / 2);
        margin: auto;
    }

    .container {
        border-radius: 50%;
        box-shadow: 0px 0px 0.5px 2.5px var(--color-brown);
        transition: all 0.5s;
        width: 25px;
        height: 25px;
        display: grid;
        place-items: center center;
    }

    .container :global(svg) {
        width: 70%;
        min-height: 0;
        height: 70%;
        opacity: 0;
        transition: all 0.8s 0.5s;
    }

    .active {
        transform: scale(2.5);
        box-shadow: 0px 0px 0.5px 1px var(--color-brown);
    }
    .selected {
        transform: scale(2.5);
        box-shadow: 0px 0px 0.5px 1px var(--color-brown);
        pointer-events: auto;
        cursor: pointer;
    }
    .selected :global(svg) {
        opacity: 1;
    }
</style>

<div
    class="stage-indicator bottom"
    in:fade={{ delay: 600, duration: 600 }}
    out:fade={{ duration: 600 }}>
    <div
        class="container"
        class:active={$xpStageName == 'choice1'}
        class:selected={$xpStageIndex > 2}
        on:click={() => xpStageIndex.setName('choice1')}>
        <CafeGrainPicto />
    </div>
    <div
        class="container"
        class:active={$xpStageName == 'choice2'}
        class:selected={$xpStageIndex > 4}
        on:click={() => xpStageIndex.setName('choice2')}>
        <CafetierePicto />
    </div>
    <div
        class="container"
        class:active={$xpStageName == 'choice3'}
        on:click={() => xpStageIndex.setName('choice3')}
        class:selected={$xpStageIndex > 6}>
        <TasseCeramiquePicto />
    </div>
    <div
        class="container"
        class:active={$xpStageName == 'choice4'}
        class:selected={$xpStageIndex > 8}
        on:click={() => xpStageIndex.setName('choice4')}>
        <BiscuitPicto />
    </div>
</div>
