// Load required packages
// "use strict";

var oauth2orize = require('oauth2orize');
var User = require('./models/user');
var Client = require('./models/client');
var Token = require('./models/token');
var passport = require('passport');
const UIDGenerator  = require('uid-generator');
var crypto = require("crypto");
var bcrypt = require('bcrypt');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization function
/*server.serializeClient(function (client, callback) {
  console.log("Client serialized");
  return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function (id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    console.log("Client deSerialized");
    return callback(null, client);
  });
});*/


server.exchange(oauth2orize.exchange.clientCredentials(function (client, scope, done) {
  var token = new Token();
  var uidGenerator=new UIDGenerator(256, UIDGenerator.BASE62);
  var tokenValue = uidGenerator.generateSync();
  token.value = crypto.createHash('sha1').update(tokenValue).digest('hex')
  var expiresIn = 1800
  token.expirationDate = new Date(new Date().getTime() + (expiresIn * 1000))
  token.clientId = client.clientId;

  scope = scope || [];
  if (scope.length <= 0) {
    var err = new oauth2orize.TokenError(
      'Invalid scope: empty set of scopes',
      'invalid_scope'
    );

    return done(err);
  } else {
    Client.findOne({ clientId: client.clientId }, function (err, client) {
      if (err) { return done(err); }

      // No client found
      if (!client) { return done(null, false); }
      //Check if client is has this scope info registered.
      for (var i = 0; i < scope.length; i++) {
        if (client.scope.indexOf(scope[i]) < 0) return done(null, false);
      }

      token.scope = scope;
      //Save token to the db
      token.save(function (err) {
        if (err) return done(err)
        return done(null, tokenValue, { expires_in: expiresIn })
      });

    });

  }

}));

var token = [
  passport.authenticate(['clientBasic'], { session: false }),
  server.token(),
  server.errorHandler()
];
// token endpoint
module.exports = token;
