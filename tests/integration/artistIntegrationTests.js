'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/models/userModel'),
    Artist = require('../../app/models/artistModel');

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
      alpha_name: 'atribecalledquest'
    });

    admin.save()
      .then(function() {
        return testArtist.save();
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  describe('/artists', function() {
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
              alpha_name: 'kanyewest'
            })
            .expect(201);
        })
        .then(function(res) {
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('name', 'Kanye West');
          expect(res.body).to.have.property('alpha_name', 'kanyewest');
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

  describe('/artists/:artist', function() {
    it('should retrieve an Artist with a GET request', function(done) {
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
              name: 'The Rolling Stones',
              alpha_name: 'rollingstones'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.get('/artists/' + id)
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('name', 'The Rolling Stones');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should update an Artist with a PUT request', function(done) {
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
              name: 'Jay Z',
              alpha_name: 'jayz'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.put('/artists/' + id)
            // Jay brought back the hyphen in June 2017
            .send({
              name: 'JAY-Z'
            })
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('name', 'JAY-Z');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should delete an Artist with a DELETE request', function(done) {
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
              name: 'Iggy Azalea',
              alpha_name: 'iggyazalea'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.delete('/artists/' + id)
            // No I-G-G-Y in the station, please
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('removedArtist');
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
