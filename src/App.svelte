<script>
  import { onMount } from "svelte";
  import AssetLoader from "./js/AssetLoader.js";

  import Debugger from "./components/Debugger.svelte";
  import CanvasContainer from "./components/CanvasContainer.svelte";

  const isDebugging = true;

  let loadedAssets = {};

  // TODO: do a proper XpStageManager
  // maybe do it in a store ? (check svelte doc for stores)
  let xpStageManager = {
    currentIndx: 0,
    current: "",
    list: [
      "home",
      "intro",
      "choice1",
      "choice2",
      "choice3",
      "break",
      "climax",
      "outro"
    ]
  };

  const handleChangeXpStage = e => {
    if (e.detail.stage == "next")
      xpStageManager.currentIndx = Math.min(
        xpStageManager.currentIndx + 1,
        xpStageManager.list.length - 1
      );
    else if (e.detail.stage == "prev")
      xpStageManager.currentIndx = Math.max(xpStageManager.currentIndx - 1, 0);
    else if (typeof e.detail.stage == "number")
      xpStageManager.currentIndx = Math.max(e.detail.stage, 0);
    else throw `Could not changeXpStage to ${e.detail.stage}`;
    console.log("currentXpStageIndx : ", xpStageManager.currentIndx);
  };

  onMount(() => {
    loadAssets();
  });

  const loadAssets = () => {
    const loader = AssetLoader();
    // loader.load("/assets/3D/vertical_placeholder.glb", "modeltest");
    loader.load("/assets/3D/gobelet_carton.glb", "gobelet");
    loader.load("/assets/3D/lait.glb", "lait");
    loader.load("/assets/maps/test.jpg", "maptest");
    // TODO: onLoading(() => {}) to display loading state to user
    loader.onComplete(assets => (loadedAssets = assets));
  };
</script>

<!-- TODO: <Loader/> to display loading state to user -->
{#if isDebugging}
  <Debugger
    on:emitNewXpStage={handleChangeXpStage}
    currentXpStage={xpStageManager.currentIndx} />
{/if}
<CanvasContainer
  assets={loadedAssets}
  currentXpStage={xpStageManager.currentIndx} />
