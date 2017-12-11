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
    User
      .findOneAndUpdate(req.userData.username, req.body, {new: true})
      .then(function(updatedUser) {
        res.json(updatedUser);
      })
      .catch(function(err) {
        res.send(err);
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
