'use strict';

var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/schema/userModel'),
    Program = require('../../app/schema/programModel');

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

  describe('/programs', function() {
    it('should create a new Program with a POST request', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/programs')
            .send({
              name: 'Happy Hour',
              host: 'admin',
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
          expect(res.body).to.have.property('host', 'admin');
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
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/programs')
            .send({
              name: 'Happier Hour 2016',
              host: 'admin',
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
          return admin.post('/programs')
            .send({
              name: 'Nappiest Hour 2016',
              host: 'admin',
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
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/programs')
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
  });

  describe('/programs/:program', function() {
    it('should retrieve a Program with a GET request', function(done) {
      var admin = request.agent(app);
      admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.post('/programs')
            .send({
              name: 'ebony spectrum',
              host: 'admin',
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
          return admin.get('/programs/' + id)
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
