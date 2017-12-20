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
    required: true
  },
  short_name: {
    type: String,
    required: true
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Artist', ArtistSchema);
