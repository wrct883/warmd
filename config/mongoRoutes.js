'use strict';

var userController = require('../app/controllers/userController'),
    express = require('express');

module.exports = function(app, config, passport) {
  // Login and logout
  app.route('/login').get(function(req, res, next) {
    if (req.user) {
      res.redirect('/');
    } else next();
  }, userController.login);

  app.route('/logout').get(userController.logout);

  // Session init
  app.route('/users/session')
    .get(function(req, res) {
      res.redirect('/');
    })
    .post(passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/login?success=false'
    }));

  // User routes
  var userRouter = new express.Router()
    .param('user', userController.load)
    .post('/exists', userController.exists)
    .post('/new', userController.create)
    .get('/:user', userController.show)
    .put('/:user', userController.update)
    .delete('/:user', userController.delete);
  app.use('/users', userRouter);
};
