var Model = function(){
	var model = {
		getChunk: function(){
			throw "must override";
		}
	}

	return model;
}

module.exports = Model;