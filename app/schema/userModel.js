'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    BCRYPT_SALT_ROUNDS = 10;

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
    required: true,
    unique: true
  },
  auth_level: {
    type: String,
    enum: ['none', 'user', 'exec', 'admin'],
    default: 'none',
    required: true
  },
  training_status: {
    is_air_trained: {
      type: Boolean,
      default: false
    },
    is_prod_trained: {
      type: Boolean,
      default: false
    }
  },
  date_joined: {
    type: Date,
    required: true,
    default: new Date()
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  }
});

// Middleware to encrypt passwords before saving
UserSchema.pre('save', function(user) {
  bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS, function(err, hash) {
    this.password = hash;
  });
});

module.exports = mongoose.model('User', UserSchema);
