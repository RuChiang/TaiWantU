const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull:{
      tokens:{
        token: token
      }
    }
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    console.log(user);
    if (!user) {
      // console.log('user not found');
      return Promise.reject();
    }

    // console.log(password);
    // console.log(user.password.toString());

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//can be used by the model; methods are for instances!
userSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET);
  }catch(e){
    return  Promise.reject();
  }

  return User.findOne({
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
