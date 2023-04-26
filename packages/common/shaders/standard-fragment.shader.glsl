precision highp float;
precision highp int;
varying vec2 vUv;

uniform highp sampler2D map;


void main() {
		gl_FragColor = texture2D(map, vUv);
}

