'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;
var ArtistSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  short_name: {
    type: String,
    trim: true,
    required: true
  },
  comment: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Artist', ArtistSchema);
