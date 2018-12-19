'use strict';

var expect = require('chai').expect,
    Artist = require('../../app/models/artistModel');

describe('The Artist Model', function() {
  before(function(done) {
    // Start warmd server
    require('../../server');
    done();
  });

  it('should automatically generate alpha names', function(done) {
    // Normal name
    var artist1 = new Artist({
      name: 'A Tribe Called Quest'
    });

    // Name with leading 'the'
    var artist2 = new Artist({
      name: 'The Rolling Stones'
    });

    // Name with numerals
    var artist3 = new Artist({
      name: '2pac'
    });

    // Name with ampersand
    var artist4 = new Artist({
      name: 'Josie & The Pussycats'
    });

    // Name with punctuation
    var artist5 = new Artist({
      name: 'P. Diddy'
    });

    artist1.save()
      .then(function(res) {
        // Alpha name should just be the regular name, lowercase and one word
        expect(res).to.have.property('alpha_name', 'atribecalledquest');
        return artist2.save();
      })
      .then(function(res) {
        // Alpha name should not include the leading 'the'
        expect(res).to.have.property('alpha_name', 'rollingstones');
        return artist3.save();
      })
      .then(function(res) {
        // Alpha name should spell out the numeral
        expect(res).to.have.property('alpha_name', 'twopac');
        return artist4.save();
      })
      .then(function(res) {
        // Alpha name should change '&' to 'and'
        expect(res).to.have.property('alpha_name', 'josieandthepussycats');
        return artist5.save();
      })
      .then(function(res) {
        // Alpha name should remove punctuation
        expect(res).to.have.property('alpha_name', 'pdiddy');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  after(function(done) {
    Artist.remove({})
      .then(function(res) {
        console.log('Artists collection dropped');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});
