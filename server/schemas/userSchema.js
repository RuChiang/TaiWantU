const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    minlength: true,
    unique: true,
    validate: {
      validator:  validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },

  password:{
    type: String,
    require: true,
    minlength:6
  },

  tokens: [{
    access:{
      type: String,
      require: true,
    },
    token:{
      type: String,
      require: true,
    }
  }]

  //authority attribute should also be set here

});


userSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();


  return _.pick(userObject,['_id','email']);
};

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByCredentials = function (email, password){
  var user = this;

  user.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    
  });
}

//can be used by the model; methods are for instances!
userSchema.statics.findByToken = function (token){
  var user = this;
  var decoded;

  try{
    decoded = jwt.verify(token,'abc123');
  }catch(e){
    return  Promise.reject();
  }

  return userModel.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var userModel = mongoose.model('User',userSchema);


userSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hash) =>{
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }


});


module.exports = {
  userSchema,
  userModel
};
