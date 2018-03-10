const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3002;

app.listen(port, () => console.log(`Example app listening on port ${port}`))
// app.get('../note.txt', (req, res, next) => {

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
// all of our routes will be prefixed with /src/assets/threejs-env
app.use('/src/assets/threejs-env', router);

var setCors = function(req, res, next) {
  console.log(`index2.js: now setting cors`);
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
  // res.setHeader('Access-Control-Allow-Headers', '*');
  // res.setHeader('Access-Control-Allow-Headers', 'responsetype');
  // Access-Control-Allow-Credentials: true
  res.setHeader('Access-Control-Allow-Headers', 'content-type, responsetype');
  // I added these later.  Are they needed?
  // see https://stackoverflow.com/questions/12630230/how-do-cors-and-access-control-allow-headers-work
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, content-type, responsetype');

  next();
}

// app.use(setCors);
router.use(setCors);
// app.use((req, res, next) => {
//   console.log(`index2.js: now setting cors`);
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Request-Method', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//
//   next();
// })
// app.get('/servers/note.txt', (req, res, next) => {
//   // console.log(`index.js=${res}`);
//   fs.readFile("servers/note.txt", "utf8", function(err, data){
//     if(err) throw err;
//
//     res.send(data);
//   });
//   // res.send('you want to see note.txt');
//
//   // next();
// })
//
// Note: routes start with a leading slash, and files don't
// app.get("/src/environments/environment.ts", (req, res, next) => {
//   fs.readFile("src/environments/environment.ts", "utf8", function(err, data){
//     if(err) throw err;
//
//     res.send(data);
//   });
// })

// app.get("/src/assets/threejs-env/examples/abc.html", (req, res, next) => {
//   fs.readFile("src/assets/threejs-env/examples/abc.html", "utf8", function(err, data){
//     if(err) throw err;
//
//     res.send(data);
//   });
// });
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening2.');
    next(); // make sure we go to the next routes and don't stop here
});

// app.get("/src/assets/threejs-env/examples/:example", (req, res, next) => {
router.get("/examples/:example", (req, res, next) => {
  console.log(`route match, req.params['example:']=${req.params['example:']}`);
  console.log(`route match, req.params['example']=${req.params['example']}`);
  console.log(`route match, req.params=${req.params}`);
  fs.readFile(`src/assets/threejs-env/examples/${req.params['example']}`, "utf8", function(err, data){
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
    res.send(data);
  });
  // res.send(req.params)
})

router.post("/examples/:example", (req, res, next) => {
  console.log(`index2.js.post.log: file=${req.params['example']}`);
  // res.setHeader('Content-type', 'text/plain');
  // res.charset = 'UTF-8';
  // res.send(`index2.js.post.html: file=${req.params['example']}`);
  res.type('json');
  // res.type('text');
  res.setHeader('responseType', 'text');
  // res.send(`index2.js.post.html: hi`);
  res.send(`index2.js.post.html: file=${req.params['example']}`);
})
// app.get('/', (req, res) => res.send('Hello World 3'))
