'use strict';

// Renders a JSON 401 error
// TODO: Make an errors.js somewhere
var json401 = function(req, res) {
  res.status(401).json({
    error: 'This resource is forbidden. Please authenticate and try again.'
  });
};

module.exports = {
  json401: json401
};
