<script>
  export let text;

  const log = () => {
    console.log("coucou");
  };
</script>

<button on:click={log}>{text}</button>
