/**
 * AttrEactive Auth
 */

var events = require("events");
var cls = require("cls");
var authorizationRequestFactory = require("./authorizationRequestFactory");
var authorizationStorage = require("./authorizationStorage");

var AuthorizationManager = cls.extend({
  init: function(request, storage) {
    this._eventEmitter = new events.EventEmitter();

    if (typeof request === 'string') {
      this._request = authorizationRequestFactory(request);
    } else {
      this._request = request;
    }

    this._storage = storage || authorizationStorage;
    this._authData = this._storage.read() || null;
  },

  signIn: function(credentials) {
    return this._request(credentials)
      .then(function(output) {
        this._authData = output;
        this._storage.write(this._authData);
        this._eventEmitter.emit('change', this._authData);
        return output;
      }.bind(this));
  },

  signOut: function() {
    this._authData = null;
    this._storage.clean();
    this._eventEmitter.emit('change');
  },

  getAuthorizationData: function() {
    return this._authData;
  },

  isAuthorized: function() {
    return !!this._authData;
  },

  addChangeListener: function(callback) {
    this._eventEmitter.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this._eventEmitter.removeListener('change', callback);
  }
});

module.exports = AuthorizationManager;
