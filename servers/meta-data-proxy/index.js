const express = require('express');
const app = express();
const fs = require('fs');
const http = require("http");
const https = require("https");
const request=require('request');
const bodyParser = require('body-parser');
const port = 1337;
const util = require('util')

let readBasePath = 'data/examples';
let tmpPath = 'tmp/examples';
let appPrefix = 'vrize';

var options = {
  host: 'localhost',
  port: 3000,
  path: '/examples/all_lifted',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

var metaDataServer = "http://localhost:3000";

console.log('meta-data-proxy: entered');
app.listen(port, () => console.log(`Example app listening on port ${port}`))

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var setCors = function(req, res, next) {
  console.log(`index2.js: now setting cors`);
  // Set CORS headers
  // Since this is a proxy-server, and will be made publically avaialable (and
  // therefore is presumably locked-down e.g. no deleting of records allowed,
  // updates only under controlled circumstances etc), it's ok that it's
  // accessible to everyone. And indeed it *needs* to be accessible by everyone.
  // On the AWS side this is called via apache2 proxy_pass, so the origin would
  // be localhost anyway.  On development,  we call it directly, but while port
  // 1337 is open on development, it's not on ec2. Therefore, we probably could
  // restrict remote origins to localhost and any ip networks used during
  // development. But since the intent is to be widely accessible anyway this
  // would just be overkill (?).
  //
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
  //res.setHeader('Access-Control-Allow-Headers', 'content-type, responsetype, write-to-tmp');
  res.setHeader('Access-Control-Allow-Headers',
    'content-type, responsetype, write-to-tmp, access-control-allow-origin, access-control-allow-credentials');

  next();
}

app.use(setCors);


// use this
app.get("/examples/all_lifted.json", (req, resOuter, next) => {
  console.log('examples/all_lifted route');
  request.get('http://localhost:3000/examples/all_lifted.json',options,function(err,res,body){
      if(err) {
        console.log(`err=${err}`);
      }
      else if(res.statusCode !== 200 ) {
        console.log(`examples/all_lifted: got statusCode=${res.statusCode}`);
      }
      else {
        //res.end(body)
        console.log(`examples/all_lifted: got good status code`);
        resOuter.send(body);
      }
    });
})

app.get("/examples/all_curated.json", (req, resOuter, next) => {
  request.get(`${metaDataServer}/examples/by_tag.json?tag=mini-gal`,options,function(err,res,body){
      if(err) {
        console.log(`err=${err}`);
      }
      else if(res.statusCode !== 200 ) {
        console.log(`examples/all_curated: got statusCode=${res.statusCode}`);
      }
      else {
        //res.end(body)
        console.log(`examples/all_curated: got good status code,body.id=${body.id}, body.example_id=${body.example_id}`);
        // console.log(`good. resOuter=${util.inspect(resOuter)}`);
        resOuter.send(body);
      }
    });
})

app.put("/examples/:id/stats/increment.json", (req, resOuter, next) => {
  let id = req.params.id;
  let metric = req.query.metric;
  console.log(`metaDataServer.1337: now in increment, id=${id}, query=${req.query}, metric=${metric}`);
  console.log(`query=${util.inspect(req.query)}`);
  request.put(`${metaDataServer}/examples/${id}/stats/increment.json?${metric}`,options,function(err,res,body){
      if(err) {
        console.log(`err=${err}`);
      }
      else if(res.statusCode !== 200 ) {
        console.log(`examples/increment: got statusCode=${res.statusCode}`);
      }
      else {
        //res.end(body)
        console.log(`examples/increment: got good status code`);
        resOuter.send(body);
      }
    });
})
