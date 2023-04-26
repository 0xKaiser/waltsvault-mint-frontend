varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec2 iResolution;
uniform float devicePixelRatio;

float character(int n, vec2 p)
{
	p = floor(p*vec2(4.0, -4.0) + 2.5);
    if (clamp(p.x, 0.0, 4.0) == p.x)
	{
        if (clamp(p.y, 0.0, 4.0) == p.y)	
		{
        	int a = int(round(p.x) + 5.0 * round(p.y));
			if (((n >> a) & 1) == 1) return 1.0;
		}	
    }
	return 0.0;
}

void main()
{ 
	// number of pixel required to render a character (5x5px char grid + 3px padding)
	vec2 boxSize = vec2(8.0, 8.0);
	vec2 pixelStep = (vec2(1.0, 1.0) / iResolution);
	vec2 pixelLocation = vUv * iResolution;
	vec2 boxCorner = (pixelLocation - mod(pixelLocation, boxSize));
	vec2 boxEnd = min(iResolution, boxCorner + boxSize);	


	vec3 col =  vec3(0.0, 0.0, 0.0);
	// TODO: optimize by creating a custom pass that will use a lower resolution render target
	// to create the same effect without using a loop inside the shader
	for(float x = boxCorner.x; x < boxEnd.x; x += 1.0) {
		for(float y = boxCorner.y; y < boxEnd.y; y += 1.0) {
			col += texture2D(tDiffuse, vec2(x, y) / iResolution).rgb;
		}		
	}
	col /= boxSize.x * boxSize.y;
	
	float gray = (col.r + col.g + col.b) / 3.0;
	
	// https://thrill-project.com/archiv/coding/bitmap/
	gray = gray * 1.3;
	int n =  0;                		// <empty>
	if (gray > 0.2) n = 65600;    // :
	if (gray > 0.3) n = 332772;   // *
	if (gray > 0.4) n = 15255086; // o 
	if (gray > 0.5) n = 23385164; // &
	if (gray > 0.6) n = 15252014; // 8
	if (gray > 0.7) n = 13199452; // @
	if (gray > 0.8) n = 11512810; // #

	vec2 pix = gl_FragCoord.xy;
	vec2 p = mod(pix/(4.0 * devicePixelRatio), 2.0) - vec2(1.0);
	
	gl_FragColor = vec4(1.0,1.0,1.0,1.0) * character(n, p);
}