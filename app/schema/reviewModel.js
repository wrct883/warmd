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
    required: true,
    default: new Date()
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

module.exports = mongoose.model('Review', ReviewSchema);
