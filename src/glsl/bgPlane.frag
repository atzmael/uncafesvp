#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
uniform sampler2D animTexture;

varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec2 cv = uv;//- .5;

    vec4 animCol = texture2D(animTexture, cv);
    
    vec3 c = animCol.rgb;

    gl_FragColor = vec4(c.rgb, 1.0);
}