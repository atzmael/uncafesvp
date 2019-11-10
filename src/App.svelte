<script>
  import { onMount } from "svelte";
  import AssetLoader from "./js/AssetLoader.js";

  import CanvasContainer from "./components/CanvasContainer.svelte";

  let loadedAssets = {};

  onMount(() => {
    loadAssets();
  });

  const loadAssets = () => {
    const loader = AssetLoader();
    loader.load("/assets/3D/vertical_placeholder.glb", "modeltest", ["scene"]);
    loader.load("/assets/maps/test.jpg", "maptest");
    loader.onComplete(a => (loadedAssets = a));
  };
</script>

<CanvasContainer assets={loadedAssets} />
