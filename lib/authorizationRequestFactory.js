/**
 * AttrEactive Auth
 */

var $ = require("jquery");

var authorizationRequestFactory = function(url) {
  return function(credentials) {
    return $.post(url, credentials);
  };
};

module.exports = authorizationRequestFactory;
