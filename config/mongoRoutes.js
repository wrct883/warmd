'use strict';

var userController = require('../app/controllers/userController'),
    express = require('express');

module.exports = function(app, config, passport) {
  // Session init
  app.post('/auth',
    passport.authenticate('local'), function(req, res) {
      res.json({ok: 1});
    });

  // User routes
  var userRouter = new express.Router()
    .param('user', userController.load)
    .get('/',
      userController.isAuthed,
      userController.all)
    .post('/',
      userController.isAuthed,
      userController.hasAccess('Admin'),
      userController.create)
    .post('/exists', userController.exists)
    .get('/:user',
      userController.isAuthed,
      userController.show)
    .put('/:user',
      userController.isAuthed,
      userController.update)
    .delete('/:user',
      userController.isAuthed,
      userController.delete);
  app.use('/users', userRouter);
};
