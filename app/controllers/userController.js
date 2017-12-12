'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  // Create a new User
  create: function(req, res) {
    var newUser = new User(req.body);
    newUser.save()
      .then(function(user) {
        res.json(user.toJSON());
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  // Load a User from the database
  load: function(req, res, next, username) {
    User.findOne({username: username})
      .then(function(user) {
        if (!user) {
          next(new Error('User with username ' + username + ' not found'));
        }

        // Can't do req.user, interferes with Passport
        req.userData = user;
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a User that was loaded
  show: function(req, res) {
    res.json(req.userData.toJSON());
  },

  // Update a User
  update: function(req, res) {
    User.findOneAndUpdate({username: req.userData.username}, req.body, {new: true})
      .then(function(updatedUser) {
        res.json(updatedUser.toJSON());
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  // Delete a json
  delete: function(req, res) {
    User.findOneAndRemove({username: req.userData.username})
      .then(function(removedUser) {
        res.json({removedUser: removedUser.username});
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  exists: function(req, res) {
    if (!req.body.username && !req.body.email) {
      res.status(400).json({
        error: 'GET /exists must contain either a username, an email, or both'
      });
    }

    User.findOne(req.body)
      .then(function(result) {
        res.json({exists: (result !== null)});
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  isAuthed: function(req, res, next) {
    process.nextTick(function() {
      if (req.isAuthenticated()) {
        return next();
      }

      // Remember where they were going
      req.session.returnTo = req.originalUrl;
      res.redirect('/login');
    });
  },

  session: function(req, res) {
    var redirectTo = req.session.returnTo
      ? req.session.returnTo
      : '/';
    res.redirectTo(redirectTo);
  },

  // Render a user login page
  login: function(req, res) {
    res.format({
      // Asking for JSON but aren't authed.
      json: function() {
        // TODO: Make sure JSON errors are formatted uniformly. Maybe a util function?
        res.status(401).json({
          error: 'You don\'t have permission to view this resource. Try loggin in.'
        });
      },

      // They were rerouted from something else, should just log in.
      html: function() {
        res.render('users/login');
      }
    });
  },

  // Log the user out, redirect back to login.
  logout: function(req, res) {
    req.logout();
    res.redirect('/login');
  }
};
