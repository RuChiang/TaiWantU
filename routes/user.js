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
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    console.log('something goes wrong here');
    res.status(400).send("login error");
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
        res.header('x-auth',token).send(userInstance);
      }).catch((e) => {
        res.status(400).send("signup error");
      })
    }else{
      res.status(400).send("user already exist");
    }
  })

});


router.delete('/logout', authenticate, (req, res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send("logout error");

  });
});


module.exports = {
  userRouter:router
};
