var THREE = require("THREE");
var TextureLoader = require("./textureloader");

var ShaderCode = (function(){
	return {
		solidColorVertexShader :
			"void main() { \
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); \
			}",

		solidColorPixelShader : 
			"uniform vec4 color; \
			void main() { \
				gl_FragColor = color; \
			}",
	};
})();

var MaterialLoader = function(flag) {
	var flag = flag;

	var getSolidMaterial = function(color){
		return new THREE.ShaderMaterial({
			uniforms: {
				color : { type: "v4", value: color }
			},

			vertexShader: ShaderCode.solidColorVertexShader,
			fragmentShader: ShaderCode.solidColorPixelShader
		});
	}

	return{
		getSolidMaterial: getSolidMaterial
	}
}();

module.exports = MaterialLoader;