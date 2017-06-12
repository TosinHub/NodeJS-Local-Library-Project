var mongoose	 = require('mongoose'),
	Schema		 = mongoose.Schema;
	

	var GenreSchema = Schema(
	{
	
		
		name: {type: String, min: 3, max:100, required: true}

	});



//virtual for Genre's url
	GenreSchema
	.virtual('url')
	.get(function(){
		return '/catalog/genre/ ' + this._id;
	});


//Export model
module.exports = mongoose.model('Genre', GenreSchema);