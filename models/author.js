var mongoose = require('mongoose'),
	moment   = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});
AuthorSchema
.virtual('dodf')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('DD-MM-YYYY') : '';
});
AuthorSchema
.virtual('dobf')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('DD-MM-YYYY') : '';
});


AuthorSchema
.virtual('lifespan')
.get(function () {
  var dob  = this.date_of_birth ? moment(this.date_of_birth).format('Do MMMM , YYYY') : '';
  var dod = this.date_of_death ? moment(this.date_of_death).format('Do MMMM , YYYY') : '';
  var lifespan = dob + "-" + dod;
  return lifespan;
});




//Export model
module.exports = mongoose.model('Author', AuthorSchema);