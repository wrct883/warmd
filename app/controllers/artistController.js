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
