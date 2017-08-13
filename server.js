// server.js

// BASE SETUP
// =============================================================================

// import the packages required
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var uuid = require("node-uuid");
var passport = require('passport');
var token= require('./app/oauth2');
require('./app/auth');

// import controllers
var userController = require('./app/controllers/user');
var clientController = require('./app/controllers/client');

// import models
var User = require('./app/models/user');
var Client = require('./app/models/client');

// connect to our database
var uri = 'Your database URL';
mongoose.connect(uri).then(
  function () {
    console.log("database connection established");
  },
  function (error) {
    console.log("error connecting to database");
    console.log(JSON.stringify(error));
  }
);

// configure app to use required modules
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());



// define port to run on
var port = process.env.PORT || 3000;

// ROUTES FOR OUR API
// =============================================================================

// create an instance of express router
var router = express.Router();

// middleware to use for all requests
app.use(function (req, res, next) {
  // do logging, error handling and security checks here
  console.log('activity logged');
  next(); // make sure we go to the next routes and don't stop here
});

// app level base route
app.get('/', function (req, res) {
  console.log("app level base route");
  res.json({ message: "Hello world!" });
});

// app level oauth
app.post('/oauth/token',token);

// router level base route
router.get('/', function (req, res) {
  console.log("router level base route");
  res.json({ message: "welcome to api!" });
});

// more routes for our API will happen here

// routes that end with /users
router.route('/users')

  // create a user (accessed at POST http://localhost:3000/api/v1/users)
  .post(userController.postUsers)

  // get all users (accessed at GET http://localhost:3000/api/v1/users)
  .get(userController.getUsers);

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

  // get the user with that id (accessed at GET http://localhost:3000/api/v1/users/:user_id)
  .get(userController.getUser)

  // update the user with this id (accessed at PUT http://localhost:3000/api/v1/users/:user_id)
  .put(userController.putUser)

  // delete the user with this id (accessed at DELETE http://localhost:3000/api/v1/users/:user_id)
  .delete(userController.deleteUser);

//API for client apps START
router.route('/clients')

  // get all users (accessed at GET http://localhost:3000/api/v1/users)
  .get(clientController.getClients)

  // create a user (accessed at POST http://localhost:3000/api/v1/users)
  .post(clientController.postClients);

//API for client apps end

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api/v1
app.use('/api/v1', passport.authenticate('accessToken', { session: false }));
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic is happening at " + port);
