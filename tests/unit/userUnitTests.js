'use strict';

var expect = require('chai').expect,
    User = require('../../app/v1/models/userModel');

describe('The User Model', function() {
  before(function(done) {
    // Start warmd server
    require('../../server');
    done();
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

    newUser.save()
      .then(function(user) {
        return User.find({ username: 'user' });
      })
      .then(function(found) {
        expect(found.length).to.equal(1);
        expect(found[0]).to.have.property('username', 'user');
        found[0].comparePassword('secret', function(matchErr, isMatch) {
          if (matchErr) done(matchErr);

          expect(isMatch).to.be.true;
          done();
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

    User.findOne({ username: 'user' })
      .then(function(user) {
        expect(user).to.have.property('username', 'user');
        expect(user.first_name).to.be.undefined;
        return User.findOneAndUpdate({ username: 'user' }, update, { new: true });
      })
      .then(function(updatedUser) {
        expect(updatedUser).to.have.property('first_name', 'User');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('should delete a user', function(done) {
    User.count({})
      .then(function(count) {
        expect(count).to.equal(1);
        return User.findOneAndRemove({ username: 'user' });
      })
      .then(function(removedUser) {
        expect(removedUser).to.have.property('username', 'user');
        return User.count({});
      })
      .then(function(count) {
        expect(count).to.equal(0);
        done();
      })
      .catch(function(err) {
        done(err);
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
