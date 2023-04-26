#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

uniform vec2 u_mouse;
uniform vec2 u_res;

uniform sampler2D u_image;
uniform sampler2D u_imagehover;
uniform float u_horizontalEdge;
uniform float u_verticalEdge;
uniform float u_horizontalBlur;
uniform float u_verticalBlur;
uniform float u_noiseSize;
uniform float u_noiseStrength;
uniform float u_time;
uniform float u_timeScale;

varying vec2 vUv;

float plot(vec2 st){
	return smoothstep(u_verticalEdge - u_verticalBlur, u_verticalEdge + u_verticalBlur, st.y) * 
				 smoothstep(u_horizontalEdge - u_horizontalBlur, u_horizontalEdge + u_horizontalBlur, st.x);
}

void main() {
	// We manage the device ratio by passing PR constant
	vec2 res = u_res * PR;
	vec2 st = gl_FragCoord.xy / res.xy;

	// float c = circle(circlePos, 0.07, 2.) * 2.5;
	float c = plot(st);

	float scaledTime = u_time * u_timeScale;
	float offx = vUv.x + sin(vUv.y + scaledTime);
	float offy = vUv.y - scaledTime - cos(scaledTime * .01) * .01;

	float n = snoise3(vec3(offx, offy, u_time * .1) * u_noiseSize) - 1.;

	float finalMask = smoothstep(0.1, 0.9,  n + c * u_noiseStrength);

	vec4 image = texture2D(u_image, vUv);
	vec4 hover = texture2D(u_imagehover, vUv);

	vec4 finalImage = mix(image, hover, finalMask);

	gl_FragColor = finalImage;
}