'use strict';

var mongoose = require('mongoose'),
    Album = mongoose.model('Album');

module.exports = {
  // Create a new Album
  create: function(req, res) {
    var newAlbum = new Album(req.body);
    newAlbum.save()
      .then(function(album) {
        res.status(201).json(album);
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

  // Load a Album from the database
  load: function(req, res, next, id) {
    Album.findOne({_id: id})
      .then(function(album) {
        if (!album) {
          req.albumData = {
            not_found: true,
            _id: id
          };
        } else {
          req.albumData = album;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a Album that was loaded
  show: function(req, res) {
    if (req.albumData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Album with ID ' + req.albumData._id + ' not found'
      });
    }

    res.json(req.albumData);
  },

  // Update a Album
  update: function(req, res) {
    if (req.albumData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Album with id ' + req.albumData._id + ' not found'
      });
    }

    Album.findOneAndUpdate({_id: req.albumData._id}, req.body, {new: true})
      .then(function(updatedAlbum) {
        res.json(updatedAlbum);
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

  // Delete a Album
  delete: function(req, res) {
    if (req.albumData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Album with id ' + req.albumData._id + ' not found'
      });
    }

    Album.findOneAndRemove({_id: req.albumData._id})
      .then(function(removedAlbum) {
        res.json({removedAlbum: removedAlbum._id});
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Find Albums
  find: function(req, res) {
    var options = req.body;

    Album.find(options)
      .then(function(albums) {
        if (albums.length === 0) {
          return res.status(404).json({
            error: 'QueryError',
            message: 'No albums found matching that query'
          });
        }
        res.json(albums);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
