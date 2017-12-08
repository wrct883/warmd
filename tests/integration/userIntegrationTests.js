'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../mongoServer');

describe('The Users controller', function() {
  it('should check if a User exists given their username', function(done) {
    request.agent(app)
      .post('/users/exists')
      .send({
        username: 'matodd'
      })
      .end(function(err, res) {
        should.not.exist(err);
        done();
      });
  });
});
