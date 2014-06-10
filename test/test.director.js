var config = global.config = require('../config.js'),
  assert = require('assert'),
  http = require('http'),
  server = require('../server.js'),
  request = require('supertest');


describe('should return proper route responses', function() {
  before(function (done) {
    server.listen(8000,  done);
  });

  it('/api/directors get should return 200', function (done) {
    http.get('http://localhost:8082/api/directors', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('GET /api/directors/:id should return 200',function(done){
    http.get('http://localhost:8082/api/directors/1', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('POST /api/directors should return 200',function(done){
    request('http://localhost:8082')
      .post('/api/directors/')
      .set('Content-Type','application/json')
      .send(JSON.stringify({ livestream_id: '12345', full_name: 'Alina Guzman' }))
      .expect(200,done);
  });

  it('POST /api/directors/id should return 200',function(done){
    request('http://localhost:8082')
      .post('/api/directors/1')
      .set('Content-Type','application/json')
      .set('Authorization','e4a1bc553ced3b24e037df06e2919b6c')
      .send(JSON.stringify({ camera: 'Sony 2', movies: 'Interview with the Vampire, Armageddon' }))
      .expect(200,done);
  });

});


