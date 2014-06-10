var async = require('async');
module.exports = function(sequelize, DataTypes) {

  return sequelize.define("Director", {
    livestream_id:   DataTypes.STRING,
    full_name:       DataTypes.STRING,
    dob:             DataTypes.STRING,
    favorite_camera: DataTypes.STRING,
    favorite_movies: DataTypes.STRING
  },{
    classMethods: {

      displayAll: function(directors,callback){
        if(directors.length > 0){
          var directorList = [];
          async.map(directors, function(director, done) {

            //combine data from db and api to display each director here
            directorList.push(director);
            done(null,director);
          }, function() {
            return callback(null,directorList);
          });
        } else {
          callback('No directors',null);
        }
      }
    },
    instanceMethods: {

    }
  }); //sequelize.define
}; //module.exports

