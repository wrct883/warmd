'use strict';

var mongoose = require('mongoose'),
    Review = mongoose.model('Review');

module.exports = {
  // Create a new Review
  create: function(req, res) {
    var newReview = new Review(req.body);
    newReview.save()
      .then(function(review) {
        res.status(201).json(review);
      })
      .catch(function(err) {
        // Duplicate Key Error
        if (err.code && err.code === 11000) {
          res.status(400).json({
            error: 'InsertionError',
            message: 'Duplicate Key Error'
          });
        }
        res.status(400).json(err);
      });
  },

  // Load a Review from the database
  load: function(req, res, next, id) {
    Review.findOne({_id: id})
      .then(function(review) {
        if (!review) {
          req.reviewData = {
            not_found: true,
            _id: id
          };
        } else {
          req.reviewData = review;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a Review that was loaded
  show: function(req, res) {
    if (req.reviewData.not_found) {
      res.status(404).json({
        error: 'QueryError',
        message: 'Review with ID ' + req.reviewData._id + ' not found'
      });
    }

    res.json(req.reviewData);
  },

  // Update a Review
  update: function(req, res) {
    if (req.reviewData.not_found) {
      res.status(404).json({
        error: 'QueryError',
        message: 'Review with id ' + req.reviewData._id + ' not found'
      });
    }

    Review.findOneAndUpdate({_id: req.reviewData._id}, req.body, {new: true})
      .then(function(updatedReview) {
        res.json(updatedReview);
      })
      .catch(function(err) {
        // Duplicate Key Error
        if (err.code && err.code === 11000) {
          res.status(400).json({
            error: 'UpdateError',
            message: 'Duplicate Key Error'
          });
        }
        res.status(400).json(err);
      });
  },

  // Delete a Review
  delete: function(req, res) {
    if (req.reviewData.not_found) {
      res.status(404).json({
        error: 'QueryError',
        message: 'Review with id ' + req.reviewData._id + ' not found'
      });
    }

    Review.findOneAndRemove({_id: req.reviewData._id})
      .then(function(removedReview) {
        res.json({removedReview: removedReview._id});
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Find Reviews
  find: function(req, res) {
    var options = req.body;

    Review.find(options)
      .then(function(reviews) {
        if (reviews.length === 0) {
          res.status(404).json({
            error: 'QueryError',
            message: 'No reviews found matching that query'
          });
        }
        res.json(reviews);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
