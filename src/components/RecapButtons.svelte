<script>
    import {xpStageIndex, coffeeReady} from "../js/stores/xpStageStore"
</script>

<style>
    .no-border {
        border: none;
    }

    .recap-buttons {
        opacity: 0;
        transition: opacity 0.6s;
    }

    .recap-buttons.active {
        opacity: 1;
    }
</style>

<div class="recap-buttons" class:active={$coffeeReady}>
    <div class="recap-buttons_inner">
        <button class="btn" on:click={() => xpStageIndex.setName('climax')}>Prendre ma pause</button>
        <button class="no-border btn">Modifier mon café</button>
    </div>
</div>
