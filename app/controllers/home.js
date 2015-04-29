exports.index = function(req, res){
	res.render('home', {
		showTitle: true,

		helpers:{
			foo: function(){
				return 'foo';
			}
		}
	});
}