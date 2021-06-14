*
 * Based on code by Sean Bradley
 * https://sbcode.net/threejs/webcam/
 */
function ChromaKeyMaterial(texture, keyColor, similarity, smothness)
{
  THREE.ShaderMaterial.call(this);

  var keyColor = new THREE.Color(keyColor);

  this.setValues({
    uniforms: {
      video_texture: {
        type: "t",
        value: texture
      },
      keyColor: {
        type: "c",
        value: keyColor
      },
	  similarity: {
	  	type: "float",
		value: similarity
	  },
	  smothness: {
	  	type: "float",
		value: smothness
	  }
    },
    vertexShader:
		`varying mediump vec2 vUv;

		void main(void)
		{
			vUv = uv;
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
		}`,
    fragmentShader:
		` precision mediump float;
		  uniform vec3 keyColor;
		  uniform float similarity;
		  uniform float smoothness;
		  varying vec2 vUv;
		  uniform sampler2D video_texture;

		  void main(void)
		  {
	      vec4 videoColor = texture2D(video_texture, vUv);

			  float Y1 = 0.299 * keyColor.r + 0.587 * keyColor.g + 0.114 * keyColor.b;
			  float Cr1 = keyColor.r - Y1;
			  float Cb1 = keyColor.b - Y1;

			  float Y2 = 0.299 * videoColor.r + 0.587 * videoColor.g + 0.114 * videoColor.b;
			  float Cr2 = videoColor.r - Y2;
			  float Cb2 = videoColor.b - Y2;

			  float blend = smoothstep(similarity, similarity + smoothness, distance(vec2(Cr2, Cb2), vec2(Cr1, Cb1)));
			  gl_FragColor = vec4(videoColor.rgb, videoColor.a * blend);
		  }`,
    transparent: true
  });
}

ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
