'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/v1/models/userModel'),
    Artist = require('../../app/v1/models/artistModel'),
    Album = require('../../app/v1/models/albumModel');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('The Albums controller', function() {
  before(function(done) {
    var admin = new User({
      username: 'admin',
      password: 'adminSecret',
      email: 'admin@example.com',
      auth_level: 'Admin'
    });

    var kanye = new Artist({
      name: 'Kanye West',
      alpha_name: 'westkanye'
    });

    var jayz = new Artist({
      name: 'JAY-Z'
    });

    admin.save()
      .then(function() {
        return kanye.save();
      })
      .then(function(res) {
        var testAlbum = new Album({
          name: 'Graduation',
          artists: [
            {
              name: 'Kanye West',
              _id: res._id
            }
          ]
        });
        return testAlbum.save();
      })
      .then(function() {
        return jayz.save();
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  describe('/v1/albums', function() {
    it('should create a new Album with a POST request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/v1/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/v1/albums')
            .send({
              name: 'College Dropout',
              artists: [
                {
                  name: res.body[0].name,
                  _id: res.body[0]._id
                }
              ]
            })
            .expect(201);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('_id'),
        expect(result).to.eventually.have.property('name', 'College Dropout'),
        expect(result).to.eventually.have.nested.property('artists[0].name', 'Kanye West'),
        expect(result).to.eventually.have.nested.property('artists[0]._id')
      ]);
    });

    it('should not allow two copies of the same album', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/v1/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/v1/albums')
            .send({
              // Inserting the same
              name: 'College Dropout',
              artists: [
                {
                  name: res.body[0].name,
                  _id: res.body[0]._id
                }
              ]
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

    it('should retrieve all Albums with a GET request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/v1/albums')
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.length(2)
      ]);
    });
  });

  describe('/v1/albums/:album', function() {
    it('should retrieve an Album with a GET request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/v1/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/v1/albums')
            .send({
              name: 'Late Registration',
              artists: [
                {
                  name: res.body[0].name,
                  _id: res.body[0]._id
                }
              ]
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.get('/v1/albums/' + id)
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('name', 'Late Registration')
      ]);
    });

    it('should update an Album with a PUT request', function() {
      var kanye = {};
      var jayz = {};
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/v1/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          kanye = res.body[0];
          // Get Jay from the db
          return admin.get('/v1/artists')
            .send({
              name: 'JAY-Z'
            })
            .expect(200);
        })
        .then(function(res) {
          jayz = res.body[0];
          return admin.post('/v1/albums')
            .send({
              name: 'Watch The Throne',
              artists: [
                {
                  name: kanye.name,
                  _id: kanye._id
                }
              ]
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.put('/v1/albums/' + id)
            // Add Jay as a co-artist on 'Watch The Throne'
            .send({
              '$push': {
                artists: {
                  name: jayz.name,
                  _id: jayz._id
                }
              }
            })
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('name', 'Watch The Throne'),
        expect(result).to.eventually.have.property('artists').with.length(2)
      ]);
    });

    it('should delete an Album with a DELETE request', function() {
      var admin = request.agent(app);
      var result = admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Find Kanye
          return admin.get('/v1/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/v1/albums')
            .send({
              name: 'The Blueprint', // Wait, this isn't a Kanye album...
              artists: [
                {
                  name: res.body[0].name,
                  _id: res.body[0]._id
                }
              ]
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.delete('/v1/albums/' + id)
            // Delete the Blueprint
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return expect(result).to.eventually.have.property('removedAlbum');
    });
  });

  after(function(done) {
    User.remove({})
      .then(function() {
        return Artist.remove({});
      })
      .then(function() {
        return Album.remove({});
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
