var mongoose	 = require('mongoose'),
	Schema		 = mongoose.Schema;
	

	var BookInstanceSchema = Schema(
	{
	
		book: {type: Schema.ObjectId, ref:'Book', required: true},
		imprint: {type: String, required: true},
		status: {type: String, required: true,enum: ['Available', 'Maintenance','Loaned', 'Reserved'], default: 'Maintenance'},

		due_back: {type: Date, default:Date.now}

	});



//virtual for bookinstance's url
	BookInstanceSchema
	.virtual('url')
	.get(function(){
		return '/catalogue/bookinstance/ ' + this._id;
	});


//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);