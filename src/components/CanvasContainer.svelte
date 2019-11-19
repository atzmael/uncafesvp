<script>
  import { onMount, onDestroy } from "svelte";
  import onAnimationFrame from "../js/onAnimationFrame.js";
  import onWindowResize from "../js/onWindowResize.js";

  import { time } from "../js/stores/timeStore";

  import SceneManager from "../js/three/SceneManager.js";

  export let assets;
  export let currentXpStage;

  let canvas;
  let sceneManager;
  let userInteracted = false;

  $: if (assets.length > 0 && userInteracted) {
    sceneManager.updateAssets(assets);
  }

  onMount(() => {
    sceneManager = SceneManager(canvas);
    sceneManager.onCanvasResize();

    onAnimationFrame(() => {
      sceneManager.update($time);
    });

    onWindowResize(() => {
      sceneManager.onCanvasResize();
    });
  });
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
  video {
    display: none;
  }
</style>

<button on:click={() => (userInteracted = true)}>INTERACT WITH ME</button>

<div class="canvas-container">
  <canvas bind:this={canvas} />
</div>
