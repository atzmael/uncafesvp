<script>
    export let progress
</script>

<style>
    .mask {
        position: relative;
        width: 30vw;
        max-width: 600px;
        height: 50vw;
        overflow: hidden;
    }
    .coffee-progress {
    }
    svg {
        position: relative;
        width: 200%;
    }
    #logo-mask {
        fill: white;
        position: absolute;
    }
    #liquid {
        /* animation: waterSlide 1s infinite linear; */
        fill: rgb(35, 17, 2);
    }
    /* @keyframes waterSlide {
        0% {
            transform: translateX(-50%);
        }
        100% {
            transform: translateX(0);
        }
    }
    @keyframes waterClimb {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(-70px);
        }
    } */

    svg {
        z-index: 999;
        position: relative;
    }
    #bowl {
        fill: white;
    }

    #clipPath {
        -webkit-animation: waterClimb 9s linear 1;
        transform: translateY(-110px);
    }
    #clippingPath {
        -webkit-animation: waterSlide 1.1s infinite linear;
    }

    @-webkit-keyframes waterSlide {
        0% {
            transform: translateX(126px);
        }
        100% {
            transform: translateX(-273px);
        }
    }

    @-webkit-keyframes waterClimb {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(-70px);
        }
    }
</style>

<div class="mask">
    <!-- <div class="coffee-color" style="transform: translateY({100 - progress}%)" /> -->
    <div class="coffee-progress">
        <svg
            width="400"
            height="400"
            viewPort="0 0 400 400"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <path
                id="bowl"
                fill-rule="evenodd"
                fill="rgb( 10, 10, 10 )"
                d="M194.115,136.050 C234.545,136.050 267.321,168.722 267.321,209.025
                C267.321,249.328 234.545,282.000 194.115,282.000 C153.684,282.000
                120.909,249.328 120.909,209.025 C120.909,168.722 153.684,136.050
                194.115,136.050 Z" />

            <path
                id="liquid"
                fill-rule="evenodd"
                clip-path="url(#clipPath)"
                fill="rgb( 255, 255, 255 )"
                d="M194.115,136.050 C234.545,136.050 267.321,168.722 267.321,209.025
                C267.321,249.328 234.545,282.000 194.115,282.000 C153.684,282.000
                120.909,249.328 120.909,209.025 C120.909,168.722 153.684,136.050
                194.115,136.050 Z" />

            <clipPath id="clipPath">
                <path
                    id="clippingPath"
                    d="M802.000,464.000 C802.000,464.000 401.000,464.000
                    401.000,464.000 C401.000,464.000 400.000,464.000 400.000,464.000
                    C400.000,464.000 -1.000,464.000 -1.000,464.000 C-1.000,464.000
                    -2.498,292.434 -1.000,240.000 C103.869,240.000 120.123,189.000
                    200.000,189.000 C274.426,189.000 300.545,239.829 400.511,239.996
                    C504.916,239.829 521.255,189.000 601.000,189.000 C675.549,189.000
                    701.625,240.000 802.000,240.000 C799.004,240.000 802.000,464.000
                    802.000,464.000 Z" />
            </clipPath>
        </svg>

    </div>
</div>
