'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/v1/models/userModel'),
    Program = require('../../app/v1/models/programModel');

describe('The Programs controller', function() {
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
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  describe('/v1/programs', function() {
    it('should create a new Program with a POST request', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/programs')
            .send({
              name: 'Happy Hour',
              hosts: ['admin', 'user'],
              start_time: {
                day: 'Mon',
                hour: '17:00'
              },
              end_time: {
                day: 'Mon',
                hour: '19:00'
              },
              type: 'show',
              // In this case, always assume this is the first show created
              // during the Fall 2017 period
              created_at: new Date('2017-12-15')
            })
            .expect(201);
        })
        .then(function(res) {
          expect(res.body).to.have.property('name', 'Happy Hour');
          expect(res.body).to.have.property('hosts').that.includes('admin', 'user');
          expect(res.body).to.have.property('type', 'show');
          expect(res.body).to.have.nested.property('start_time.day', 'Mon');
          expect(res.body).to.have.nested.property('end_time.day', 'Mon');
          expect(res.body).to.have.nested.property('start_time.hour', '17:00');
          expect(res.body).to.have.nested.property('end_time.hour', '19:00');
          expect(res.body).to.have.property('is_active', true);
          expect(res.body).to.have.property('promo_code', 'PROF17-00');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should generate promo codes properly', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/programs')
            .send({
              name: 'Happier Hour 2016',
              hosts: ['admin'],
              start_time: {
                day: 'Tue',
                hour: '17:00'
              },
              end_time: {
                day: 'Tue',
                hour: '19:00'
              },
              type: 'show',
              created_at: new Date('2016-05-13')
            })
            .expect(201);
        })
        .then(function(res) {
          expect(res.body.promo_code).to.equal('PROSUM16-00');
          return admin.post('/v1/programs')
            .send({
              name: 'Nappiest Hour 2016',
              hosts: ['admin'],
              start_time: {
                day: 'Tue',
                hour: '20:00'
              },
              end_time: {
                day: 'Tue',
                hour: '22:00'
              },
              type: 'show',
              created_at: new Date('2016-05-13')
            })
            .expect(201);
        })
        .then(function(res) {
          // Should generate a different code from the last show
          expect(res.body.promo_code).to.equal('PROSUM16-01');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should retrieve all Programs with a GET request', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/v1/programs')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).has.length(3);
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should retrieve all active programs', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Add a new inactive program that shouldn't get retrieved later
          return admin.post('/v1/programs')
            .send({
              name: 'Inactivity',
              hosts: ['admin'],
              start_time: {
                day: 'Fri',
                hour: '18:00'
              },
              end_time: {
                day: 'Sat',
                hour: '00:00'
              },
              is_active: 'false',
              type: 'show'
            })
            .expect(201);
        })
        .then(function(res) {
          return admin.get('/v1/programs?active=true')
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).has.length(3);
          res.body.forEach(function(program) {
            expect(program).to.have.property('is_active', true);
          });
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('/v1/programs/:program', function() {
    it('should retrieve a Program with a GET request', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/programs')
            .send({
              name: 'ebony spectrum',
              hosts: ['admin'],
              start_time: {
                day: 'Wed',
                hour: '17:00'
              },
              end_time: {
                day: 'Wed',
                hour: '18:00'
              },
              type: 'pa'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.get('/v1/programs/' + id)
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('name', 'ebony spectrum');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should update a Program with a PUT request', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/programs')
            .send({
              name: 'Update Show',
              hosts: ['admin'],
              start_time: {
                day: 'Sat',
                hour: '10:00'
              },
              end_time: {
                day: 'Sat',
                hour: '11:00'
              },
              type: 'show'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.put('/v1/programs/' + id)
            // Change the show's name
            .send({
              name: 'New Update Show'
            })
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('name', 'New Update Show');
          done();
        })
        .catch(function(err) {
          done(err);
        });
    });

    it('should delete a Program with a DELETE request', function(done) {
      var admin = request.agent(app);
      admin.post('/v1/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/v1/programs')
            .send({
              name: 'Chopping Block',
              hosts: ['admin'],
              start_time: {
                day: 'Sun',
                hour: '10:00'
              },
              end_time: {
                day: 'Sun',
                hour: '10:00'
              },
              type: 'show'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.delete('/v1/programs/' + id)
            // Delete the Chopping Block
            .expect(200);
        })
        .then(function(res) {
          expect(res.body).to.have.property('removedProgram');
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
        return Program.remove({});
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
