var config = global.config = require('./config.js'),
  express = require('express'),
  crypto = require('crypto'),
  validator = require('validator');

app = express();
app.configure(function() {
  app.use(express.bodyParser());
//  app.use(express.methodOverride());
  app.set('view engine', 'html');
  app.set('layout', '_layout');
  app.set('partials', {head: "_head"});
  app.enable('view cache');
  app.use('/static', express.static(__dirname + '/static'));
  app.set('models', require('./models'));
});

app.listen(config.port, function() {
  console.log("Starting server on port: " + config.port);
});

/*
 ===========================================================================
 Database
 ===========================================================================
 */

app.get('models').sequelize.sync().complete(function(err, result) {
  if(err) {
    console.log('Error syncing database',err)
  } else {
    console.log('Done syncing database');
    app.get('models')
  }
});


/*
 ===========================================================================
 Routes
 ===========================================================================
 */

function ensureAuthorized(req, res, next) {
  var directorId = req.url.split("/")[3],
    Director = app.get("models").Director,
    token = req.headers.authorization;

  console.log('checking api update authentication.');
  Director.find({where: {id: directorId}}).complete(function (err, director) {
    if(err){
      console.log("Api route error finding user:",err);
      res.send({error:err})
    } else {
      var auth_check = crypto.createHash('md5').update(director.full_name).digest('hex');
      if(token && token.indexOf('Bearer ') == 0){
        token = token.replace('Bearer ','');
      }

      if(token == auth_check){
        console.log('api authentication verified.');
        return next();
      } else {
        console.log('api authentication failed');
        res.send('Unauthorized',403);
      }
    }
  });
}

var api_handler = require('./handlers/api_handler');

app.get('/api/directors',api_handler.getDirectors);
app.get('/api/directors/:director_id(\\d+)', api_handler.getDirector);
app.post('/api/directors', api_handler.saveDirector);
app.put('/api/directors/:director_id(\\d+)', ensureAuthorized, api_handler.updateDirector);

exports = module.exports = app;
