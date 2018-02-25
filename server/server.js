//Todo:
// 1. db field urgency
// 2. whether to set an admin
// 3. update info


const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
//checking if the connection is going fine
try{
  var {mongoose} = require('./db/mongoose');
}catch(e){
  return console.log(e);
}
var {demandSchema} = require('./schemas/demandSchema');
var {donateSchema} = require('./schemas/donateSchema');
var {userSchema} = require('./schemas/userSchema');

var donateModel = mongoose.model('Donate',donateSchema); //first arg here is the collection name
var demandModel = mongoose.model('Demand',demandSchema);
var userModel = mongoose.model('User',userSchema);


var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());


//when user visit
app.get('/',(req,res)=>{
  //welcome page
  //display demand/donate info
  res.send({
    text: 'getting this page with success'
  });
});

//must login to donate





app.get('/donate',(req, res)=>{
  //send back display login page msg
});

app.get('/demand', (req, res)=>{
  // to be discussed with Dr.chen
  // 有登入跟沒登入差異
});



app.post('/signup',(req,res)=>{

  var body = _.pick(req.body, ['email', 'password']);
  var userInstance = new userModel(body);
  userInstance.save().then(() => {
    return userInstance.generateAuthToken();
  }).then((token) =>{
    res.header('x-auth',token).send(userInstance);
  }).catch((e) => {
    res.status(400).send(e);
  })
})



//demand request handling
app.post('/demand',(req,res)=>{

  //first search if there is a corresponding donation
  // Todo:
  //   1. how to accumulate the amount of the same resource in different entries?
  //   2. how to split and merge the same resource in different entries?
  //   3. the JSON data sent back to the user must contain a result field
  //   4. what's the effect of logining in with different authority level
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
})

//donate request handling
app.post('/donate',(req, res)=>{
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
  });

  donateInstance.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });


})

app.listen(port,()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
}
