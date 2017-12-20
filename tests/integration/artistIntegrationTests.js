'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/schema/userModel'),
    Artist = require('../../app/schema/artistModel');

describe('The Artists controller', function() {
  before(function(done) {
    var admin = new User({
      username: 'admin',
      password: 'adminSecret',
      email: 'admin@example.com',
      auth_level: 'Admin'
    });

    var testArtist = new Artist({
      name: 'A Tribe Called Quest',
      short_name: 'atribecalledquest'
    });

    admin.save()
      .then(function() {
        return testArtist.save();
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  describe.only('/artists', function() {
    it('should create a new Artist with a POST request', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/artists')
            .send({
              name: 'Kanye West',
              short_name: 'kanyewest'
            })
            .expect(201);
        })
        .then(function(res) {
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('name', 'Kanye West');
          expect(res.body).to.have.property('short_name', 'kanyewest');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should retrieve all Artists with a GET request', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/artists')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).has.length(2);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  after(function(done) {
    User.remove({})
      .then(function() {
        return Artist.remove({});
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
