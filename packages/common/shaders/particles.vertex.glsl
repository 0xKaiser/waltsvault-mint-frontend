#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

#define PI 3.14159265359
#define SMOOTH_FACTOR 0.95

uniform float time;
uniform vec3 color;
uniform vec3 secondaryColor;
uniform float particleSize;
uniform float morphInfluence;

attribute vec3 pos;
attribute vec3 morphTarget;

varying vec2 vUv;
varying vec4 vColor;

void main() {
  vUv = uv;
  float colorFactor = smoothstep(-SMOOTH_FACTOR, SMOOTH_FACTOR, snoise3(pos * .08));
  vColor = vec4(mix(color, secondaryColor, colorFactor), 1.);

  vec3 particlePosition = (modelMatrix * vec4(mix(pos, morphTarget, morphInfluence), 1.)).xyz;
  vec4 viewPos = viewMatrix * vec4(particlePosition, 1.);

  viewPos.xyz += position * particleSize;

  gl_Position = projectionMatrix * viewPos;

}