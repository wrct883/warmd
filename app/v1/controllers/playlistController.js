'use strict';

var mongoose = require('mongoose'),
    Playlist = mongoose.model('Playlist');

module.exports = {
  // Create a new Playlist
  create: function(req, res) {
    var newPlaylist = new Playlist(req.body);
    newPlaylist.save()
      .then(function(playlist) {
        res.status(201).json(playlist);
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

  // Load a Playlist from the database
  load: function(req, res, next, id) {
    Playlist.findOne({ _id: id })
      .then(function(playlist) {
        if (!playlist) {
          req.playlistData = {
            not_found: true,
            _id: id
          };
        } else {
          req.playlistData = playlist;
        }
        next();
      })
      .catch(function(err) {
        next(err);
      });
  },

  // Display a Playlist that was loaded
  show: function(req, res) {
    if (req.playlistData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Playlist with id ' + req.playlistData._id + ' not found'
      });
    }

    res.json(req.playlistData);
  },

  // Update a Playlist
  update: function(req, res) {
    if (req.playlistData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Playlist with id ' + req.playlistData._id + ' not found'
      });
    }

    Playlist.findOneAndUpdate({ _id: req.playlistData._id }, req.body, { new: true })
      .then(function(updatedPlaylist) {
        res.json(updatedPlaylist);
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

  // Delete a Playlist
  delete: function(req, res) {
    if (req.playlistData.not_found) {
      return res.status(404).json({
        error: 'QueryError',
        message: 'Playlist with id ' + req.playlistData._id + ' not found'
      });
    }

    Playlist.findOneAndRemove({ _id: req.playlistData._id })
      .then(function(removedPlaylist) {
        res.json({ removedPlaylist: removedPlaylist._id });
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  },

  // Find Playlists
  find: function(req, res) {
    var options = req.body;

    Playlist.find(options)
      .then(function(playlists) {
        if (playlists.length === 0) {
          return res.status(404).json({
            error: 'QueryError',
            message: 'No playlists found matching that query'
          });
        }
        res.json(playlists);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  }
};
