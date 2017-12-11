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

  it('should update that new User', function(done) {
    var update = {
      first_name: 'User'
    };

    // We initally expect the User to not have a first name
    User
      .findOne({username: 'user'})
      .then(function(user) {
        expect(user).to.have.property('username', 'user');
        expect(user.first_name).to.be.undefined;
      })
      .catch(function(err) {
        done(err);
      });

    // Now let's add one
    User
      .findOneAndUpdate({username: 'user'}, update, {new: true})
      .then(function(updatedUser) {
        expect(updatedUser).to.have.property('first_name', 'User');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('should delete a user', function(done) {
    User
      .count({})
      .then(function(count) {
        expect(count).to.equal(1);
      })
      .catch(function(err) {
        done(err);
      });

    User
      .findOneAndRemove({username: 'user'})
      .then(function(removedUser) {
        expect(removedUser).to.have.property('username', 'user');
        User.count({}, function(err, count) {
          if (err) done(err);
          expect(count).to.equal(0);
          done();
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
