
#define PI 3.14159265359

varying vec4 vColor;
varying vec2 vUv;

uniform sampler2D map;
uniform float iMass;
uniform float iTime;
uniform float uClickTime;
uniform float aspectRatio;
uniform float iSize;
uniform float iWave;
uniform float iBlackOpacity;

float uvScaleFactor =  .75;
float mass = 0.12;
float blacknes = 0.03;
float rotationSpeed = 0.25;

vec2 rotate(vec2 mt, vec2 st, float dist){
	mt = mt * uvScaleFactor + (1. - uvScaleFactor) / 2.;
	st = st * uvScaleFactor + (1. - uvScaleFactor) / 2.;

	float pull = (mass * 0.4) / ( pow(dist, 2.)) * iSize;
	float factor = .6;
	float rotationMultiplier = smoothstep(0.1 * factor , 0.2 * factor, dist) - smoothstep(0.3 * factor, 0.52 * factor, dist);
	rotationMultiplier = rotationMultiplier * rotationMultiplier * iSize;

	float cosVal = cos(pull + iWave * pull * 6.5 +  iTime * rotationSpeed) + cos(iTime + 30. * iWave ) * rotationMultiplier;
	float sinVal = sin(pull + iWave * pull * 6.5 + iTime * rotationSpeed) + sin(iTime+ 30. * iWave ) * rotationMultiplier ;

	vec2 tranlatedPoint = st - mt;
	vec2 rotatedPoint = mat2(cosVal, - sinVal, sinVal, cosVal) * tranlatedPoint;
	
	return rotatedPoint + mt;
}



void main() {

  float dx = (vUv.x - .5) * aspectRatio;
	float dy = vUv.y - .5;

	float dist = sqrt(dx * dx + dy * dy);
	float blahHoleSize = (mass * 0.1) / (dist * dist * dist * dist) * iSize;
	vec2 rotatedUvs = rotate(vec2(.5), vUv, dist);

  vec4 imgcolor = texture2D(map, rotatedUvs);  
	float colorFactor = blacknes * iSize * blahHoleSize;

	vec4 finalColor = imgcolor - vec4(vec3(colorFactor), (1. - iBlackOpacity));

  gl_FragColor = finalColor;	
}