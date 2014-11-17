/**
 * AttrEactive Auth
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();
jest.mock('../authorizationRequestFactory');

var storage = {
  write: jest.genMockFn(),
  read: jest.genMockFn(),
  clean: jest.genMockFn()
};

var AuthorizationManager = require("../AuthorizationManager");

var authorizationRequest = jest.genMockFn();
authorizationRequest.mockReturnValue({
  then: function(ok, fail) {
    return ok({token: 123});
  }
});

var authorizationRequestFactory = require("../authorizationRequestFactory");
authorizationRequestFactory.mockReturnValue(authorizationRequest);

describe('Authorization', function() {
  it('should work', function() {
    var listener = jest.genMockFn();

    var auth = new AuthorizationManager('/login', storage);
    expect(storage.read).toBeCalled();
    expect(authorizationRequestFactory).toBeCalledWith('/login');

    expect(auth.getAuthorizationData()).toBeNull();
    expect(auth.isAuthorized()).toBeFalsy();
    auth.addChangeListener(listener);

    var result = auth.signIn({_username: 'admin', _password: 'admin'});
    expect(authorizationRequest).toBeCalledWith({_username: 'admin', _password: 'admin'});
    expect(storage.write).toBeCalledWith({token: 123});
    expect(result).toEqual({token: 123});
    expect(auth.getAuthorizationData()).toEqual({token: 123});

    expect(auth.isAuthorized()).toBeTruthy();
    expect(listener).toBeCalledWith({token: 123});
    listener.mockClear();
    auth.removeChangeListener(listener);

    auth.signOut();
    expect(storage.clean).toBeCalled();
    expect(auth.getAuthorizationData()).toBeNull();
    expect(auth.isAuthorized()).toBeFalsy();
    expect(listener).not.toBeCalled();
  });
});
