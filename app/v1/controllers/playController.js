'use strict';

var mongoose = require('mongoose'),
    Play = mongoose.model('Play');

module.exports = {
  // Create a new Play
  create: function(req, res) {
    var newPlay = new Play(req.body);
    newPlay.save()
      .then(function(play) {
        res.status(201).json(play);
      })
      .catch(function(err) {
        // Duplicate Key Error
        if (err.code && err.code === 11000) {
          return res.status(400).json({
            error: 'InsertionError',
            message: 'Duplicate Key Error'
          });
        }
        res.status(400).json(err);
      });
  },

  // Load a Play from the database
  load: function(req, res, next, id) {
    Play.findOne({ _id: id })
      .then(function(play) {
        if (!play) {
          req.playData = {
            not_found: true,
            _id: id
          };
        } else {
          req.playData = play;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a Play that was loaded
  show: function(req, res) {
    if (req.playData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Play with id ' + req.playData._id + ' not found'
      });
    }

    res.json(req.playData);
  },

  // Update a Play
  update: function(req, res) {
    if (req.playData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Play with id ' + req.playData._id + ' not found'
      });
    }

    Play.findOneAndUpdate({ _id: req.playData._id }, req.body, { new: true })
      .then(function(updatedPlay) {
        res.json(updatedPlay);
      })
      .catch(function(err) {
        // Duplicate Key Error
        if (err.code && err.code === 11000) {
          return res.status(400).json({
            error: 'UpdateError',
            message: 'Duplicate Key Error'
          });
        }
        res.status(400).json(err);
      });
  },

  // Delete a Play
  delete: function(req, res) {
    if (req.playData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Play with id ' + req.playData._id + ' not found'
      });
    }

    Play.findOneAndRemove({ _id: req.playData._id })
      .then(function(removedPlay) {
        res.json({ removedPlay: removedPlay._id });
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Find Plays
  find: function(req, res) {
    var options = req.body;

    Play.find(options)
      .then(function(plays) {
        if (plays.length === 0) {
          return res.status(404).json({
            error: 'QueryError',
            message: 'No plays found matching that query'
          });
        }
        res.json(plays);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
