<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import onWindowResize from "../js/onWindowResize.js";

  import SceneManager from "../js/three/SceneManager.js";

  export let assets;
  export let currentXpStage;

  let canvas;
  let sceneManager;

  afterUpdate(() => {
    if (Object.keys(assets).length > 0) {
      sceneManager.updateAssets(assets);
    }
  });

  onMount(() => {
    sceneManager = SceneManager(canvas);
    sceneManager.onCanvasResize();
  });

  onWindowResize(() => {
    sceneManager.onCanvasResize();
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
</style>

<div class={`canvas-container`}>
  <canvas bind:this={canvas} />
</div>
