#define PI 3.14159265359

uniform vec2 resolution;
uniform float time;
uniform float progress;

uniform sampler2D bgTexturesFrom;
uniform sampler2D bgTexturesTo;
uniform sampler2D noiseTexture;

varying mediump vec3 vNormal;
varying mediump vec2 vUv;

// float quinticOut(float t) {
//   return 1.0 - ((t - 1.0)*(t - 1.0)*(t - 1.0)*(t - 1.0)*(t - 1.0));
// } 
float quinticIn(float t) {
  return pow(t, 5.0);
}
float sinusoidAlongLinearPath(float value){
    return (cos(2. * PI * value + PI * .5) + 2. * PI * value) * 0.159154943 ; // "0,159154943" == "1 / (2 * PI)"
}

void main() {
    vec2 uv = vUv;
    // uv = uv * resolution.x / resolution.y;

    float smoothinterval = .4;

    vec2 nv1 = vec2(uv.x, uv.y - time * 0.008) * 0.73;
    vec2 nv2 = uv * 1.66;
    vec2 nv3 = uv;
    nv1.y -= .003;
    nv3.y += .0047 ;

    // float sinusoidProgress = sinusoidAlongLinearPath(progress);

    vec4 bgCol0 = texture2D(bgTexturesFrom, uv);
    vec4 bgCol1 = texture2D(bgTexturesTo, uv);

    float noiseCol1 = texture2D(noiseTexture, nv1).r;
    float noiseCol2 = texture2D(noiseTexture, nv2).r;
    float noiseCol3 = texture2D(noiseTexture, nv3).r;
    float noise = noiseCol1 * noiseCol3;
    
    // float m = 1.- smoothstep(
    //     max(0.,sinusoidProgress - smoothinterval),
    //     sinusoidProgress * (1. + smoothinterval),
    //     noise);
    float p = quinticIn(progress);

    float m = 1. - smoothstep(
        max(0., p - smoothinterval),
        p * (1. + smoothinterval),
        noise);

    vec4 c = mix(bgCol0, bgCol1, m);

    gl_FragColor = vec4(c.rgb, 1.0);
    // gl_FragColor = vec4(vec3(m), 1.0);
}