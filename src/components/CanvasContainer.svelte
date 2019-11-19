<script>
  import { onMount, onDestroy } from "svelte";
  import onAnimationFrame from "../js/onAnimationFrame.js";
  import onWindowResize from "../js/onWindowResize.js";

  import { time } from "../js/stores/timeStore";
  import { didUserInteract } from "../js/stores/xpStageStore";

  import SceneManager from "../js/three/SceneManager.js";

  export let assets;
  export let currentXpStage;

  let canvas;
  let sceneManager;

  // TODO: remove didUserInteract from here, and use it only in threejs code to check if we can play the <video> / <audio>
  $: if (assets.length > 0 && $didUserInteract) {
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

<div class="canvas-container">
  <canvas bind:this={canvas} />
</div>
