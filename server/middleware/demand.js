const mongoose = require('mongoose');
const express = require('express');
const {demandSchema, demandModel} = require('./../schemas/demandSchema');
const {authenticate} = require('./authenticate');


var router = express.Router();

// get default/standard demand page/form
router.get('/', function(req, res) {
  // the headings of the demand form
  // can get from demandSchema?

  var form = {};
  res.json(form);
});






// post a new demand
//using authenticate middleware to check if the user is logged in
//this route checks if there is a corresponding supply in our database,
//if the supply exists, then shortResult field returns 'true', otherwise 'false'

  // Todo:
  //   1. how to accumulate the amount of the same resource in different entries?
  //   2. how to split and merge the same resource in different entries?
  //   3. the JSON data sent back to the user must contain a result field
  //   4. what's the effect of logining in with different authority level

router.post('/', authenticate, function(req, res) {

  donateModel.findOne({
    category: req.body.category,
    subCategory: req.body.subCategory,
    name: req.body.name,
    quantity: { $gte: req.body.quantity},
  },'location quality source').then((doc)=>{
    if(doc == null){
      //no document is found, save this demand
      var demandInstance = new demandModel({
        authority: req.body.authority,
        member: req.body.member,
        category: req.body.category,
        subCategory: req.body.subCategory,
        name: req.body.name,
        quantity: req.body.quantity,
        time: req.body.time,
        location: req.body.location,
        _creator: req.user.id
      });

      demandInstance.save().then((doc)=>{
        res.send({
          shortResult: 'false',
          result: 'can\'t find the document now, the demand is saved',
          doc
        });
      },(e)=>{
        //error upon saving
        res.status(400).send({
          shortResult: 'false',
          e
        });
      });
    }else{
      //document is found, show it to the user
      res.send({
        shortResult: 'true',
        result: 'document is found',
        doc
      });
    }
  }).catch((e) => console.log(e));
});

module.exports = {
  demandRouter:router
};
