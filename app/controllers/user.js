// app/controllers/user.js

// Load required packages
var User = require('../models/user');

// Create endpoint /users for GET
exports.getUsers = function(req, res){
  console.log("get a user");
  User.find(function(err, users){
    if(err){
      res.send(err);
    }else{
      res.json(users);
    }
  });
}

// Create endpoint /users for POSTS
exports.postUsers = function(req, res) {
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
}

// Create endpoint /users/:user_id for GET
exports.getUser = function(req, res){
  User.findById(req.params.user_id, function(err, user){
    if(err){
      res.send(err);
    }else{
      res.json(user);
    }
  });
}

// Create endpoint /users/:user_id for PUT
exports.putUser = function(req, res){
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
}

// Create endpoint /users/:user_id for DELETE
exports.deleteUser = function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted user' });
    });
}
