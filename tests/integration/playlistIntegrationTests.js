'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/v1/models/userModel'),
    Playlist = require('../../app/v1/models/playlistModel'),
    Play = require('../../app/v1/models/playModel');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('The Playlsit controller', function() {
  before(function(done) {
    var admin = new User({
      username: 'admin',
      password: 'adminSecret',
      email: 'admin@example.com',
      auth_level: 'Admin'
    });

    admin.save()
      .then(function() {
        done();
      });
  });

  describe('/v1/playlists', function() {
    it('should create a new Playlist with a POST request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/playlists')
            .send({
              _id: 'playlist1',
              user: 'admin',
              program: 'Happy Hour',
              start_time: new Date('2017-12-10T12:00:00Z'),
              end_time: new Date('2017-12-10T13:00:00Z')
            })
            .expect(201);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('_id', 'playlist1'),
        expect(result).to.eventually.have.property('user', 'admin'),
        expect(result).to.eventually.have.property('program', 'Happy Hour')
      ]);
    });

    it('should disallow Playlists with the same user, program, and times', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Try to create a Playlist with the same name, program, and times
          return admin.post('/v1/playlists')
            .send({
              _id: 'playlistDupe',
              user: 'admin',
              program: 'Happy Hour',
              start_time: new Date('2017-12-10T12:00:00Z'),
              end_time: new Date('2017-12-10T13:00:00Z')
            })
            .expect(400);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('error', 'InsertionError'),
        expect(result).to.eventually.have.property('message', 'Duplicate Key Error')
      ]);
    });

    it('should retrieve all Playlists with a GET request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/v1/playlists')
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.length(1)
      ]);
    });
  });

  after(function(done) {
    User.remove({})
      .then(function() {
        return Playlist.remove({});
      })
      .then(function() {
        return Play.remove({});
      })
      .then(function() {
        console.log('Collections dropped');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
