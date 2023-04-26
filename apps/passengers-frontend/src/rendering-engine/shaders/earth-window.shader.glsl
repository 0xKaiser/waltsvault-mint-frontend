precision highp float;
precision highp int;

varying vec2 vUv;

uniform sampler2D tDiffuse;

uniform vec2 dimensions;

uniform float padding;

uniform float scale;

void main() {
    float stepFactor = step(0.1, vUv.x) * step(vUv.x, 0.9) * step(0.1, vUv.y) * step(vUv.y, 0.9);
		// float redTreshold  = 1.0 - step(0.12, texture2D(tDiffuse, vUv).r);
		// float greenTreshold  = step(0.155, texture2D(tDiffuse, vUv).g);
		// float blueTreshold = step(0.275, texture2D(tDiffuse, vUv).b);
		// float color = max(0.25, redTreshold * greenTreshold * redTreshold);

		// gl_FragColor = texture2D(tDiffuse, vUv) * stepFactor;
		// gl_FragColor = texture2D(tDiffuse, vUv) * stepFactor;
		gl_FragColor = texture2D(tDiffuse, vUv);
		// gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}

