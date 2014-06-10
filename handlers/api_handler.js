var config = global.config || require(__dirname + '/../config.js'),
  async = require('async'),
  models = require(__dirname + '/../models'),
  Director = app.get("models").Director,
  http = require('http');

module.exports.getDirectors = function(req,res,next){

  Director.findAll().complete(function (err, directors) {
    if(err){
      console.log("Api route error finding user:",err);
      res.send({error:err})
    } else {
      res.send({directors:directors});
    }
  });

};

module.exports.getDirector = function(req,res,next){

  var directorId = req.url.split("/")[3];
  Director.find({where: {id: directorId}}).complete(function (err, director) {
    if(err){
      console.log("Error getting director",err);
      res.send("Server Error",500)
    } else {
      res.send({director:director});
    }
  });

};

module.exports.saveDirector = function(req,res,next){

  var livestream_id;

  if(req.body.livestream_id && req.body.livestream_id !== ""){
    livestream_id = req.body.livestream_id;
    console.log("livestream id in param: ",livestream_id)
  } else {
    console.log("no livestream param");
    res.send({error:'Missing livestream id'});
  }

  var options = {
    host: 'api.new.livestream.com',
    path: '/accounts/'+livestream_id
  };

  http.get(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      body = JSON.parse(body);
      console.log("Parsing director info from http get response and saving new entry");

      Director.create({
        livestream_id: livestream_id,
        full_name: body.full_name,
        dob: body.dob,
        favorite_camera: req.body.camera,
        favorite_movies: req.body.movies
      }).success(function (director) {
        if(director){
          console.log("Saved director with id ",director.id);
          res.send({director:director})
        } else {
          console.log("Error saving new director");
          res.send({"Error":'Error saving director'})
        }
      });
    });
  }).on('error', function(err) {
    res.send({error: err});
    console.log("Error looking up livestream account: " + err.message);
  });

};

module.exports.updateDirector = function(req,res,next){

  var directorId = req.url.split("/")[3];

  Director.find({where: {id: directorId}}).complete(function (err, director) {
    if(err){
      console.log("Error getting director",err);
      res.send("Server Error",500)
    } else {
      if(req.body.camera.length>0){
        director.favorite_camera = req.body.camera;
      }
      if(req.body.movies.length>0){
        director.favorite_movies = req.body.movies;
      }
      director.save();
      res.send({director:director});
    }
  });

};
