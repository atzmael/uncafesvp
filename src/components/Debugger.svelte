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
  <p>Current XP stage : {currentXpStage}</p>
</div>
