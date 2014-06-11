var async = require('async'),
  validator = require('validator');
module.exports = function(sequelize, DataTypes) {

  return sequelize.define("Director", {
    livestream_id:   DataTypes.STRING,
    full_name:       DataTypes.STRING,
    dob:             DataTypes.STRING,
    favorite_camera: DataTypes.STRING,
    favorite_movies: DataTypes.STRING
  },{
    classMethods: {

      //handles display for the full list of directors
      displayAll: function(directors,callback){
        if(directors.length > 0){
          var directorList = [];
          async.map(directors, function(director, done) {
            var directorDisplay = {};
            directorDisplay.full_name = director.full_name;
            directorDisplay.dob = director.dob;
            directorDisplay.favorite_camera = director.favorite_camera;
            directorDisplay.favorite_movies = director.favorite_movies.split(",");
            directorList.push(directorDisplay);
            done(null,directorDisplay);
          }, function() {
            return callback(null,directorList);
          });
        } else {
          callback('No directors',null);
        }
      },

      //checking if a new director is already registered
      checkIfExists: function(id,callback){
        var exists = false,
          Director = this;
        Director.findAll().complete(function (err, directors) {
          if(err){
            console.log("Api route error finding user:",err);
            callback(err,null)
          } else {
            async.map(directors, function(director, done) {
              if(director.livestream_id == id){
                exists = true;
                done(exists)
              } else {
                done(exists)
              }
            }, function() {
              return callback(null,exists);
            });
          }
        });
      },

      //validates incoming data from the post to make a new director
      validateDirector: function(body,callback){

        var livestream_id,
          camera,
          movies;

        //requires a valid livestream_id to process
        if(validator.isNumeric(body.livestream_id)){
          livestream_id = body.livestream_id;
          console.log("livestream id in param: ",livestream_id)
        } else {
          callback('Missing livestream id',null);
        }

        //validates camera and movie strings
        camera = validator.isAlphanumeric(body.camera) ? body.camera : '';
        movies = validator.isAscii(body.movies) ? body.movies : '';

        callback(null,[livestream_id,camera,movies])
      }
    },

    instanceMethods: {

      //handles display for an individual director
      display: function(callback){
        var director = this;
        var directorDisplay = {};
        directorDisplay.full_name = director.full_name;
        directorDisplay.dob = director.dob;
        directorDisplay.favorite_camera = director.favorite_camera;
        directorDisplay.favorite_movies = director.favorite_movies.split(",");
        callback(null,directorDisplay)
      }

    }
  }); //sequelize.define
}; //module.exports

