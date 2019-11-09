#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 st = vUv - .5;

    // mediump vec3 light = vec3(0.5, 0.2, 1.0);

    // vec3 baseColor =  vec3(cos(time)*.5+.5, sin(time)*.5+.5, 1.);

    // ensure it's normalized
    // light = normalize(light);

    // calculate the dot product of
    // the light to the vertex normal
    // mediump float dProd = max(0.0, dot(vNormal, light));

    // feed into our frag colour
    gl_FragColor = vec4(vec3(length(st)), 1.0);
}