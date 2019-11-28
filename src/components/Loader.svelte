<script>
    export let progress
</script>

<style>
    .container {
        width: 30%;
        max-width: 600px;
    }

    img {
        width: 100%;
    }
    .coffee-color {
        width: 100%;
        height: 100%;
        background: rgb(35, 17, 2);
    }
</style>

<div class="container">
    <img alt="Pause café" src="/assets/ui/mask.png" />
    <div class="coffee-color" style="transform: translateY({100 - progress}%)" />
</div>
