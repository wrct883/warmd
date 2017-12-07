'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  first_name: String,
  last_name: String,
  dj_name: String,
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: '[^\\.\\s@:][^\\s@:]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*'
  },
  auth_level: {
    type: String,
    enum: ['user', 'exec', 'admin'],
    required: true
  },
  training_status: {
    is_air_trained: Boolean,
    is_prod_trained: Boolean
  },
  date_joined: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
