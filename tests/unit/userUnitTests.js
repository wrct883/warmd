'use strict';

var expect = require('chai').expect,
    mongoose = require('mongoose');

// Mongoose models
var User = require('../../app/schema/userModel');

describe('The User Model', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/warmd', {useMongoClient: true});
    mongoose.Promise = global.Promise;

    // Set up event handlers
    var db = mongoose.connection;
    db.on('error', function(err) {
      done(err);
    });
    db.once('open', function() {
      console.log('Connected to MongoDB instance');
      done();
    });
  });

  it('should not validate new users with insufficient information', function(done) {
    var newUser = new User({
      email: 'newuser@example.com'
    });

    newUser.validate(function(err) {
      expect(err.name).to.equal('ValidationError');
      done();
    });
  });

  it('should validate new users with the right amount of information', function(done) {
    var newUser = new User({
      username: 'user',
      password: 'secret',
      email: 'newuser@example.com'
    });

    newUser.validate(function(err) {
      expect(err).to.be.null;
      done();
    });
  });

  it('should create a new User', function(done) {
    var newUser = new User({
      username: 'user',
      password: 'secret',
      email: 'newuser@example.com'
    });

    newUser
      .save(newUser)
      .then(function(user) {
        User.find({username: 'user'}, function(err, found) {
          if (err) done(err);
          expect(found.length).to.equal(1);
          expect(found[0]).to.have.property('username', 'user');
          found[0].comparePassword('secret', function(matchErr, isMatch) {
            if (matchErr) done(matchErr);

            expect(isMatch).to.be.true;
            done();
          });
        });
      })
      .catch(function(err) {
        done(err);
      });
  });

  after(function(done) {
    // Drop Users collection
    User.remove({}, function(err) {
      if (err) done(err);
      console.log('Users collection dropped');
      done();
    });
  });
});
