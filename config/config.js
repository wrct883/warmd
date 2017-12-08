var path = require('path'),
    root = path.normalize(__dirname + '/..');

module.exports = {

  'development': {
    port: 3000,
    root: root,
    debug: true
  },

  'test': {
    port: 3000,
    root: root,
    debug: false
  },

  'mongo': {
    port: 3000,
    root: root,
    debug: false,
    is_mongo: true,
    routes_dir: './mongoRoutes'
  },

  'production': {
    port: 443,
    root: root,
    debug: false
  }

};
