'use strict';

var expect = require('chai').expect,
    User = require('../../app/schema/userModel');

describe('The User Model', function() {
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
