<script>
  import { onMount, onDestroy } from "svelte";
  import onWindowResize from "../js/onWindowResize.js";

  import EntryPoint from "../js/three/EntryPoint.js";

  export let assets;

  let canvas;
  let entryPoint;

  onMount(() => {
    entryPoint = EntryPoint(canvas);
    entryPoint.onWindowResize();
  });

  onWindowResize(() => {
    entryPoint.onWindowResize();
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
