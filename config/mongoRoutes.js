'use strict';

var userController = require('../app/controllers/userController'),
    programController = require('../app/controllers/programController'),
    artistController = require('../app/controllers/artistController'),
    albumController = require('../app/controllers/albumController'),
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
    .param('program', programController.load)
    .get('/',
      userController.isAuthed,
      programController.find)
    .post('/',
      userController.isAuthed,
      programController.create)
    .get('/:program',
      userController.isAuthed,
      programController.show)
    .put('/:program',
      userController.isAuthed,
      programController.update)
    .delete('/:program',
      userController.isAuthed,
      programController.delete);
  app.use('/programs', programRouter);

  // Artist routes
  var artistRouter = new express.Router()
    .param('artist', artistController.load)
    .get('/',
      userController.isAuthed,
      artistController.find)
    .post('/',
      userController.isAuthed,
      artistController.create)
    .get('/:artist',
      userController.isAuthed,
      artistController.show)
    .put('/:artist',
      userController.isAuthed,
      artistController.update)
    .delete('/:artist',
      userController.isAuthed,
      artistController.delete);
  app.use('/artists', artistRouter);

  // Album routes
  var albumRouter = new express.Router()
    .param('album', albumController.load)
    .get('/',
      userController.isAuthed,
      albumController.find)
    .post('/',
      userController.isAuthed,
      albumController.create)
    .get('/:album',
      userController.isAuthed,
      albumController.show)
    .put('/:album',
      userController.isAuthed,
      albumController.update)
    .delete('/:album',
      userController.isAuthed,
      albumController.delete);
  app.use('/albums', albumRouter);
};
