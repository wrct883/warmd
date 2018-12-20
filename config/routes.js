'use strict';

var userController = require('../app/v1/controllers/userController'),
    programController = require('../app/v1/controllers/programController'),
    artistController = require('../app/v1/controllers/artistController'),
    albumController = require('../app/v1/controllers/albumController'),
    reviewController = require('../app/v1/controllers/reviewController'),
    express = require('express');

module.exports = function(app, config, passport) {
  // Session init
  app.post('/v1/auth',
    passport.authenticate('local'), function(req, res) {
      res.json({ ok: 1 });
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
  app.use('/v1/users', userRouter);

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
  app.use('/v1/programs', programRouter);

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
  app.use('/v1/artists', artistRouter);

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
  app.use('/v1/albums', albumRouter);

  // Review routes
  var reviewRouter = new express.Router()
    .param('review', reviewController.load)
    .get('/',
      userController.isAuthed,
      reviewController.find)
    .post('/',
      userController.isAuthed,
      reviewController.create)
    .get('/:review',
      userController.isAuthed,
      reviewController.show)
    .put('/:review',
      userController.isAuthed,
      reviewController.update)
    .delete('/:review',
      userController.isAuthed,
      reviewController.delete);
  app.use('/v1/reviews', reviewRouter);
};
