'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server');

describe('The Users controller', function() {
  it('should check if a User exists given their username', function(done) {
    request.agent(app)
      .post('/users/exists')
      .send({
        username: 'matodd'
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('exists', false);
        done();
      });
  });
});
