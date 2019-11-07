<script>
  import { onMount } from "svelte";
  import EntryPoint from "../js/three/EntryPoint.js";

  let canvas;

  onMount(() => {
    const entryPoint = EntryPoint(canvas);
  });
</script>

<canvas bind:this={canvas} />
