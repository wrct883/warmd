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
    enum: ['None', 'User', 'Exec', 'Admin'],
    default: 'None',
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

// Password encryption functions
// Middleware to encrypt passwords before saving
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS, function(err, hash) {
    if (err) next(err);
    user.password = hash;
    next();
  });
});

// Compare plaintext passwords to our hash
UserSchema.methods.comparePassword = function(pw, callback) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
