
var Genre = require('../models/genre'),
	Book  = require('../models/book'),
    mongoose = require('mongoose'),
	async = require('async');






// Display list of all Genre
exports.genre_list = function(req, res, next) {
    
    Genre.find()
    .sort([['name', 'ascending']])
    	.exec( function(err, genre_list){
    		if(err){ next(err);}

    	res.render('genre_list', { title: 'Genre List', genre_list: genre_list });	

    	});  

};


exports.genre_detail = function(req, res, next) {
   // console.log(req.params.id.trim());
    var did = mongoose.Types.ObjectId(req.params.id.trim());   
     

  async.parallel({
    genre: function(callback) {  
      Genre.findById(did)
        .exec(callback);
    },
        
    genre_books: function(callback) {   
      Book.find({ 'genre': did })
      .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('genre_details', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
  });

};
// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.render('genre_form', {title: 'Create Genre'})
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res,next) {
    req.checkBody('name', 'Genre name required').notEmpty();

    req.sanitize('name').escape();
    req.sanitize('name').trim();


    //run validators
    var errors = req.validationErrors();

    //create a genre object with object and trimmed data
    var genre = new Genre({
        name: req.body.name
    });
    if(errors){
        //if errors exists render form again with entered values
        res.render('genre_form', {title:'Create Genre', genre: genre, errors :errors});
        return;

        }
     else{
        //Means data form is valid
        //check if data already exist

        Genre.findOne({'name': req.body.name})
        .exec(function(err, found_genre){
            if(err){return next(err);}
            if(found_genre){
                //genre exists, redirect to its detail page
                res.redirect(found_genre.url);
            }
            else{
                genre.save(function(err){
                    if(err){return next(err);}
                    res.redirect(genre.url)
                });
            }
        });
     }   
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};

