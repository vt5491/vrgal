const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3002;
// const serveStatic = require( "serve-static" );
const util = require('util')

let readBasePath = 'src/assets/threejs-env/examples';
let tmpPath = 'tmp/examples';
let appPrefix = 'vrize';
// writeBasePath can be overriden at runtime
// let writeBasePath;
// let writeBasePath = readBasePath ;
// let readBasePath = 'tmp/examples';

app.listen(port, () => console.log(`Example app listening on port ${port}`))
// app.get('../note.txt', (req, res, next) => {

// Parsers for POST data
app.use(bodyParser.json());
// app.use(bodyParser.text());
// app.use(bodyParser);
app.use(bodyParser.urlencoded({ extended: false }));

// const router = express.Router();
// all of our routes will be prefixed with /src/assets/threejs-env
// app.use('/src/assets/threejs-env', router);

var setCors = function(req, res, next) {
  console.log(`index2.js: now setting cors`);
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
  // res.setHeader('Access-Control-Allow-Headers', '*');
  // res.setHeader('Access-Control-Allow-Headers', 'responsetype');
  // Access-Control-Allow-Credentials: true
  res.setHeader('Access-Control-Allow-Headers', 'content-type, responsetype, write-to-tmp');
  // I added these later.  Are they needed?
  // see https://stackoverflow.com/questions/12630230/how-do-cors-and-access-control-allow-headers-work
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, content-type, responsetype');

  next();
}

// app.use(setCors);
// router.use(setCors);
// middleware to use for all requests
// router.use(function(req, res, next) {
//     // do logging
//     console.log('Something is happening2.');
//     next(); // make sure we go to the next routes and don't stop here
// });
// router.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(404).send('Caught 404 error')
//
//   next();
// })

app.use(setCors);

// app.use('/examples', serveStatic('src/assets/threejs-env/examples'));
// app.use(express.static('./src/assets/threejs-env/'));
// app.use('/url2', serveStatic('C:\\dirC'));

// app.get('/abc.txt', function(req, res) {
// app.get('/examples/abc.txt', function(req, res) {
// app.get('/examples/webgl_geometry_cube.html', function(req, res) {
//   console.log(`abc.txt get handler`);
//   res.setHeader('Content-Type', 'text/plain'); //Tell the client you are sending plain text
//   res.end(req.cookies);
// });
// app.get("/src/assets/threejs-env/examples/:example", (req, res, next) => {
// router.get("/examples/:example", (req, res, next) => {
app.get("/examples/:example", (req, res, next) => {
// router.get("examples/:example", (req, res, next) => {
// router.get("*/examples/:example", (req, res, next) => {
  console.log(`route match, req.params['example:']=${req.params['example:']}`);
  console.log(`route match, req.params['example']=${req.params['example']}`);
  console.log(`route match, req.params=${req.params}`);
  // res.json({'data': data})
  // res.charset = 'UTF-8';
  // fs.readFile(`src/assets/threejs-env/examples/${req.params['example']}`, "utf8", function(err, data){
  fs.readFile(`${readBasePath}/${req.params['example']}`, "utf8", function(err, data){
  // fs.readFile(`src/assets/threejs-env/examples/${req.params}`, "utf8", function(err, data){
    if(err) throw err;
    // res.send(data.substr(0,200));
    // res.send(JSON.stringify(data));
    console.log(`data=${data.substr(0,400)}`);
    // res.send('look on node console for your answer');
    // res.set('x-timestamp', Date.now())
    // res.set('Content-Type', "text/html");
    // res.type('json');
    // res.send(escape(data));
    // res.send(data);
    res.json({'data': data})
    // res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
    // res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    // res.send generates a 500 "can't reset headers after they're sent to the client"
    // res.send(data);
    res.end(data);
  });
  // res.send(req.params)
})

app.post("/examples/:example", (req, res, next) => {
  console.log(`index2.js.post.log: file=${req.params['example']}`);
  // console.log(`index2.js.post.log: req.body=${req.body}`);
  // console.log(`index2.js.post.log: req.body.text=${req.body.text}`);
  // console.log(`app.post: req=${util.inspect(req, {showHidden: true, depth : 2})}`);
  console.log(`index2.js.post: req.get('write-to-tmp')=${req.get('write-to-tmp')}`);
  // let writeBasePath = (req.params['write-to-tmp'] == 'true') ? tmpPath : readBasePath;
  let writeBasePath = (req.get('write-to-tmp') == 'true') ? tmpPath : readBasePath;
  // let fp = writeBasePath + '/' + req.params['example'];
  let lifted_fp = `${writeBasePath}/${appPrefix}-${req.params['example']}`;
  console.log(`post: lifted_fp=${lifted_fp}`);
  // console.log(`util.inspect req.body=` + util.inspect(req.body, { showHidden: true, depth: 2 }));
  fs.open(lifted_fp, 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        // basically ignore this error
        console.error('myfile already exists');
        // return;
      }
      else {
        throw err;
      }
    }

    // writeMyData(fd);
    console.log(`post: about to call writeFile`);
    // fs.writeFileSync(path,content,{encoding:'utf8',flag:'w'});
    // fs.writeFileSync(fp, req.body.text, {encoding:'utf8',flag:'w'});
    fs.writeFile(lifted_fp, req.body.text, 'utf8', () => {
      console.log('app.post: file has been written');
    });
  });
  // res.setHeader('Content-type', 'text/plain');
  // res.charset = 'UTF-8';
  // res.send(`index2.js.post.html: file=${req.params['example']}`);
  res.type('json');
  // res.type('text');
  res.setHeader('responseType', 'text');
  // res.send(`index2.js.post.html: hi`);
  res.send(`index2.js.post.html: file=${req.params['example']}`);
})

// router.get('*', function(req,res){
//   console.log(`index2.js: now in / path handler`);
//   // debugger;
//
//   res.send();
//
// });
// app.get('/', (req, res) => res.send('Hello World 3'))
