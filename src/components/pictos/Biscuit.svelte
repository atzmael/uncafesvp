<style>
    .cls-1 {
        filter: url(#filter-biscuit);
    }

    .cls-2,
    .cls-3 {
        fill: none;
        stroke: #fff;
        stroke-linecap: round;
        stroke-width: 8px;
        stroke-dasharray: 32 16;
    }

    .cls-2 {
        stroke-linejoin: round;
    }

    .cls-3 {
        fill-rule: evenodd;
    }
</style>

<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="171"
    height="172"
    viewBox="0 0 171 172">
    <defs>
        <filter id="filter-biscuit" filterUnits="userSpaceOnUse">
            <feFlood result="flood" flood-color="#261000" />
            <feComposite result="composite" operator="in" in2="SourceGraphic" />
            <feBlend result="blend" in2="SourceGraphic" />
        </filter>
    </defs>
    <g id="biscuit" class="cls-1">
        <ellipse class="cls-2" cx="85.5" cy="86" rx="81.5" ry="82" />
        <path
            id="Ellipse_4_copy"
            data-name="Ellipse 4 copy"
            class="cls-3"
            d="M5056.45,3183.82a55.181,55.181,0,1,1-54.87,55.18A55.027,55.027,0,0,1,5056.45,3183.82Z"
            transform="translate(-4971 -3153)" />
    </g>
</svg>
