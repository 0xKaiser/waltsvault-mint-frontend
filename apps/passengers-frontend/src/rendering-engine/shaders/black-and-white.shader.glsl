precision highp float;
precision highp int;
varying vec2 vUv;

uniform highp sampler2D map;


void main() {
		float redTreshold  = 1.0 - step(0.12, texture2D(map, vUv).r);
		float greenTreshold  = step(0.155, texture2D(map, vUv).g);
		float blueTreshold = step(0.275, texture2D(map, vUv).b);
		float color = max(0.25, redTreshold * greenTreshold * redTreshold);

		gl_FragColor = vec4(color, color, color, 1.0);
}

