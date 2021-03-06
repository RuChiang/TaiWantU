
require('./config/config');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


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
const {authenticate} = require('./routes/authenticate');


var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

//use for admin pages
//app.use('/admin',express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug')


app.get('/text/test',(req,res)=>{
  res.send("text response");
  console.log("text/test checking route");
});

app.get('/checkCookie',(req,res)=>{
  res.send(req.cookies);
  console.log("cookie checking route");
});





// // just for testing purpose
// app.get('/test', function(req, res) {
// 	// send a static html file back to client
// 	res.sendFile(path.join(__dirname, 'public', 'test.html'));
// });


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
