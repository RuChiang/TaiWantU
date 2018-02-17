var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {demandSchema} = require('./schemas/demandSchema');
var {donateSchema} = require('./schemas/donateSchema');

var donateModel = mongoose.model('Donate',donateSchema); //first arg here is the collection name
var demandModel = mongoose.model('Demand',demandSchema);


var app = express();
app.use(bodyParser.json());

//demand request handling
app.post('/demand',(req,res)=>{
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
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
})

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

app.listen(3000,()=>{
  console.log('listening on port 3000');
});

module.exports = {
  app
}
