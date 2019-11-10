<script>
  export let sceneManager;

  const debug = { xpStage: 2 };
</script>

<style>
  .debug-ui {
    position: fixed;
    top: 5px;
    left: 5px;
  }
</style>

<div class="debug-ui">
  <button on:click={() => sceneManager.changeXpStage('prev')}>PREV</button>
  <button on:click={() => sceneManager.changeXpStage('next')}>NEXT</button>
  <br />
  <button on:click={() => sceneManager.changeXpStage(debug.xpStage)}>
    GO TO
  </button>
  <input type="number" bind:value={debug.xpStage} min="0" max="10" />
</div>
