var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
var mongoose = require('mongoose');


//Display list of all authors
exports.author_list = function(req, res, next) {

  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });

};

//Display details for a specific authors
exports.author_details = function(req, res){
	var did = mongoose.Types.ObjectId(req.params.id.trim());  

	 async.parallel({
    author: function(callback) {     
      Author.findById(did)
        .exec(callback);
    },
    authors_books: function(callback) {
      Book.find({ 'author': did },'title summary')
        .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
  });

};

//DIsplay Author create form on GET

exports.author_create_get = function(req, res){
res.render('author_form', { title: 'Create Author'});
};

//DIsplay Author create form on POST

exports.author_create_post = function(req, res, next){

	req.checkBody('first_name', 'First name must be specified').notEmpty();
	req.checkBody('family_name', 'Family name must be specified').notEmpty();
	req.checkBody('first_name', 'First name must be specified').isAlpha();
	 req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
    req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isDate();
	

	req.sanitize('first_name'). escape();
	req.sanitize('family_name').escape();
	req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();
    req.sanitize('date_of_birth').toDate();
    req.sanitize('date_of_death').toDate();

    var errors = req.validationErrors();

    var author = new Author({
    	first_name: req.body.first_name,
    	family_name: req.body.family_name,
    	date_of_birth: req.body.date_of_birth,
    	date_of_death:req.body.date_of_death,
    });
    if(errors){
    	res.render('author_form', {title:'Add Author', author: author, errors : errors});
    	return;
    }
   else{
   	author.save(function(err){
   		if(err) { return next(err);}
   		res.redirect(author.url);
   	});
   }
};

//Display Author delete form on GET

	exports.author_delete_get = function(req, res, next) {       
var did = mongoose.Types.ObjectId(req.params.id.trim()); 
    async.parallel({
        author: function(callback) {     
            Author.findById(did).exec(callback);
        },
        authors_books: function(callback) {
          Book.find({ 'author': did }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });
    
};

//Display Author delete form on POST

exports.author_delete_post = function(req, res, next) {

    req.checkBody('authorid', 'Author id must exist').notEmpty();  
    
    async.parallel({
        author: function(callback) {     
            Author.findById(req.body.authorid).exec(callback);
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.authorid },'title summary').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.authors_books>0) {
            //Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            //Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                //Success - got to author list
                res.redirect('/catalog/authors');
            });

        }
    });

};



//Display Author update form on GET

exports.author_update_get = function(req, res, next){
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  async.parallel({
     
     author: function(callback){
      Author.findById(req.params.id)
              .exec(callback);
         }
  }, function(err, results){
    if(err){return next(err);}

    res.render('author_form', {title:'Update Author', author: results.author});
  });
	
};

//Display Author delete form on POST

exports.author_update_post = function(req, res,next){

  req.sanitize('id').escape();
    req.sanitize('id').trim();

	req.checkBody('first_name', 'First name must be specified').notEmpty();
  req.checkBody('family_name', 'Family name must be specified').notEmpty();
  req.checkBody('first_name', 'First name must be specified').isAlpha();
   req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
    req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isDate();
  

  req.sanitize('first_name'). escape();
  req.sanitize('family_name').escape();
  req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();
    req.sanitize('date_of_birth').toDate();
    req.sanitize('date_of_death').toDate();

    var errors = req.validationErrors();

    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death:req.body.date_of_death,
      _id:req.params.id

    });
    if(errors){
      res.render('author_form', {title:'Add Author', author: author, errors : errors});
      return;
    }
   else{
    Author.findByIdAndUpdate(req.params.id, author, {}, function(err,theauthor){
      if(err) { return next(err);}
      res.redirect(theauthor.url);
    });
   }
};


