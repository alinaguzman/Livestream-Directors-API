var config = global.config || require( __dirname + '/../config.js');

if (!global.hasOwnProperty('db')) {

  var Sequelize = require('sequelize');
  var sequelize = null;

  var match = config.database_url.match(/postgres(ql)?:\/\/(([^:]+):([^@]+)@)?([^:]+):(\d+)\/(.+)/)
  sequelize = new Sequelize(match[7], match[3], match[4], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[6] || '5432',
    host:     match[5] || 'localhost',
    logging:  config.database_logging || false,
    omitNull: true  // missing, caused errors with new models
  });

  var Director = sequelize.import(__dirname + '/director');

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Director:       Director
  }
}

module.exports = global.db;
