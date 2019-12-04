<script>
    import { xpStageIndex, coffeeReady } from "../js/stores/xpStageStore"
</script>

<style>
    .btn {
        margin-top: 4rem;
    }
    .no-border {
        margin-top: 1.5rem;
        box-shadow: none;
    }

    .no-border:hover {
        background: transparent;
        color: var(--color-brown);
    }

    .recap-buttons {
        opacity: 0;
        transition: opacity 0.6s;
    }

    .recap-buttons_inner {
        display: flex;
        flex-direction: column;
    }

    .recap-buttons.active {
        opacity: 1;
    }
</style>

<div class="recap-buttons" class:active={$coffeeReady}>
    <div class="recap-buttons_inner">
        <button class="btn" on:click={() => xpStageIndex.setName('climax')}>
            Prendre ma pause
        </button>
        <button
            class="no-border btn"
            on:click={() => xpStageIndex.setName('choice1')}>
            Refaire mon café
        </button>
    </div>
</div>
