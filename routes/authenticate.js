const mongoose = require('mongoose');
const {userModel, userSchema} = require('./../schemas/userSchema');


var authenticate = (req, res, next) => {
  var token = req.cookies.xauth;

  userModel.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
