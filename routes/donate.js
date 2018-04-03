const mongoose = require('mongoose');
const express = require('express');
const {authenticate} = require('./authenticate');


const router = express.Router();

// get default/standard donate page/form
router.get('/', function(req, res) {
  // the headings of the donate form
  // can get from donateSchema?
  var form = {};
  res.json(form);
});

// post a new donate
//this route handles a donation request
router.post('/',authenticate ,function(req, res) {

  var donateInstance = new donateModel({
    category: req.body.category,
    subCategory: req.body.subCategory,
    name: req.body.name,
    quantity: req.body.quantity,
    mass: req.body.mass,
    time: req.body.time,
    location: req.body.location,
    quality: req.body.quality,
    source: req.body.source,
    _creator: req.user.id
  });

  donateInstance.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });


});

module.exports = {
  donateRouter:router
};
