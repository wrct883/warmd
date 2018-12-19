'use strict';

var LocalStrategy = require('passport-local').Strategy,
    User = require('../app/models/userModel');

module.exports = function(passport) {
  // user -> username
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  // id -> user
  passport.deserializeUser(function(username, done) {
    User.findOne({ username: username })
      .then(function(user) {
        if (!user) { // No user found
          done(new Error('No User found'));
        } else {
          done(null, user);
        }
      })
      .catch(function(err) {
        done(err);
      });
  });

  // use local strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username })
        .then(function(user) {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }
          // Found user
          user.comparePassword(password, function(matchErr, isMatch) {
            if (matchErr) done(matchErr);
            if (isMatch) return done(null, user);
            return done(null, false, { message: 'Incorrect password' });
          });
        })
        .catch(function(err) { // Could not find user / something went wrong
          return done(err);
        });
    }
  ));
};
