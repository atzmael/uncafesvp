#define PI 3.14159265359

// uniform vec2 resolution;
uniform float time;
uniform sampler2D bgTextures[3];
uniform sampler2D noiseTexture;

varying mediump vec3 vNormal;
varying mediump vec2 vUv;

float qinticOut(float t) {
  return 1.0 - ((t - 1.0)*(t - 1.0)*(t - 1.0)*(t - 1.0)*(t - 1.0));
} 
float sinusoidAlongLinearPath(float value){
    return (cos(2. * PI * value + PI * .5) + 2. * PI * value) * 0.159154943 ; // "0,159154943" == "1 / (2 * PI)"
   
}

void main() {
    vec2 uv = vUv;
    // uv = uv * resolution.x / resolution.y;

    // vec2 cv = uv - .5;
    float transitionTime = 8.; // in seconds
    float smoothinterval = .5;
    float progress = fract(time / transitionTime);


    vec2 nv1 = vec2(uv.x, uv.y - time * 0.005) * 0.73;
    vec2 nv2 = uv * 1.66;
    vec2 nv3 = uv;

    float sinusoidProgress = sinusoidAlongLinearPath(progress);
    nv1.y -= .003;
    nv3.y += .0047 ;

    vec4 bgCol0 = texture2D(bgTextures[0], uv);
    vec4 bgCol1 = texture2D(bgTextures[1], uv);

    float noiseCol1 = texture2D(noiseTexture, nv1).r;
    float noiseCol2 = texture2D(noiseTexture, nv2).r;
    float noiseCol3 = texture2D(noiseTexture, nv3).r;
    float noise = noiseCol1 * noiseCol2 * noiseCol3;
    
    float m1 = 1.- smoothstep(
        max(0.,sinusoidProgress - smoothinterval),
        sinusoidProgress* (1. + smoothinterval),
        noise);

    vec4 c = mix(bgCol0, bgCol1, m1);

    gl_FragColor = vec4(c.rgb, 1.0);
    // gl_FragColor = vec4(vec3(noise), 1.0);
}