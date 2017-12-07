'use strict';

var checkit = require('checkit'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  exists: function(req, res) {
    if (!req.body.username && !req.body.email) {
      res.json(400, {
        error: '/exists must contain either a username, an email, or both'
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
