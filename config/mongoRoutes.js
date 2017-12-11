'use strict';

var users = require('../app/controllers/userController'),
    express = require('express');

module.exports = function(app, config) {
  var userRouter = new express.Router()
    .param('user', users.load)
    .post('/exists', users.exists)
    .post('/new', users.create)
    .get('/:user', users.show)
    .put('/:user', users.update)
    .delete('/:user', users.delete);
  app.use('/users', userRouter);
};
