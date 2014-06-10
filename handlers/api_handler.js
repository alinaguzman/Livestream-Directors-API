var config = global.config || require(__dirname + '/../config.js'),
  async = require('async'),
  models = require(__dirname + '/../models'),
  Director = app.get("models").Director,
  http = require('http'),
  validator = require('validator');

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

module.exports.getDirector = function(req,res,next){

  var directorId = req.url.split("/")[3];
  Director.find({where: {id: directorId}}).complete(function (err, director) {
    if(err){
      console.log("Error getting director",err);
      res.send("Server Error",500)
    } else if(!director){
      res.send({"error":"No director exists with id "+directorId})
    } else {
      director.display(function(err,director){
        res.send({director:director});
      });
    }
  });

};

module.exports.saveDirector = function(req,res,next){

  Director.validateDirector(req.body,function(err,data){

    var options = {
      host: 'api.new.livestream.com',
      path: '/accounts/'+data[0]
    };

    http.get(options, function(resp) {
      var body = '';
      resp.on('data', function(chunk) {
        body += chunk;
      });
      resp.on('end', function() {
        body = JSON.parse(body);
        console.log("Parsing director info from http get response and saving new entry");

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

module.exports.updateDirector = function(req,res,next){

  var directorId = req.url.split("/")[3];

  Director.find({where: {id: directorId}}).complete(function (err, director) {
    if(err){
      console.log("Error getting director",err);
      res.send("Server Error",500)
    } else {
      if(req.body.camera && req.body.camera.length>0){
        director.favorite_camera = req.body.camera;
      }
      if(req.body.movies && req.body.movies.length>0){
        director.favorite_movies = req.body.movies;
      }
      director.save().complete(function(){
        res.send({director:director});
      });
    }
  });

};
