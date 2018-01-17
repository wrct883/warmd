'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;
var PlaylistSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  user: {
    type: String,
    required: true
  },
  program: {
    type: String,
    requited: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  comment: {
    type: String
  },
  songs: {
    type: [String]
  }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
