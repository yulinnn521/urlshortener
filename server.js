require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dns = require("dns");
const urlParser = require("url");
//Connect to mongoDB
mongoose.connect('mongodb+srv://new_user:123wdc@cluster0.rr3ri.mongodb.net/freecode?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
// for POST request
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Creat mongodb schema
const urlSchema = new Schema({
  url: String
});
const _URL = mongoose.model("_URL", urlSchema);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.route("/api/shorturl").post((req, res)=>{
/*START OF POST */ 

const dnsCheck = dns.lookup(urlParser.parse(req.body.url).hostname, (err, address)=>{
  if(!address){
    res.json({ "error": 'invalid url' });
  } else {
    let gotURL = new _URL({
      url: req.body.url
    });

    gotURL.save((err, data)=>{
      console.log({
      original_url: data.url, 
      short_url: data._id});
      res.json({
      original_url: data.url, 
      short_url: data._id});
    });
  }
  console.log("sth", dnsCheck);
});

});

app.route("/api/shorturl/:id").get((req, res)=>{
  _URL.findById(req.params.id, (err, foundId)=>{
    if(!foundId){
      console.log({ "errorGET": req.params.id + ' invalid url' })
      res.json({ "error": 'invalid url' });
    } else {
      res.redirect(foundId.url);
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});