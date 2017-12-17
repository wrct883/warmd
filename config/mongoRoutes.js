'use strict';

var userController = require('../app/controllers/userController'),
    programController = require('../app/controllers/programController'),
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
      userController.find)
    .post('/',
      userController.isAuthed,
      userController.hasAccess('Admin'),
      userController.create)
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

  // Program routes
  var programRouter = new express.Router()
    .post('/',
      userController.isAuthed,
      programController.create);
  app.use('/programs', programRouter);
};
