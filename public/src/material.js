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

function SolidColorMaterial(color){
	var m = new Material("color");
	m.color = color;
	return m;
}

function Material(aFlag) {
	var flag = aFlag;

	var color = new THREE.Vector4(1.0, 1.0, 1.0, 1.0);

	var getSolidMaterial = function(){
		return new THREE.ShaderMaterial({
			uniforms: {
				color : { type: "v4", value: color }
			},

			vertexShader: ShaderCode.solidColorVertexShader,
			fragmentShader: ShaderCode.solidColorPixelShader
		});
	}

	return{
		setColor: function(value){
			color = value;
		},

		getInnerMaterial: function(){
			if(flag == "color"){
				return getSolidMaterial();
			}
		}
	};
};
