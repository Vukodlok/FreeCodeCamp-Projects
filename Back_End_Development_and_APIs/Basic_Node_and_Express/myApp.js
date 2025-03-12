//load environment variables form .env
require('dotenv').config()
//import express framework
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

console.log("Hello World");

//use body=parser to parse url encoded data
app.use(bodyParser.urlencoded({ extended: false}));

//grab http data
app.use((req, res, next) => {
console.log(`${req.method} ${req.path} - ${req.ip}`);
next();
});

//serve static files from /public, like css
app.use("/public", express.static(__dirname + "/public"));

//serve html files
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
  });

//serve JSON data
app.get("/json", (req, res) => {
  let message = "Hello json";

  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }
  return res.json({message: message});
});

//middleware and handler for time
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({ time: req.time });
});

//echo route for client input
app.get("/:word/echo", (req, res) => {
  let word = req.params.word; //capture word from url
  res.json({ echo: word });
});

//get requests with query parameters
app.get("/name", (req, res) => {
  let firstName = req.query.first;
  let lastName = req.query.last;
  //send data back in json format
  res.json({ name: `${firstName} ${lastName}`});
});

//handle POST request through html form
app.post("/name", (req, res) => {
  let firstName = req.body.first;
  let lastName = req.body.last;
  res.json({ name: `${firstName} ${lastName}` });
});

//export app for testing
 module.exports = app;
