'use strict';

var users = require('../app/controllers/userController'),
    express = require('express');

module.exports = function(app, config) {
  var userRouter = new express.Router()
    .post('/exists', users.exists);
  app.use('/users', userRouter);
};
