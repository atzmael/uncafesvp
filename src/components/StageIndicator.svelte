<script>
    import { fade } from "svelte/transition"
    import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore"
</script>

<style>
    .stage-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        position:relative;
        z-index: 999;
    }

    [class*="step"],
    .home {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s;
    }

    [class*="step"] {
        cursor: pointer;
    }

    [class*="step"] .inner-step {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        position: relative;
    }

    [class*="step"] .inner-step::before {
        content: "";
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        top: 30%;
        left: 70%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease-in;
        position: absolute;
    }

    [class*="step"] .inner-step::after {
        content: "";
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 1px solid rgb(188, 132, 89);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease-in;
        position: absolute;
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

<div class="stage-indicator bottom" transition:fade>
    <div class="home">
        <img src="test.svg" alt=" " />
    </div>
    <div class="separator" />
    <div
        class="step1"
        class:active={$xpStageName == 'choice1'}
        class:selected={$xpStageIndex > 2}
        on:click={() => xpStageIndex.setName('choice1')}
    >
        <div class="inner-step" />
    </div>
    <div class="separator" />
    <div
        class="step2"
        class:active={$xpStageName == 'choice2'}
        class:selected={$xpStageIndex > 4}
        on:click={() => xpStageIndex.setName('choice2')}
    >
        <div class="inner-step" />
    </div>
    <div class="separator" />
    <div
        class="step3"
        class:active={$xpStageName == 'choice3'}
        class:selected={$xpStageIndex > 6}
        on:click={() => xpStageIndex.setName('choice3')}
    >
        <div class="inner-step" />
    </div>
    <div class="separator" />
    <div
        class="step4"
        class:active={$xpStageName == 'choice4'}
        class:selected={$xpStageIndex > 8}
        on:click={() => xpStageIndex.setName('choice4')}
    >
        <div class="inner-step" />
    </div>
</div>
