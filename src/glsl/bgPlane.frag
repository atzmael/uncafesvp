#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
uniform sampler2D myTexture;
varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec2 cv = uv - .5;

    vec4 col = texture2D(myTexture, (cv)* (cos(time)*0.2 + 1.));

    gl_FragColor = vec4(col.rgb, 1.0);
}