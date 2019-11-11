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
  .info-text {
    color: black;
    background: rgba(255, 255, 255, 0.5);
    padding: 0.2em;
  }
</style>

<div class="debug-ui">
  <button on:click={() => emitNewXpStage('prev')}>PREV</button>
  <button on:click={() => emitNewXpStage('next')}>NEXT</button>
  <p class="info-text">Current XP stage : {currentXpStage}</p>
</div>
