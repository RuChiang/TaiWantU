
require('./config/config');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


//checking if the connection is going fine
try{
  var {mongoose} = require('./db/mongoose');
}catch(e){
  return console.log(e);
}

const {demandSchema, demandModel} = require('./schemas/demandSchema');
const {donateSchema, donateModel} = require('./schemas/donateSchema');
const {userSchema, userModel} = require('./schemas/userSchema');

const {donateRouter} = require('./routes/donate');
const {demandRouter} = require('./routes/demand');
const {userRouter} = require('./routes/user');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//when user visit
app.get('/',(req,res)=>{
  //welcome page
  //display demand/donate info
  res.send({
    text: 'getting this page with success'
  });
});


// just for testing purpose
app.use('/test', function(req, res) {
	// send a static html file back to client
	res.sendFile(path.join(__dirname, 'public', 'new.html'));
});


// middleware for donate which handles all types of RESTful
app.use('/donate', donateRouter);


// middleware for demand which handles all types of RESTful
app.use('/demand', demandRouter);


// middleware for user which handles all types of RESTful
app.use('/user', userRouter);




app.listen(port,()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
}
