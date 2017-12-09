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
      console.dir(err.errors, {depth: 0});
      done();
    });
  });
});
