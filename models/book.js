var mongoose	 = require('mongoose'),
	Schema		 = mongoose.Schema;
	

	var BookSchema = Schema(
	{
		title: {type: String, required: true},
		author: {type: Schema.ObjectId, ref:'Author', required: true},
		summary: {type: String, required: true},
		isbn: {type: String, required: true},
		author: [{type: Schema.ObjectId, ref:'Genre'}]

	});



//virtual for book's url
	BookSchema
	.virtual('url')
	.get(function(){
		return '/catalogue/book/ ' + this._id;
	});


//Export model
module.exports = mongoose.model('Book', BookSchema);