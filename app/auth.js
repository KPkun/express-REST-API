var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
var Token = require('./models/token');
var crypto = require("crypto");
var bcrypt = require('bcrypt');

var Client = require('./models/client');

//It will be called when auth is performed using clientId and clientSecret
passport.use('clientBasic', new BasicStrategy(
    function (clientid, clientSecret, callback) {
        Client.findOne({ clientId: clientid }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== clientSecret) { return callback(null, false); }

            // Success
            return callback(null, client);
        });
    }
));

//It will be called when auth is performed via Token.
passport.use("accessToken", new BearerStrategy(
    function (accessToken, callback) {
        var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex');
        Token.findOne({ value: accessTokenHash }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            //Token has expired
            if (new Date() > token.expirationDate) {
                Token.findOneAndRemove({ value: accessTokenHash }, function (err, token) {
                    if (err) { return callback(err); }
                    return callback(null, false);
                });

            } else {
                // find the client for which token was issued
                Client.findOne({ clientId: token.clientId }, function (err, client) {
                    if (err) { return callback(err); }

                    // No user found
                    if (!client) { return callback(null, false); }

                    // Simple example with no scope
                    callback(null, client, { scope: client.scope });
                });
            }

        });
    }
));