#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
uniform sampler2D bgTexture;
uniform sampler2D animTexture;
uniform vec3 col1;
uniform vec3 col2;
uniform vec3 col3;
varying mediump vec3 vNormal;
varying mediump vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec2 cv = uv;//- .5;

    // vec4 col = texture2D(texture, (cv));//* (cos(time)*0.2 + 1.));
    vec4 bgCol = texture2D(bgTexture, cv);
    vec4 animCol = texture2D(animTexture, cv);
    

    vec3 c = bgCol.rgb;
    // c = mix(c, animCol, 1. - animCol.g);
    // c = mix(c, col1, animCol.r);
    // c = mix(c, col2, animCol.g);
    // c = mix(c, col3, animCol.b);


    gl_FragColor = vec4(c.rgb, 1.0);
}