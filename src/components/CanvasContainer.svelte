<script>
  import { onMount, onDestroy } from "svelte";
  import onWindowResize from "../js/onWindowResize.js";

  import SceneManager from "../js/three/SceneManager.js";

  export let assets;

  const isDebugging = true;

  let canvas;
  let sceneManager;

  onMount(() => {
    sceneManager = SceneManager(canvas);
    sceneManager.onCanvasResize();
  });

  onWindowResize(() => {
    sceneManager.onCanvasResize();
  });

  const nextHandle = () => {
    sceneManager.nextXpStage();
  };
  const previousHandle = () => {
    sceneManager.previousXpStage();
  };
</script>

<style>
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  .canvas-container {
    width: 100%;
  }
</style>

{#if isDebugging}
  <button on:click={previousHandle}>PREVIOUS</button>
  <button on:click={nextHandle}>NEXT</button>
{/if}

<div class={`canvas-container`}>
  <canvas bind:this={canvas} />
</div>
