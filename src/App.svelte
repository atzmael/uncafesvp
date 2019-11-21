<script>
  import { onMount } from "svelte";
  import AssetLoader from "./js/AssetLoader.js";

  import Debugger from "./components/Debugger.svelte";
  import StageUI from "./components/StageUI.svelte";
  import CanvasContainer from "./components/CanvasContainer.svelte";

  import {
    xpStageIndex,
    xpStageName,
    didUserInteract
  } from "./js/stores/xpStageStore.js";

  // TODO: use store for debugging variables ?
  const isDebugging = true;

  let loadedAssets = [];
  let isLoadingFinished = false;
  // TODO: use a store (one source of truth for all assets) ?
  const loadAssets = () => {
    const loader = AssetLoader();
    // loader.load("/assets/3D/vertical_placeholder.glb", "modeltest");
    loader.load("/assets/3D/gobelet_carton.glb", "gobelet");
    loader.load("/assets/3D/lait.glb", "lait");
    loader.load("/assets/animations/sequence-png-12fps-720x1080.mp4", "anim");
    loader.load("/assets/maps/TiledWaterColor_placeholder.png", "maptest");
    loader.load("/assets/sound/piste1.mp3", "sound_test");
    // TODO: onLoading(() => {}) to display loading state to user
    // =>  see THREE.LoadingManager in the documentation ?
    loader.onComplete(assets => {
      loadedAssets = assets;
      isLoadingFinished = true;
    });
  };

  const userInteracted = () => {
    didUserInteract.set(true);
    document.removeEventListener("click", userInteracted);
  };

  onMount(() => {
    document.addEventListener("click", userInteracted);
    loadAssets();
  });
</script>

<!-- TODO: <Loader/> to display loading state to user -->
{#if isDebugging}
  <Debugger />
{/if}
<StageUI {isLoadingFinished} />
<CanvasContainer assets={loadedAssets} />
