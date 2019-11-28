<script>
    export let progress
</script>

<style>
    .container {
        position: relative;
        width: 30vw;
        height: 30vw;
        max-width: 600px;
        overflow: hidden;
    }

    img {
        position: absolute;
        width: 100%;
        opacity: 0.5;
    }
    .coffee-color {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgb(35, 17, 2);
    }
</style>

<div class="container">
    <div class="coffee-color" style="transform: translateY({100 - progress}%)" />
    <img alt="Pause café" src="/assets/ui/mask.png" />
</div>
