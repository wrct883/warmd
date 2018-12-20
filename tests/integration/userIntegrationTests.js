'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/v1/models/userModel');

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
      email: 'test1@example.com',
      training_status: {
        is_air_trained: true
      }
    });

    var testUser2 = new User({
      username: 'test2',
      password: 'secret2',
      email: 'test2@example.com',
      dj_name: 'DJ Test 2'
    });

    var testUser3 = new User({
      username: 'test3',
      password: 'secret3',
      email: 'test3@example.com',
      first_name: 'Test',
      last_name: 'Three',
      auth_level: 'Exec'
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

  describe('/v1/auth', function() {
    it('should authenticate a username/password combo', function(done) {
      request.agent(app)
        .post('/v1/auth')
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

  describe('/v1/users', function() {
    it('should create a new User', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/users')
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
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/v1/users')
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
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/users')
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
      nonAdmin.post('/v1/auth')
        .send({
          username: 'test1',
          password: 'secret1'
        })
        .expect(200)
        .then(function(res) {
          return nonAdmin.post('/v1/users')
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
        .post('/v1/users')
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
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/v1/users?pending=true')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.length(3);
          res.body.forEach(function(user) {
            expect(user).to.have.property('auth_level', 'None');
          });
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should find users based on some query', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Find all users that are air cleared
          return admin.get('/v1/users')
            .send({
              'training_status.is_air_trained': true
            })
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.nested.property('training_status.is_air_trained', true);

          // Find all users that have auth levels of 'Exec' or 'Admin'
          return admin.get('/v1/users')
            .send({
              'auth_level': {
                '$in': ['Exec', 'Admin']
              }
            })
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.length(2);
          res.body.forEach(function(user) {
            expect(user.auth_level).to.be.oneOf(['Exec', 'Admin']);
          });

          // Find all users with is_couch_director=true
          // Should return 0 users
          return admin.get('/v1/users')
            .send({
              'is_couch_director': true
            })
            .expect(404);
        })
        .then(function(res) {
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('/v1/users/:user', function() {
    it('should retrive a User with a GET request', function(done) {
      var user = request.agent(app);
      user.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.get('/v1/users/test1')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'test1');
          expect(res.body).to.have.property('email', 'test1@example.com');
          expect(res.body).to.not.have.property('password');
          return user.get('/v1/users/badTest')
            .expect(404);
        })
        .then(function(res) {
          expect(res.body).to.have.property('QueryError');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should check if a User exists', function(done) {
      var user = request.agent(app);
      user.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.get('/v1/users/test1?exists=true')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('username', 'test1');
          expect(res.body).to.have.property('exists', true);
          return user.get('/v1/users/badUser?exists=true')
            .expect(200);
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
      user.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.put('/v1/users/test1')
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
          return user.put('/v1/users/badUser')
            .send({
              first_name: 'Bad',
              last_name: 'User'
            })
            .expect(404);
        })
        .then(function(res) {
          expect(res.body).to.have.property('QueryError');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it("should prevent Users from modifying other User's passwords", function(done) {
      var user = request.agent(app);
      user.post('/v1/auth')
        .send({
          username: 'test1',
          password: 'secret1'
        })
        .expect(200)
        .then(function(res) {
          // Users should be able to change their own passwords
          return user.put('/v1/users/test1')
            .send({
              password: 'newPassword'
            })
            .expect(200);
        })
        .then(function(res) {
          // Users can't change other User's passwords
          return user.put('/v1/users/test2')
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
      user.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return user.delete('/v1/users/test4')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('removedUser', 'test4');
          return user.delete('/v1/users/badTest')
            .expect(404);
        })
        .then(function(res) {
          expect(res.body).to.have.property('QueryError');
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
