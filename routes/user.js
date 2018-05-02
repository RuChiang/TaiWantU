const mongoose = require('mongoose');
const express = require('express');
const {userSchema, userModel} = require('./../schemas/userSchema');
const {authenticate} = require('./authenticate');
const _ = require('lodash');




var router = express.Router();


router.get('/me', authenticate,(req, res) => {
  res.send(req.user);
});



//login
router.post('/login',(req,res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  console.log(body.email);
  console.log(body.password);

  userModel.findByCredentials(body.email, body.password).then((user) => {
    //console.log('its here');
    return user.generateAuthToken().then((token) => {
      res.cookie('xauth', token).send("successful login");
    });
  }).catch((e) => {
    console.log('something goes wrong here');
    res.send("login error");
  });
});


//signing in with a new user account
router.post('/signup',(req,res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  // console.log(body.email);
  // console.log(body.password);
  var userInstance = new userModel(body);
  userModel.findOne({'email':body.email}).then((user)=>{
    if(!user){
      userInstance.save().then(() => {
        return userInstance.generateAuthToken();
      }).then((token) =>{
        res.cookie('xauth',token).send("successful signup");

      }).catch((e) => {
        res.send("signup error");
      })
    }else{
      res.send("user already exist");
    }
  })

});


router.delete('/logout', authenticate, (req, res)=>{
  console.log("logout function is called here");
  req.user.removeToken(req.token).then(()=>{
    res.status(200).clearCookie('xauth').send("successful logout");
  }, ()=>{
    res.status(400).send("logout error");

  });
});


module.exports = {
  userRouter:router
};
