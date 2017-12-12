'use strict';

var userController = require('../app/controllers/userController'),
    express = require('express');

module.exports = function(app, config, passport) {
  var userRouter = new express.Router()
    .param('user', userController.load)
    .post('/exists', userController.exists)
    .post('/new', userController.create)
    .get('/:user', userController.show)
    .put('/:user', userController.update)
    .delete('/:user', userController.delete);
  app.use('/users', userRouter);
};
