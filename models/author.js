var mongoose	 = require('mongoose'),
	Schema		 = mongoose.Schema;
	

	var AuthorSchema = Schema(
	{
		first_name: {type: String, required: true, max: 100},
		family_name: {type: String, required: true, max: 100},
		date_of_birth: {type: Date},
		date_of_death: {type: Date}

	});

//virtual for authors full name
AuthorSchema
	.virtual('name')
	.get(function(){
		return this.family_name+ ', ' + this.first_name;
	});

//virtual for author's url
	AuthorSchema
	.virtual('url')
	.get(function(){
		return '/catalogue/author/ ' + this._id;
	});


//Export model
module.exports = mongoose.model('Author', AuthorSchema);