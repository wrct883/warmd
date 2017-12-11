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

  describe('/users/exists', function() {
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

  describe('/users/new', function() {
    it('should create a new User', function(done) {
      request.agent(app)
        .post('/users/new')
        .send({
          username: 'test4',
          password: 'secret4',
          email: 'test4@example.com'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('username', 'test4');
          expect(res.body).to.not.have.property('password');
          done();
        });
    });

    it('should fail to create a User with insufficient information', function(done) {
      request.agent(app)
        .post('/users/new')
        .send({
          username: 'testBad'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('email');
          expect(res.body.errors).to.have.property('password');
          done();
        });
    });
  });

  describe('/users/:user', function() {
    it('should retrive a User with a GET request', function(done) {
      request.agent(app)
        .get('/users/test1')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('username', 'test1');
          expect(res.body).to.have.property('email', 'test1@example.com');
          expect(res.body).to.not.have.property('password');
          done();
        });
    });

    it('should modify a User with a PUT request', function(done) {
      request.agent(app)
        .put('/users/test1')
        .send({
          first_name: 'Test',
          last_name: 'One'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('first_name', 'Test');
          expect(res.body).to.have.property('last_name', 'One');
          expect(res.body).to.not.have.property('password');
          done();
        });
    });

    it('should delete a User with a DELETE request', function(done) {
      request.agent(app)
        .delete('/users/test4')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('removedUser', 'test4');
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
