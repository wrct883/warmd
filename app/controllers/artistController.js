'use strict';

var mongoose = require('mongoose'),
    Artist = mongoose.model('Artist');

module.exports = {
  // Create a new Artist
  create: function(req, res) {
    var newArtist = new Artist(req.body);
    newArtist.save()
      .then(function(artist) {
        res.status(201).json(artist);
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  // Load a Artist from the database
  load: function(req, res, next, id) {
    Artist.findOne({_id: id})
      .then(function(artist) {
        if (!artist) {
          req.artistData = {
            not_found: true,
            _id: id
          };
        } else {
          req.artistData = artist;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a Artist that was loaded
  show: function(req, res) {
    if (req.artistData.not_found) {
      res.status(404).json({
        QueryError: 'Artist with ID ' + req.artistData._id + ' not found'
      });
    }

    res.json(req.artistData);
  },

  // Update a Artist
  update: function(req, res) {
    if (req.artistData.not_found) {
      res.status(404).json({
        QueryError: 'Artist with id ' + req.artistData._id + ' not found'
      });
    }

    Artist.findOneAndUpdate({_id: req.artistData._id}, req.body, {new: true})
      .then(function(updatedArtist) {
        res.json(updatedArtist);
      })
      .catch(function(err) {
        res.status(400).json(err);
      });
  },

  // Delete a Artist
  delete: function(req, res) {
    if (req.artistData.not_found) {
      res.status(404).json({
        QueryError: 'Artist with id ' + req.artistData._id + ' not found'
      });
    }

    Artist.findOneAndRemove({_id: req.artistData._id})
      .then(function(removedArtist) {
        res.json({removedArtist: removedArtist._id});
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Find Artists
  find: function(req, res) {
    var options = req.body;

    Artist.find(options)
      .then(function(artists) {
        if (artists.length === 0) {
          res.status(404).json({
            QueryError: 'No artists found matching that query'
          });
        }
        res.json(artists);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
