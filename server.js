'use strict';

//================================
// Globals =======================
//================================

// Imports
var express = require('express'),
    passport = require('passport'),
    https = require('https'),
    fs = require('fs'),
    app = express(),
    mongoose = require('mongoose');

// Configs
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    wlog = require('./config/logger');

// HTTPS/SSL
var options = {
  key: fs.readFileSync('./config/server-key.pem'),
  cert: fs.readFileSync('./config/server-cert.pem'),
  // This is only necessary if using the client cert authentication
  requestCert: true

  // This is only necessary if client uses self-signed cert
  //ca: [ fs.readFileSync('client-cert.pem')]
};

//================================
// Database ======================
//================================
// Register schemas
require('./app/schema/userModel');
require('./app/schema/programModel');
require('./app/schema/artistModel');
require('./app/schema/albumModel');
require('./app/schema/reviewModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/warmd', {useMongoClient: true});

require('./config/passport')(passport, config);     // Passport
require('./config/express')(app, config, passport); // Express config, routes
//================================
// Initialize ====================
//================================

// Start app
var port = process.env.PORT || config.port || 3000;
https.createServer(options, app).listen(port, function() {
  wlog.info('__          __     _____  __  __ _____  ');
  wlog.info('\\ \\        / /\\   |  __ \\|  \\/  |  __ \\ ');
  wlog.info(' \\ \\  /\\  / /  \\  | |__) | \\  / | |  | |');
  wlog.info('  \\ \\/  \\/ / /\\ \\ |  _  /| |\\/| | |  | |');
  wlog.info('   \\  /\\  / ____ \\| | \\ \\| |  | | |__| |');
  wlog.info('    \\/  \\/_/    \\_\\_|  \\_\\_|  |_|_____/ ');
  wlog.info('');

  wlog.info('WARMD now running on port ' + port + ' in ' + env + ' environment');
  if (config.verbose) {
    console.log('Verbose mode on');
  }
});

// Expose app for testing purposes
exports = module.exports = app;
