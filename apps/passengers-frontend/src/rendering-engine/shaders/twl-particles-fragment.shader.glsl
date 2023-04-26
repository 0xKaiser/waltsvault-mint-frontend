uniform vec3 uColor;
uniform sampler2D uTouchTexture;
uniform vec2 uResolution;

varying float vColor;

void main() {

  gl_FragColor = vec4( uColor * vColor, 1.0 );
  // gl_FragColor = vec4(vec3(1.0), 1.0 );
  // gl_FragColor = vec4(vec3(vColor), 1.0 );

  // vec2 tuv = (gl_FragCoord.xy - 0.5) / uResolution;
  // vec4 textureColor = texture2D(uTouchTexture, vec2(0.3, 0.3));

  // gl_FragColor = vec4(textureColor.rgb, 1.0);
}