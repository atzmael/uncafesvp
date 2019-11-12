<script>
  import Button from "./components/Button.svelte";
  import CanvasContainer from "./components/CanvasContainer.svelte";
  export let name;
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {name}!</h1>
<Button />
<CanvasContainer />