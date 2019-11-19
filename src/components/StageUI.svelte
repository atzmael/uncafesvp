<script>
  import { xpStageIndex, xpStageName } from "../js/stores/xpStageStore";
  export let currentXpStage;
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
</style>

{#if $xpStageName === 'home'}
  <main>
    <p>This is the homepage</p>
    <button on:click={xpStageIndex.next}>Next</button>
  </main>
{/if}
