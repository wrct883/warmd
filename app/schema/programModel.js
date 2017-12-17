'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ProgramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  start_time: {
    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      required: true
    },
    hour: {
      type: String,
      match: [
        /^([01]\d|2[0-3]):?([0-5]\d)$/,
        '({VALUE}) must be formatted as a 24-hour time string'
      ],
      requred: true
    }
  },
  end_time: {
    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      required: true
    },
    hour: {
      type: String,
      match: [
        /^([01]\d|2[0-3]):?([0-5]\d)$/,
        '({VALUE}) must be formatted as a 24-hour time string'
      ],
      required: true
    }
  },
  promo: {
    type: String
  },
  promo_code: {
    type: String
  },
  type: {
    type: String,
    enum: ['show', 'pa'],
    required: true
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  },
  website: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

module.exports = mongoose.model('Program', ProgramSchema);
