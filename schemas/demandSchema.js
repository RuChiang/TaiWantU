const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var demandSchema = new Schema({

  authority: {
    type: Number,
    required: true
  }, //how many levels should we have?

  member: {
    type: Boolean,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  subCategory: {
    type:String,
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

  time: {
    type:Date,
    default: Date.now
  },

  location: {
    type: String,
    required: true
  }, //should be stored in other form
  //quality
  //source


  _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

});

var demandModel = mongoose.model('Demand',demandSchema);

module.exports = {
  demandSchema,
  demandModel
};
