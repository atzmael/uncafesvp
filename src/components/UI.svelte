<script>
    import { xpStageIndex, xpStageName, startReady } from "../js/stores/xpStageStore"
    import { fade } from "svelte/transition"

    import Logo from "./Logo.svelte"
    import CafeGrainPicto from "./pictos/CafeGrain.svelte"
    import CafetierePicto from "./pictos/CafetiereItalienne.svelte"
    import TasseCeramiquePicto from "./pictos/TasseCeramique.svelte"
    import BiscuitPicto from "./pictos/Biscuit.svelte"

    import Home from "./Home.svelte"
    import TextTransition from "./TextTransition.svelte"
    import StageIndicator from "./StageIndicator.svelte"
    import ShareButtons from "./ShareButtons.svelte"
    import RecapButtons from "./RecapButtons.svelte"

    export let loadingPercentage
    export let isLoaded
</script>

<style>
    /* @font-face {
        font-family: "LouizeDisplay";
        src: url("/dist/assets/fonts/LouizeDisplay.otf") format("truetype");
    } */

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
        grid-template-rows: 0.3fr 1fr 11fr 2fr 0.3fr;
        grid-template-columns: 0.3fr 1fr 0.3fr;
    }

    /* .overlay {
        background-image: url(../../dist/assets/maps/background.jpg);
        background-size: contain;
    } */

    :global(.center) {
        grid-column: 2 / -2;
        grid-row: 3 / -3;
        display: grid;
        place-content: center center;
        text-align: center;
    }

    :global(.top) {
        grid-column: 2 / -2;
        grid-row: 2 / 3;
        display: flex;
        justify-content: center;
        text-align: center;
        height: 100%;
    }

    :global(.bottom) {
        grid-column: 2 / -2;
        grid-row: -3 / -2;
        font-size: 1.75rem;
        display: flex;
        justify-content: center;
        text-align: center;
    }

    :global(.btn-container) {
        margin-top: 75px;
    }

    .btn-start {
        opacity: 0;
        transition: opacity 0.6s;
    }
    .btn.active {
        opacity: 1;
    }
</style>

<main class:overlay={$xpStageName === 'home'}>
    {#if $xpStageName === 'home'}
        <Home {loadingPercentage} {isLoaded} />
    {:else if $xpStageName === 'intro'}
        <TextTransition
            duration={0}
            isSas={true}
            text="Et vous,<br/>quel est votre moment café ?">
            <button
                class="btn btn-start start-button"
                class:active={$startReady}
                slot="btn"
                on:click={() => xpStageIndex.setName('choice1')}>
                Continuer
            </button>
        </TextTransition>
    {:else if $xpStageName === 'transition1'}
        <TextTransition
            duration={4000}
            text="Café Moulu"
            subText="La température de l'eau est&nbsp;primordiale. <br/> La
            température idéale se situe entre 85 et 95 degrés.">
            <CafeGrainPicto />
        </TextTransition>
    {:else if $xpStageName === 'transition2'}
        <TextTransition
            duration={4000}
            text="Cafetière Italienne"
            subText="Une mouture fine permet d'obtenir un café fort en caféine et en
            goût.">
            <CafetierePicto />
        </TextTransition>
    {:else if $xpStageName === 'transition3'}
        <TextTransition
            duration={4000}
            text="Tasse en porcelaine"
            subText="Le plastique des gobelets altère le goût du café.<br/> De plus,
            la tasse c'est zéro déchet&nbsp;!">
            <TasseCeramiquePicto />
        </TextTransition>
    {:else if $xpStageName === 'transition4'}
        <TextTransition
            duration={4000}
            text="Une note sucrée"
            subText="Lorsque vous êtes au Portugal, commandez
            «&nbsp;un&nbsp;Bica&nbsp;»<br/> Votre expresso sera accompagné d'un
            pastel de nata.">
            <BiscuitPicto />
        </TextTransition>
    {:else if $xpStageName === 'break'}
        <TextTransition duration={0} text="Votre café est prêt">
            <div class="btn-inner" slot="btn">
                <RecapButtons />
            </div>
        </TextTransition>
    {:else if $xpStageName === 'climax'}
        <TextTransition duration={22500} text="" />
    {:else if $xpStageName === 'outro'}
        <TextTransition
            duration={0}
            text="Bravo, tu as réussi à prendre le temps d'apprécier ta pause café">
            <div class="btn-inner" slot="btn">
                <ShareButtons />
            </div>
        </TextTransition>
    {/if}

    {#if $xpStageName !== 'home' && $xpStageName !== 'climax'}
        <div
            class="top"
            in:fade={{ delay: 600, duration: 600 }}
            out:fade={{ duration: 600 }}>
            <Logo />
        </div>
    {/if}

    {#if $xpStageIndex > 1 && $xpStageName !== 'climax' && $xpStageName !== 'outro' && $xpStageName !== 'break'}
        <StageIndicator />
    {/if}
</main>
