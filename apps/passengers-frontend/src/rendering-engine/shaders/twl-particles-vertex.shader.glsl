#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

attribute float customColor;
attribute float angle;
attribute float pindex;
attribute float particleAnimationStart;

uniform vec3 uColor;
uniform float uSize;
uniform sampler2D uTouchTexture;
uniform float uTime;
uniform float uFlatDispersion;
uniform float uDepthDispersion;
uniform float uAnimation;
uniform float uParticleAnimationDurationPercentage;
uniform vec2 uResolution;

varying float vColor;

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {

  float animationStart = particleAnimationStart * (1.0 - uParticleAnimationDurationPercentage);
  float animationProgress = min(1.0, step(animationStart, uAnimation) * (uAnimation - animationStart) / uParticleAnimationDurationPercentage);

  vec3 initialPosition = vec3(position.x, 1.5, position.z);
  vec3 currentPosition = initialPosition * (1.0 - animationProgress) + position * animationProgress;
  // float targetYPosition = yInitialPosition * (1.0 - animationProgress) + animationProgress * position.y;
  vec4 mvPosition = modelViewMatrix * vec4(currentPosition, 1.0 );
  gl_PointSize = uSize * ( 800.0 / -mvPosition.z );

  vec2 testUV = vec2((mvPosition.x + uResolution.x / 2.0) / uResolution.x, (mvPosition.y + uResolution.y / 2.0) / uResolution.y);

  vColor = customColor;
  
	vec4 textureColor = texture2D(uTouchTexture, testUV);
  float t = textureColor.r;
  vColor = customColor * (1.0 - t);

	float rndz = (random(pindex) + snoise2(vec2(pindex * 0.1, uTime * 0.1)));
	mvPosition.z += t * uDepthDispersion * rndz;
	mvPosition.x += cos(angle) * t * uFlatDispersion * rndz; 
	mvPosition.y += sin(angle) * t * uFlatDispersion * rndz; 

  gl_Position = projectionMatrix * mvPosition;

}