var TextureLoader = function(){
	var rootPath = "public/assets/textures";
	return {
		setRootPath: function(value){
			rootPath = value;
		},

		getRootPath: function(){
			return rootPath;
		},

		loadTexture: function(name){
			return THREE.ImageUtils.loadTexture(rootPath + "/" + name + ".png");
		},

		getDefault : function(){
			return this.loadTexture("default");
		}
	};
}();