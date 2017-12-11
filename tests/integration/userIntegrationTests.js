'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/schema/userModel');

describe('The Users controller', function() {
  before(function(done) {
    var testUser1 = new User({
      username: 'test1',
      password: 'secret1',
      email: 'test1@example.com'
    });

    var testUser2 = new User({
      username: 'test2',
      password: 'secret2',
      email: 'test2@example.com'
    });

    var testUser3 = new User({
      username: 'test3',
      password: 'secret3',
      email: 'test3@example.com'
    });

    testUser1.save()
      .then(function() {
        return testUser2.save();
      })
      .then(function() {
        return testUser3.save();
      })
      .then(function() {
        done();
      });
  });

  describe('GET /users/exists', function() {
    it('should check if a User exists given their username', function(done) {
      request.agent(app)
        .post('/users/exists')
        .send({
          email: 'test1@example.com'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('exists', true);
          done();
        });
    });

    it('should check if a User exists given their email', function(done) {
      request.agent(app)
        .post('/users/exists')
        .send({
          email: 'test1@example.com'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('exists', true);
          done();
        });
    });
  });

  after(function(done) {
    User.remove({})
      .then(function() {
        console.log('Users collection dropped');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
