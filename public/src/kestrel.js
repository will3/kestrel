var Kestrel = function(){
	var seed = Math.random();
	var random = Math.seedrandom(seed);

	return {
		initialize: function(){
			noise.seed(seed);
		},
	};
}();