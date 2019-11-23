<script>
  import { onMount } from "svelte";
  import AssetLoader from "./js/AssetLoader.js";

  import Debugger from "./components/Debugger.svelte";
  import StageUI from "./components/StageUI.svelte";
  import CanvasContainer from "./components/CanvasContainer.svelte";

  import data from "./data.json";
  import {
    xpStageIndex,
    xpStageName,
    didUserInteract
  } from "./js/stores/xpStageStore.js";

  // TODO: use store for debugging variables ?
  const isDebugging = true;

  const loadedData = {
    assets: new Set(),
    items: new Set()
    //...
  };
  let didAssetsLoad = false;
  let didItemsLoad = false;
  // TODO: onLoading(() => {}) to display loading state to user
  // =>  see THREE.LoadingManager in the documentation ?

  // TODO: use async (check Promise loading with Three.js article)
  const loadData = () => {
    loadAssets();
    loadItems(data.items);
  };

  const loadAssets = () => {
    const assetLoader = AssetLoader();
    // assetLoader.load("/assets/3D/vertical_placeholder.glb", "modeltest");
    assetLoader.load("/assets/maps/TiledWaterColor_placeholder.png", "maptest");
    // assetLoader.load("/assets/sound/piste1.mp3", "sound_test");

    assetLoader.onComplete(assets => {
      loadedData["assets"].add(...assets);
      didAssetsLoad = true;
    });
  };
  const loadItems = itemsData => {
    const itemsDidLoad = Array(itemsData.length - 1).fill(false);

    itemsData.forEach((itemData, indx) => {
      const itemLoader = AssetLoader();
      itemLoader.load(itemData.modelPath, `${itemData.name}Model`);
      itemLoader.load(itemData.animPath, `${itemData.name}Anim`);
      itemLoader.load(itemData.soundPath, `${itemData.name}Sound`);

      itemLoader.onComplete(returnedArray => {
        const item = Object.assign(itemData, {
          model: returnedArray.find(x => x.name === `${itemData.name}Model`),
          anim: returnedArray.find(x => x.name === `${itemData.name}Anim`)
        });
        loadedData["items"].add(item);
        itemsDidLoad[indx] = true;
        if (itemsDidLoad.every(b => b === true)) {
          didItemsLoad = true;
        }
      });
    });
  };

  const userInteracted = () => {
    didUserInteract.set(true); // write in store
    document.removeEventListener("click", userInteracted);
  };

  onMount(() => {
    document.addEventListener("click", userInteracted);
    loadData();
  });
</script>

<!-- TODO: <Loader/> to display loading state to user -->
{#if isDebugging}
  <Debugger />
{/if}
<StageUI isLoaded={didAssetsLoad && didItemsLoad} />
<CanvasContainer {loadedData} isLoaded={didAssetsLoad && didItemsLoad} />
