'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;
var NestedArtistSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  _id: {
    type: String,
    required: true
  }
});

var AlbumSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  artists: {
    type: [NestedArtistSchema],
    required: true
  },
  label: {
    type: String,
    trim: true
  },
  format: {
    type: String,
    enum: ['LP', '12"', '10"', 'EP', '7"', 'CD', 'Cassette', 'Digital']
  },
  year: {
    type: Number
  },
  is_comp: {
    type: Boolean
  },
  location: {
    type: String,
    enum: ['Bin', 'TBR', 'N&WC', 'OOB', 'Missing', 'NIB']
  },
  library_add_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  bin_add_date: {
    type: Date
  },
  bin_removal_date: {
    type: Date
  },
  genre: {
    type: String
  }
});
AlbumSchema.index({
  'name': 1,
  'artists.name': 1,
  'artists._id': 1
}, {unique: true});

module.exports = mongoose.model('Album', AlbumSchema);
