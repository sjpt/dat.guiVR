/**
 * PJT: This is a variation on sdfshader from bmfont, which should Just Work with logarithmic depth buffers.
 * It should also allow some other aspects of THREE rendering to be incorporated, like fog, clipping planes...
 * Environment maps and various other bits from MeshBasicMaterial are removed.
 * At time of writing, this is work in progress, and somewhat more bloated than it needs to be.
 * The shader code is designed to be used with ShaderMaterial rather than RawShaderMaterial.
 */
 import * as Layout from './layout';
var assign = require('object-assign');

/**
 * starting from THREE meshbasic shaders, pruning / modifying...
 */
const meshbasic_vert = `
#define USE_MAP
#define USE_UV
#include <common>
#include <uv_pars_vertex>
//#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

varying float vScale;
// This is defined in layout.js (and was observed looking at three heirachy matrices)
#define TEXT_SCALE ${Layout.TEXT_SCALE}
void main() {
  
  vScale = pow(abs(determinant(mat3(modelViewMatrix))), -0.33333) * TEXT_SCALE;
  vUv = uv;
	#include <color_vertex>

	#include <begin_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>

	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}
`;

const meshbasic_frag = `
#define USE_MAP
#define USE_UV
uniform vec3 color;
uniform float opacity;
varying float vScale;

#include <common>
//#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

/////
float aastep(float value) {
    #ifdef GL_OES_standard_derivatives
        float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    #else
        float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));
    #endif
    afwidth *= vScale;
    return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
}
////

void main() {

	#include <clipping_planes_fragment>

    ///
    vec4 diffuseColor = vec4( color, opacity );
    
    vec4 texColor = texture2D(map, vUv);
    float alpha = aastep(texColor.a);
    gl_FragColor = vec4(color, opacity * alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ///

	#include <logdepthbuf_fragment>
    //XXX: big chunk removed from original meshbasic_frag here.
    #include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
`;


module.exports = function createSDFShader (opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  ///-- hardcoded in shader code, guivr never passed these in opt --
  //var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  //var precision = opt.precision || 'highp'
  var color = opt.color;
  var map = opt.map;
  
  opt.extensions = opt.extensions || {};
  opt.extensions.derivatives = true; //nb, false defaults for fragDepth, drawBuffers, shaderTextureLOD will no longer be there.
  opt.name = "SDF text material";

  // remove to satisfy r73
  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: meshbasic_vert,
    fragmentShader: meshbasic_frag
  }, opt);
}
