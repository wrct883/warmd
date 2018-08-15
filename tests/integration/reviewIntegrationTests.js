'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest'),
    app = require('../../server'),
    User = require('../../app/schema/userModel'),
    Artist = require('../../app/schema/artistModel'),
    Album = require('../../app/schema/albumModel'),
    Review = require('../../app/schema/reviewModel');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('The Reviews controller', function() {
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

    admin.save()
      .then(function() {
        return kanye.save();
      })
      .then(function(res) {
        var graduation = new Album({
          name: 'Graduation',
          artists: [
            {
              name: 'Kanye West',
              _id: res._id
            }
          ]
        });
        return graduation.save();
      })
      .then(function(res) {
        var testReview = new Review({
          username: admin.username,
          album_id: res._id,
          review: "This album was so good actually amazing and I loved it. Kanye west is a genius and so smart."
        });
        testReview.save();
      })
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  describe('/reviews', function() {
    it('should create a new Review with a POST request', function() {
      var admin = request.agent(app);
      var result = admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/albums')
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
          return admin.post('/reviews')
            .send({
              username: 'admin',
              album_id: res.body._id,
              review: 'This life-changing album by certified genius Kanye West changed my life. Please play on your show.'
            })
            .expect(201);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('_id'),
        expect(result).to.eventually.have.property('username', 'admin'),
        expect(result).to.eventually.have.property('review', 'This life-changing album by certified genius Kanye West changed my life. Please play on your show.')
      ]);
    });

    it('should retrieve all Reviews with a GET request', function() {
      var admin = request.agent(app);
      var result = admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          return admin.get('/reviews')
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

  describe('/reviews/:review', function() {
    it('should retrieve a Review with a GET request', function() {
      var admin = request.agent(app);
      var result = admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.post('/albums')
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
          return admin.post('/reviews')
            .send({
              username: 'admin',
              album_id: res.body._id,
              review: 'Kanye West continues to churn out the most impressive music. I cant even keep up.'
            })
            .expect(201);
        })
        .then(function(res) {
          var id = res.body._id;
          return admin.get('/reviews/' + id)
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('username', 'admin'),
        expect(result).to.eventually.have.property('album_id'),
        expect(result).to.eventually.have.property('review','Kanye West continues to churn out the most impressive music. I cant even keep up.')
      ]);
    });

    it('should update a Review with a PUT request', function() {
      var kanye = {};
      var admin = request.agent(app);
      var result = admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Get Kanye from the db
          return admin.get('/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.get('/albums')
            .send({
              name: 'Late Registration',
              artists: [
                {
                  name: res.body[0].name,
                  _id: res.body[0]._id
                }
              ]
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.get('/reviews')
            .send({
              username: 'admin',
              album_id: res.body[0]._id,
            })
            .expect(200);
        })
        .then(function(res) {
          var review_id = res.body[0]._id;
          return admin.put('/reviews/' + review_id)
            .send({
                username: 'admin',
                review: 'I hate this album! >:('
            })
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return Promise.all([
        expect(result).to.eventually.have.property('username', 'admin'),
        expect(result).to.eventually.have.property('review', 'I hate this album! >:(')
      ]);
    });

    it('should delete a Review with a DELETE request', function() {
      var admin = request.agent(app);
      var result = admin.post('/auth')
        .send({
          username: 'admin',
          password: 'adminSecret'
        })
        .expect(200)
        .then(function(res) {
          // Find Kanye
          return admin.get('/artists')
            .send({
              name: 'Kanye West'
            })
            .expect(200);
        })
        .then(function(res) {
          return admin.get('/albums')
            .send({
              name: 'Late Registration',
              artists: [{
                name: res.body[0].name,
                _id: res.body[0]._id
              }]
            })
            .expect(200)
        })
        .then(function(res) {
          return admin.get('/reviews')
            .send({
              username: 'admin',
              album_id: res.body[0]._id,
            })
            .expect(200);
        })
        .then(function(res) {
          var id = res.body[0]._id;
          return admin.delete('/reviews/' + id)
            // Delete Late Registration review 
            .expect(200);
        })
        .then(function(res) {
          return res.body;
        });

      return expect(result).to.eventually.have.property('removedReview');
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
        return Review.remove({});
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