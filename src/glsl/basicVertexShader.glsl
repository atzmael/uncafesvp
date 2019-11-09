//uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
uniform float time;
// attribute vec3 position;
// attribute vec3 normal;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix *
                vec4(position * 2. , 1.0);
}