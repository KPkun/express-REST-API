// app/controllers/client.js

// Load required packages
var User = require('../models/client');
var uuid = require("node-uuid");
var token= require('../oauth2');


// Create endpoint /users for GET
exports.getClients = function (req, res) {
  console.log("getting clients");
  Client.find(function (err, clients) {
    if (err) {
      res.send(err);
    } else {
      res.json(clients);
    }
  });
}

// Create endpoint /users for POSTS
exports.postClients = function (req, res) {
  console.log("create a client");
  var client = new Client(); //create a new instance of the User model

  client.name = req.body.name; // set the users id (comes from the request)
  client.clientId = uuid.v4();
  client.secret = uuid.v4();
  client.scope=req.body.scope;
  //save the user and check for errors
  client.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: "Client created", data: client });
    }
  });

}
