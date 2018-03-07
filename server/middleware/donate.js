const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

// get default/standard donate page/form
router.get('/', function(req, res) {
  // the headings of the donate form
  // can get from donateSchema?
  var form = {};
  res.json(form);
});

// post a new donate
router.post('/', function(req, res) {
  // add to db
  // check availability
  // return result
});

module.exports = router;
