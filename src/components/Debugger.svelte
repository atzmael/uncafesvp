<script>
    import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore.js"
</script>

<style>
    .debug-ui {
        position: fixed;
        top: 50px;
        left: 5px;
        z-index: 9999;
    }
    .info-text {
        color: black;
        background: rgba(255, 255, 255, 0.5);
        padding: 0.2em;
    }
</style>

<div class="debug-ui">
    <button on:click={xpStageIndex.previous}>PREV</button>
    <button on:click={xpStageIndex.next}>NEXT</button>
    <p class="info-text">Current XP stage : {$xpStageIndex}, {$xpStageName}</p>
    <button on:click={xpStageIndex.reset}>RESET</button>
</div>
