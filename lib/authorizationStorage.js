/**
 * AttrEactive Auth
 */

var authorizationStorage = {
  write: function(payload) {
    localStorage.setItem('attreactive-auth/payload', JSON.stringify(payload));
  },

  read: function() {
    var item = localStorage.getItem('attreactive-auth/payload');
    if (!item) return null;
    return JSON.parse(item);
  },

  clean: function() {
    localStorage.removeItem('attreactive-auth/payload');
  }
};

module.exports = authorizationStorage;
