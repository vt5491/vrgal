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

/*
app.get("/examples/abc.json", (req, res, next) => {
  res.type('json');
  res.setHeader('responseType', 'text');
  res.send(`abc: hi`);
})

var options3 = {
  host: 'localhost:3000',
  path: '/examples/all_lifted.json'
};


app.get("/examples/all_lifted_3.json", (req, resOuter, next) => {
  var req = http.get(options3, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    //Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      // ...and/or process the entire body here.
      //return body;
      resOuter.send(body);
      //res.json()
    })
  })
  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
  //console.log(`abc: body=${body}`);
})


app.get("examples/all_lifted_2", (req, resOuter, next) => {
  console.log(`all_lifted: route match, req.params['example:']=${req.params['example:']}`);
  var port = options.port == 443 ? https : http;
  var req = port.request(options, function(res)
      {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
          output += chunk;
        });

        res.on('end', function() {
          var obj = JSON.parse(output);
          onResult(res.statusCode, obj);
          resOuter.send(output);
        });
      });

  req.on('error', function(err) {
    res.send('error: ' + err.message);
  });

  req.end();
})
*/

//app.get("/examples/:example", (req, res, next) => {
//  console.log(`route match, req.params['example:']=${req.params['example:']}`);
//  console.log(`route match, req.params['example']=${req.params['example']}`);
//  console.log(`route match, req.params=${req.params}`);
//  fs.readFile(`${readBasePath}/${req.params['example']}`, "utf8", function(err, data){
//  // fs.readFile(`src/assets/threejs-env/examples/${req.params}`, "utf8", function(err, data){
//    if(err) throw err;
//    console.log(`data=${data.substr(0,400)}`);
//    res.json({'data': data})
//    res.charset = 'UTF-8';
//    res.end(data);
//  });
//})

//app.get("/src/assets/threejs-env/examples/:example", (req, res, next) => {
//  console.log(`route match, req.params['example:']=${req.params['example:']}`);
//  console.log(`route match, req.params['example']=${req.params['example']}`);
//  console.log(`route match, req.params=${req.params}`);
//  fs.readFile(`src/assets/threejs-env/examples/${req.params['example']}`, "utf8", function(err, data){
//    if(err) throw err;
//    res.json({'data': data})
//    res.charset = 'UTF-8';
//    res.end(data);
//  });
//})
//
//
//
//app.post("/examples/:example", (req, res, next) => {
//  console.log(`index2.js.post.log: file=${req.params['example']}`);
//  console.log(`index2.js.post: req.get('write-to-tmp')=${req.get('write-to-tmp')}`);
//  let writeBasePath = (req.get('write-to-tmp') == 'true') ? tmpPath : readBasePath;
//  let lifted_fp = `${writeBasePath}/${appPrefix}-${req.params['example']}`;
//  console.log(`post: lifted_fp=${lifted_fp}`);
//  fs.open(lifted_fp, 'wx', (err, fd) => {
//    if (err) {
//      if (err.code === 'EEXIST') {
//        // basically ignore this error
//        console.error('myfile already exists');
//        // return;
//      }
//      else {
//        throw err;
//      }
//    }
//
//    // writeMyData(fd);
//    console.log(`post: about to call writeFile`);
//    fs.writeFile(lifted_fp, req.body.text, 'utf8', () => {
//      console.log('app.post: file has been written');
//    });
//  });
//  res.type('json');
//  res.setHeader('responseType', 'text');
//  res.send(`index2.js.post.html: file=${req.params['example']}`);
//})
