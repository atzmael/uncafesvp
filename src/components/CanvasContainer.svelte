<script>
  import { onMount, onDestroy } from "svelte";
  import onWindowResize from "../js/onWindowResize.js";

  import SceneManager from "../js/three/SceneManager.js";

  export let assets;

  let canvas;
  let sceneManager;

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
