#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
uniform sampler2D myTexture;
varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec4 textureCol = texture2D(myTexture, uv);

    vec3 col1 = vec3(0.9, 0.1, 0.) * textureCol.r;
    vec3 col2 = vec3(1., .8, 0.) * textureCol.g;
    vec3 col3 = vec3(0., .1, 0.5) * textureCol.b;

    // vec3 col = col1 + col2 + col3;
    vec3 col =  max(max(col1, col2), col3);
    // vec3 col =  mix(col1, col2, textureCol.r * textureCol.g);

    float alpha = smoothstep(0.3, 1., max(max(textureCol.r, textureCol.g), textureCol.b));

    gl_FragColor = vec4(col, alpha);
    gl_FragColor = vec4(col, alpha + 0.2); // debug
    // gl_FragColor = vec4(col1, 1.); // debug
}