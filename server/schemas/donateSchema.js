const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var donateSchema = new Schema({

  category: {
    type: String,
    required: true
  },

  subCategory: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  mass: {
    type: Number,
    required: true
  },

  time: {
    type: Date,
    default: Date.now
  },

  location: {
    type: String,
    required: true
  }, //should be stored in other form

  quality: {
    type: Number,
    required: true
  }, //to be discussed

  source: {
    type: String,
    required: true
  },

});

var donateModel = mongoose.model('Donate',donateSchema);

module.exports = {
  donateSchema,
  donateModel
};
