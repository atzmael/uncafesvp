// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 modelMatrix;
uniform float time;
// attribute vec3 position;
// attribute vec3 normal;
// varying vec3 vNormal;
varying vec2 vUv;

void main() {
    // vNormal = normal;
    vUv = uv;

    gl_Position = // projectionMatrix * modelMatrix * viewMatrix *
        vec4(position * 2. , 1.0);
}