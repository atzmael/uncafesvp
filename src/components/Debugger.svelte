<script>
  import { createEventDispatcher } from "svelte";

  export let currentXpStage;

  let dispatch = createEventDispatcher();

  const emitNewXpStage = (stage = "next") => {
    dispatch("emitNewXpStage", { stage });
  };
</script>

<style>
  .debug-ui {
    position: fixed;
    top: 5px;
    left: 5px;
  }
</style>

<div class="debug-ui">
  <button on:click={() => emitNewXpStage('prev')}>PREV</button>
  <button on:click={() => emitNewXpStage('next')}>NEXT</button>
  <br />
  <button on:click={() => emitNewXpStage(currentXpStage)}>GO TO</button>
  <input type="number" value={currentXpStage} min="0" max="10" />
</div>
