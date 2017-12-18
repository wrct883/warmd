'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid');

var Schema = mongoose.Schema;
var ProgramSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  host: {
    type: String,
    trim: true,
    required: true
  },
  start_time: {
    day: {
      type: String,
      trim: true,
      enum: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      required: true
    },
    hour: {
      type: String,
      trim: true,
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
      trim: true,
      enum: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
      required: true
    },
    hour: {
      type: String,
      trim: true,
      match: [
        /^([01]\d|2[0-3]):?([0-5]\d)$/,
        '({VALUE}) must be formatted as a 24-hour time string'
      ],
      required: true
    }
  },
  promo: {
    type: String,
    trim: true
  },
  promo_code: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true,
    enum: ['show', 'pa'],
    required: true
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  },
  website: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Program', ProgramSchema);
