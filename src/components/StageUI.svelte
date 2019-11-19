<script>
  import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore";
  import { fade } from "svelte/transition";

  export let currentXpStage;
  export let isLoadingFinished;
</script>

<style>
  main {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    place-content: center center;
    color: white;

    background: rgba(127, 127, 127, 0.7);
    font-weight: bold;
  }

  button {
    cursor: pointer;
    transition: all 0.5s;
    visibility: hidden;
    opacity: 0;
  }
  .active {
    visibility: visible;
    opacity: 1;
  }
</style>

{#if $xpStageName === 'home'}
  <!-- TODO: Make a custom transition ("fade" is built-in svelte) -->
  <main transition:fade>
    <p>This is the homepage</p>
    <button on:click={xpStageIndex.next} class:active={isLoadingFinished}>
      Next
    </button>
  </main>
{/if}
