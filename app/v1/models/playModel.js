'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;
var PlaySchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  artist_id: {
    type: String,
    trim: true
  },
  album_id: {
    type: String,
    required: true
  },
  trackname: {
    type: String,
    trim: true,
    required: true
  },
  is_bin_cut: {
    type: Boolean,
    default: false
  },
  is_request: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Play', PlaySchema);
