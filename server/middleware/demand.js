const mongoose = require('mongoose');
var express = require('express');
var {demandSchema, demandModel} = require('./../schemas/demandSchema');

var router = express.Router();

// get default/standard demand page/form
router.get('/', function(req, res) {
  // the headings of the demand form
  // can get from demandSchema?

  var form = {};
  res.json(form);
});

// post a new demand
router.post('/', function(req, res) {
  // add to db
  // check availability
  // return result
});

module.exports = {
  demandRouter:router
};
