'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  username: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  album_id: {
    type: String,
    trim: true,
    required: true
  },
  review: {
    type: String,
    trim: true,
    required: true
  }
});
ReviewSchema.index({
  'username': 1,
  'album_id': 1
}, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
