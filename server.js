'use strict';

//================================
// Globals =======================
//================================

// Imports
var express = require('express'),
    passport = require('passport'),
    app = express(),
    mongoose = require('mongoose');

// Configs
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    wlog = require('./config/logger');

//================================
// Database ======================
//================================
// Register schemas
require('./app/models/userModel');
require('./app/models/programModel');
require('./app/models/artistModel');
require('./app/models/albumModel');
require('./app/models/reviewModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/warmd', {useMongoClient: true});

require('./config/passport')(passport, config);     // Passport
require('./config/express')(app, config, passport); // Express config, routes
//================================
// Initialize ====================
//================================

// Start app
var port = process.env.PORT || config.port || 4000;
app.listen(port, function() {
  wlog.info('WARMD now running on port ' + port + ' in ' + env + ' environment');
  if (config.verbose) {
    console.log('Verbose mode on');
  }
});

// Expose app for testing purposes
exports = module.exports = app;
