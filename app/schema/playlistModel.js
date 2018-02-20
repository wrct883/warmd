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
    required: true
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
PlaylistSchema.index({
  'user': 1,
  'program': 1,
  'start_time': 1,
  'end_time': 1
}, {unique: true});

module.exports = mongoose.model('Playlist', PlaylistSchema);
