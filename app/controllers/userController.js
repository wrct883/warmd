'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  // Create a new User
  create: function(req, res) {
    var newUser = new User(req.body);
    newUser.save()
      .then(function(user) {
        res.status(201).json(user.toJSON());
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
          req.userData = {
            not_found: true,
            username: username
          };
        } else {
          // Can't do req.user, interferes with Passport
          req.userData = user;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a User that was loaded
  show: function(req, res) {
    if (req.query && req.query.exists) {
      res.json({
        username: req.userData.username,
        exists: req.userData.not_found === undefined
      });
    }

    if (req.userData.not_found) {
      res.status(404).json({
        QueryError: 'User with username ' +  req.userData.username + ' not found'
      });
    }

    res.json(req.userData);
  },

  // Update a User
  update: function(req, res) {
    if (req.userData.not_found) {
      res.status(404).json({
        QueryError: 'User with username ' +  req.userData.username + ' not found'
      });
    }

    // A User should only be able to change their own password
    if (req.body.password && (req.userData.username !== req.user.username)) {
      res.status(401).json({
        QueryError: 'Cannot change passwords for other users'
      });
    }

    User.findOneAndUpdate({username: req.userData.username}, req.body, {new: true})
      .then(function(updatedUser) {
        res.json(updatedUser.toJSON());
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  // Delete a User
  delete: function(req, res) {
    if (req.userData.not_found) {
      res.status(404).json({
        QueryError: 'User with username ' +  req.userData.username + ' not found'
      });
    }

    User.findOneAndRemove({username: req.userData.username})
      .then(function(removedUser) {
        res.json({removedUser: removedUser.username});
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Check if someone is currently logged in
  isAuthed: function(req, res, next) {
    process.nextTick(function() {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({
        AuthenticationError: 'You don\'t have permission to view this resource'
      });
    });
  },

  // Check if a User has access to a resource
  hasAccess: function(level) {
    var levels = ['None', 'User', 'Exec', 'Admin'];
    return function(req, res, next) {
      var minimumAuth = levels.indexOf(level);
      // Is the logged in user at *least* the provided level of auth?
      if (req.user && levels.indexOf(req.user.auth_level) >= minimumAuth) {
        next();
      } else {
        res.status(401).json({
          AuthenticationError: 'You don\'t have permission to use this resource'
        });
      }
    };
  },

  // Show all Users
  // If called with pending=true, show all pending Users
  all: function(req, res) {
    var options = {};
    if (req.query && req.query.pending) {
      // Show only pending users
      options.auth_level = 'None';
    }

    User.find(options)
      .then(function(users) {
        res.json(users);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
