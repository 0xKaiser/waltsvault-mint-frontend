
varying vec4 vColor;
varying vec2 vUv;

uniform sampler2D map;
uniform float opacity;
uniform vec3 shineColor;

void main() {  
  vec2 uv = pow(vUv, vec2(2.));
  gl_FragColor = vec4(vColor.rgb, vColor.a * texture2D(map, vUv).r * opacity);
}

