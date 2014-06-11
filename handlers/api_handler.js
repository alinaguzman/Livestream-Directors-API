var config = global.config || require(__dirname + '/../config.js'),
  async = require('async'),
  models = require(__dirname + '/../models'),
  Director = app.get("models").Director,
  http = require('http'),
  validator = require('validator');

//returns a list of all directors or an error
module.exports.getDirectors = function(req,res,next){

  Director.findAll().complete(function (err, directors) {
    if(err){
      console.log("Api route error finding user:",err);
      res.send({error:err})
    } else {
      Director.displayAll(directors,function(err,directors){
        res.send({directors:directors});
      });
    }
  });

};

//returns a single director or an error
module.exports.getDirector = function(req,res,next){

  if(validator.isNumeric(req.params.director_id)){
    var id = req.params.director_id;
    Director.find({where: {id: id}}).complete(function (err, director) {
      if(err){
        console.log("Error getting director",err);
        res.send("Server Error",500)
      } else if(!director){
        res.send({"error":"No director exists with id "+id})
      } else {
        director.display(function(err,director){
          res.send({director:director});
        });
      }
    });
  } else {
    res.send({error: "Id not valid"})
  }

};

//saves a new director
module.exports.saveDirector = function(req,res,next){

  //validates incoming data from the post
  Director.validateDirector(req.body,function(err,data){

    var options = {
      host: 'api.new.livestream.com',
      path: '/accounts/'+data[0]
    };

    //calling Livestream api to get director fullname and dob
    http.get(options, function(resp) {
      var body = '';
      resp.on('data', function(chunk) {
        body += chunk;
      });
      resp.on('end', function() {
        body = JSON.parse(body);
        console.log("Parsing director info from http get response and saving new entry");

        //checks that the new director does not have an account
        Director.checkIfExists(data[0],function(err,exists){
          if(err){
            console.log("Error checking livestream id against director list")
            res.send({error:err})
          }
          if(!exists){
            Director.create({
              livestream_id: data[0],
              full_name: body.full_name,
              dob: body.dob,
              favorite_camera: data[1],
              favorite_movies: data[2]
            }).success(function (director) {
              if(director){
                console.log("Saved director with id ",director.id);
                res.send({director:director})
              } else {
                console.log("Error saving new director");
                res.send({"Error":'Error saving director'})
              }
            });
          } else {
            res.send({message:"Director already exists"})
          }
        })
      });
    }).on('error', function(err) {
      res.send({error: err});
      console.log("Error looking up livestream account: " + err.message);
    });
  });

};

//updates an existing director
module.exports.updateDirector = function(req,res,next){

  if(validator.isNumeric(req.params.director_id)){
    var id = req.params.director_id;
    Director.find({where: {id: id}}).complete(function (err, director) {
      if(err){
        console.log("Error getting director",err);
        res.send("Server Error",500)
      } else {
        //updating camera if new data is in the post
        if(req.body.camera && req.body.camera.length>0){
          director.favorite_camera = req.body.camera;
        }
        //updating favorite movies if new data is in the post
        if(req.body.movies && req.body.movies.length>0){
          director.favorite_movies = req.body.movies;
        }
        director.save().complete(function(){
          res.send({director:director});
        });
      }
    });
  } else {
    res.send({error: "Id not valid"})
  }


};
