#define PI 3.14159265359

uniform vec2 resolution;
uniform float time;
uniform sampler2D animTexture;
uniform vec3 col1;
uniform vec3 col2;
uniform vec3 col3;
varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec4 textureCol = texture2D(animTexture, uv);

    // vec3 col = c1 + c2 + c3;
    // vec3 c =  max(max(c1, c2), c3);
    vec3 c = (col1 + col2 + col3) * .33333333;
    c = mix(c, col1, textureCol.r);
    c = mix(c, col2, textureCol.g);
    c = mix(c, col3, textureCol.b);
    // vec3 col =  mix(c1, c2, textureCol.r * textureCol.g);

    float alpha = max(max(textureCol.r, textureCol.g), textureCol.b);

    gl_FragColor = vec4(c, alpha);
    // gl_FragColor = vec4(c, alpha + 0.2); // debug
    // gl_FragColor = vec4(c1, 1.); // debug
}