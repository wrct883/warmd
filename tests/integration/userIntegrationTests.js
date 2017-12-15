'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/schema/userModel');

describe('The Users controller', function() {
  before(function(done) {
    var admin = new User({
      username: 'admin',
      password: 'adminSecret',
      email: 'admin@example.com',
      auth_level: 'Admin'
    });

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

    admin.save()
      .then(function() {
        return testUser1.save();
      })
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

  describe('/auth', function() {
    it('should authenticate a username/password combo', function(done) {
      request.agent(app)
        .post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          expect(res.body).to.have.property('ok', 1);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('/users', function() {
    it('should create a new User', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/users')
            .send({
              username: 'test4',
              password: 'secret4',
              email: 'test4@example.com'
            })
            .expect(201);
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'test4');
          expect(res.body).to.not.have.property('password');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should retrieve all users with a GET request', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/users')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.length(5);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should fail to create a User with insufficient information', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/users')
            .send({
              username: 'testBad'
            })
            .expect(400);
        })
        .then(function(res) {
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('email');
          expect(res.body.errors).to.have.property('password');
          done();
        });
    });

    it('should not allow non-admins to create Users', function(done) {
      var nonAdmin = request.agent(app);
      nonAdmin.post('/auth')
        .send({
          username: 'test1',
          password: 'secret1'
        })
        .expect(200)
        .then(function(res) {
          return nonAdmin.post('/users')
            .send({
              username: 'test5',
              password: 'hubris'
            })
            .expect(401);
        })
        .then(function(res) {
          expect(res.body).to.have.property('AuthenticationError');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should require auth', function(done) {
      request.agent(app)
        .post('/users')
        .send({
          username: 'notAuthed',
          password: 'secrets',
          email: 'notAuthed@example.com'
        })
        .expect(401)
        .then(function(res) {
          expect(res.body).to.have.property('AuthenticationError');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should get all pending users', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/users?pending=true')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.length(4);
          res.body.forEach(function(user) {
            expect(user).to.have.property('auth_level', 'None');
          });
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('/users/:user', function() {
    it('should retrive a User with a GET request', function(done) {
      var user = request.agent(app);
      user.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.get('/users/test1')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'test1');
          expect(res.body).to.have.property('email', 'test1@example.com');
          expect(res.body).to.not.have.property('password');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should check if a User exists', function(done) {
      var user = request.agent(app);
      user.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.get('/users/test1?exists=true')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'test1');
          expect(res.body).to.have.property('exists', true);
        })
        .then(function(res) {
          return user.get('/users/badUser?exists=true');
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'badUser');
          expect(res.body).to.have.property('exists', false);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should modify a User with a PUT request', function(done) {
      var user = request.agent(app);
      user.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.put('/users/test1')
            .send({
              first_name: 'Test',
              last_name: 'One'
            })
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('first_name', 'Test');
          expect(res.body).to.have.property('last_name', 'One');
          expect(res.body).to.not.have.property('password');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should prevent Users from modifying other User\'s passwords', function(done) {
      var user = request.agent(app);
      user.post('/auth')
        .send({
          username: 'test1',
          password: 'secret1'
        })
        .expect(200)
        .then(function(res) {
          // Users should be able to change their own passwords
          return user.put('/users/test1')
            .send({
              password: 'newPassword'
            })
            .expect(200);
        })
        .then(function(res) {
          // Users can't change other User's passwords
          return user.put('/users/test2')
            .send({
              password: 'alsoNewPassword'
            })
            .expect(401);
        })
        .then(function(res) {
          expect(res.body).to.have.property('QueryError');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should delete a User with a DELETE request', function(done) {
      var user = request.agent(app);
      user.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.delete('/users/test4')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('removedUser', 'test4');
          done();
        })
        .catch(function(err) {
          done(err);
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
