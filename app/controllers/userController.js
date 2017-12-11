'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  // Create a new User
  create: function(req, res) {
    var newUser = new User(req.body);
    newUser.save()
      .then(function(user) {
        res.json(user);
      })
      .catch(function(err) {
        res.json(err);
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
    res.json(req.userData);
  },

  // Update a User
  update: function(req, res) {
    User.findOneAndUpdate({username: req.userData.username}, req.body, {new: true})
      .then(function(updatedUser) {
        res.json(updatedUser);
      })
      .catch(function(err) {
        res.json(err);
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
      res.json({
        error: 'GET /exists must contain either a username, an email, or both'
      });
    }

    User.findOne(req.body)
      .then(function(result) {
        res.json({exists: (result !== null)});
      })
      .catch(function(err) {
        res.json(err);
      });
  }
};
