<script>
    import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore"
    import { fade } from "svelte/transition"

    import Logo from "./Logo.svelte"

    import Home from "./Home.svelte"
    import TextTransition from "./TextTransition.svelte"
    import StageIndicator from "./StageIndicator.svelte"

    export let loadingPercentage
    export let isLoaded
</script>

<style>
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
        grid-template-rows: 0.3fr 5fr 1fr 0.3fr;
        grid-template-columns: 0.3fr 1fr 0.3fr;
    }

    :global(button) {
        pointer-events: auto;
        cursor: pointer;
        transition: all 0.5s;
        visibility: visible;
        opacity: 1;
    }

    .previous-arrow {
        position: absolute;
        bottom: 20px;
        left: 20px;
    }
    :global(.center) {
        grid-column: 2 / -2;
        grid-row: 2 / -3;
        display: grid;
        place-content: center center;
        text-align: center;
    }
    :global(.bottom) {
        grid-column: 2 / -2;
        grid-row: -3 / -2;
        display: flex;
        justify-content: center;
        text-align: center;
    }
</style>

<main class:overlay={$xpStageName === 'home'}>
    {#if $xpStageName === 'home'}
        <Home {loadingPercentage} {isLoaded} />
    {:else if $xpStageName === 'intro'}
        <TextTransition
            duration={2000}
            text="Et vous,<br/>quel est votre moment café ?" />
    {:else if $xpStageName === 'transition1'}
        <TextTransition
            duration={2000}
            text="Café Moulu"
            subText="La température de l'eau est&nbsp;primordiale. <br/> La
            température idéale se situe entre 85 et 95 degrés." />
    {:else if $xpStageName === 'transition2'}
        <TextTransition
            duration={2000}
            text="Cafetière Italienne"
            subText="Une mouture fine permet d'obtenir un café fort en caféine et en
            goût." />
    {:else if $xpStageName === 'transition3'}
        <TextTransition
            duration={2000}
            text="Tasse en porcelaine"
            subText="Le plastique des gobelets altère le goût du café.<br/> De plus,
            la tasse c'est zéro déchet&nbsp;!" />
    {:else if $xpStageName === 'transition4'}
        <TextTransition
            duration={2000}
            text="Une note sucrée"
            subText="Lorsque vous êtes au Portugal, commandez
            «&nbsp;un&nbsp;Bica&nbsp;»<br/> Votre expresso sera accompagné d'un
            pastel de nata." />
    {:else if $xpStageName === 'break'}
        <TextTransition duration={2000} text="Votre café est prêt" />
    {/if}

    {#if $xpStageName !== 'home'}
        <Logo />
    {/if}

    {#if $xpStageName === 'choice2' || $xpStageName === 'choice3' || $xpStageName === 'choice4'}
        <button
            on:click={() => xpStageIndex.setIndex($xpStageIndex - 2)}
            class="previous-arrow">
            ⬅ ⬅ ⬅
        </button>
    {/if}

    {#if $xpStageIndex > 1}
        <StageIndicator />
    {/if}
</main>
