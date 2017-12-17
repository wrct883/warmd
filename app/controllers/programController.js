'use strict';

var mongoose = require('mongoose'),
    Program = mongoose.model('Program');

module.exports = {
  // Create a new Program
  create: function(req, res) {
    // Keep track of when the show was made
    req.body.created_at = new Date(req.body.created_at) || new Date(Date.now());
    // Generate promo code if one is not provided
    if (!req.body.promo_code) {
      var promoSemester = findSemester(req.body.created_at);
      var promoYear = (req.body.created_at.getFullYear()) % 100;
      Program.count({
        promo_code: new RegExp('^PRO' + promoSemester + promoYear)
      })
        .then(function(count) {          // Create a promo code based on how many shows were also made this semester
          // If < 9 shows, make promoCount a two digit string
          var promoCount = (count % 10 === count) ? '0' + count : count;
          req.body.promo_code = 'PRO' + promoSemester + promoYear + '-' + promoCount;
          var newProgram = new Program(req.body);
          return newProgram.save();
        })
        .then(function(program) {
          res.status(201).json(program);
        })
        .catch(function(err) {
          console.log(err);
          res.status(400).json(err);
        });
    } else {
      var newProgram = new Program(req.body);
      newProgram.save()
        .then(function(program) {
          res.status(201).json(program);
        })
        .catch(function(err) {
          res.status(400).json(err);
        });
    }
  }
};

// Helper functions
// Given a datetime, generate a semester string that the date is in
var findSemester = function(datetime) {
  // Jan-April (months 0-3) === Spring
  // May-August (months 4-7) === Summer
  // September-December (months 8-11) === Fall
  if (datetime.getMonth() < 4) {
    return 'S';
  } else if (datetime.getMonth() >= 4 && datetime.getMonth() < 8) {
    return 'SUM';
  }
  return 'F';
};
