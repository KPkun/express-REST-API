// server.js

// BASE SETUP
// =============================================================================

// import the packages required
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

// import models
var User = require('./app/models/user');

// connect to our database
var uri = 'YOUR mongodb connection URL';
mongoose.connect(uri).then(
  function(){
    console.log("database connection established");
  },
  function(error){
    console.log("error connecting to database");
    console.log(JSON.stringify(error));
  }
);

// configure app to use required modules
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// define port to run on
var port = process.env.PORT || 3000;

// ROUTES FOR OUR API
// =============================================================================

// create an instance of express router
var router = express.Router();

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging, error handling and security checks here
    console.log('activity logged');
    next(); // make sure we go to the next routes and don't stop here
});

// app level base route
app.get('/', function(req, res){
  console.log("app level base route");
  res.json({message : "Hello world!"});
});

// router level base route
router.get('/', function(req, res){
  console.log("router level base route");
  res.json({message : "welcome to api!"});
});

// more routes for our API will happen here

// routes that end with /users
router.route('/users')

  // create a user (accessed at POST http://localhost:3000/api/users)
  .post(function(req, res){
    console.log("create a user");
    var user = new User(); //create a new instance of the User model

      user.name = req.body.name; // set the users id (comes from the request)
      //save the user and check for errors
      user.save(function(err){
        if(err){
          res.send(err);
        }else{
          res.json({message : "User created"});
        }
      });

  })

  // get all users (accessed at GET http://localhost:3000/api/users)
  .get(function(req, res){
    console.log("get a user");
    User.find(function(err, users){
      if(err){
        res.send(err);
      }else{
        res.json(users);
      }
    });
  });

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

  // get the user with that id (accessed at GET http://localhost:3000/api/users/:user_id)
  .get(function(req,res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send(err);
      }else{
        res.json(user);
      }
    });
  })

  // update the user with this id (accessed at PUT http://localhost:3000/api/users/:user_id)
  .put(function(req,res){

    // use the user model to find the user we want
    User.findById(req.params.user_id, function(err,user){
        if(err){
          res.send(err);
        }else{
          user.name = req.body.name; // update the user info
          // save the user
          user.save(function(err){
            if(err){
              res.send(err);
            }else{
              res.json({ message : "User updated!" });
            }
          });
        }
    });
  })

  // delete the user with this id (accessed at DELETE http://localhost:3000/api/users/:user_id)
  .delete(function(req, res) {
      User.remove({
          _id: req.params.user_id
      }, function(err, user) {
          if (err)
              res.send(err);
          res.json({ message: 'Successfully deleted user' });
      });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic is happening at "+port);
