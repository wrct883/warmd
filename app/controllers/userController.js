'use strict';

var checkit = require('checkit'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  // Create a new User
  create: function(req, res) {
    var newUser = new User(req.body);
    newUser
      .save()
      .then(function(user) {
        res.json(user);
      })
      .catch(function(err) {
        res.send(err);
      });
  },

  // Load a User from the database
  load: function(req, res, next, username) {
    User
      .findOne({username: username})
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
    User
      .findOneAndUpdate({username: req.userData.username}, req.body, {new: true})
      .then(function(updatedUser) {
        res.json(updatedUser);
      })
      .catch(function(err) {
        res.send(err);
      });
  },

  // Delete a User
  delete: function(req, res) {
    User
      .findOneAndRemove({username: req.userData.username})
      .then(function(removedUser) {
        res.json(200, {
          removedUser: removedUser.username
        });
      })
      .catch(function(err) {
        res.json(500, err);
      });
  },

  exists: function(req, res) {
    if (!req.body.username && !req.body.email) {
      res.json(400, {
        error: 'GET /exists must contain either a username, an email, or both'
      });
    }

    checkit({username: ['string'], email: ['string']})
      .run(req.body)
      .then(function(data) {
        User.findOne(req.body, function(err, result) {
          if (err) {
            res.send(err);
          }
          res.json({exists: (result !== null)});
        });
      });
  }
};
