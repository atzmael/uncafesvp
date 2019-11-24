<script>
  import { onMount } from "svelte";
  import AssetLoader from "./js/AssetLoader.js";
  import SmartLoader from "./js/three/loaders/SmartLoader.js";
  import * as THREE from "three";

  import Debugger from "./components/Debugger.svelte";
  import UI from "./components/UI.svelte";
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
    assets: [],
    items: []
    //...
  };
  let loadingPercentage = 0;
  let isLoaded = false;

  // TODO:??? use async (check Promises inside AssetLoader.js and 'Promise loading with Three.js' article)
  // Or : https://blackthread.io/blog/promisifying-threejs-loaders/
  const loadData = () => {
    const loadingManager = new THREE.LoadingManager(
      //onLoaded for all loaders
      () => (isLoaded = true),
      //onProgress for all loaders
      (url, loadedQtty, totalToLoad) => {
        loadingPercentage = (loadedQtty / totalToLoad) * 100;
      },
      //onError for all loaders
      undefined
    );
    loadAssets(loadingManager);
    loadItems(data.items, loadingManager);
  };

  const loadAssets = loadingManager => {
    const assetLoader = AssetLoader(loadingManager);
    assetLoader.load("/assets/maps/TiledWaterColor_placeholder.png", "maptest");
    // assetLoader.load("/assets/3D/vertical_placeholder.glb", "modeltest");
    // assetLoader.load("/assets/sound/piste1.mp3", "sound_test");
    assetLoader.onComplete(assets => {
      loadedData["assets"].push(...assets);
    });
  };

  const loadItems = (itemsData, loadingManager) => {
    itemsData.forEach((itemData, indx) => {
      const itemLoader = AssetLoader(loadingManager);
      itemLoader.load(itemData.modelPath, `${itemData.name}Model`);
      itemLoader.load(itemData.animPath, `${itemData.name}Anim`);
      itemLoader.load(itemData.soundPath, `${itemData.name}Sound`);

      itemLoader.onComplete(returnedArray => {
        const item = Object.assign(itemData, {
          model: returnedArray.find(x => x.name === `${itemData.name}Model`),
          anim: returnedArray.find(x => x.name === `${itemData.name}Anim`)
        });
        loadedData["items"].push(item);
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
    const smartLoader = SmartLoader();
    smartLoader.load("/assets/maps/TiledWaterColor_placeholder.png", "name1");
    smartLoader.load("/assets/3D/lait.glb", "name2");
    smartLoader.load({ type: "model", path: "/assets/3D/lait.glb" }, "name3");
  });
</script>

{#if isDebugging}
  <Debugger />
{/if}
<UI {loadingPercentage} {isLoaded} />
<CanvasContainer {loadedData} {isLoaded} />
