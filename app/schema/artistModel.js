'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    toWords = require('number-to-words').toWords;

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
  alpha_name: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    trim: true
  }
});

// Auto generate alpha name if one is not provided
ArtistSchema.pre('save', function(next) {
  var artist = this;
  if (!artist.alpha_name) {
    artist.alpha_name = generateAlphaName(artist.name);
  }
  next();
});

module.exports = mongoose.model('Artist', ArtistSchema);

// Helper functions
// Given an artist name, try to auto generate an alphaname
// Things this function does NOT account for
// - Alphabetizing artists by their last name rather than their first
// - Alphebetizing bands/artists with abbreviations by spelling out the abbreviation (e.g. 'Dr.', 'St.')
// - Alphabetizing numbers with decimals
var generateAlphaName = function(artistName) {
  return artistName
    .toLowerCase()
    .replace(/(\d)/g, function(match, offset, string) {
      return toWords(parseInt(match, 10));
    })
    .replace(/ & /g, ' and ') // Replace '&' with 'and'
    .match(/\w/g).join('') // Strip all non alphanumeric characters
    .replace(/^the/i, ''); // Remove leading 'the'
};
