// content of index.js
// const express = require('express');
// const bodyParser = require('body-parser');
var qs = require('querystring');
const http = require('http')
const util = require('util')
var fs = require('fs');
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  // console.log(`index.js: inspect(request)=${util.inspect(request, false, 4)}`);
  // console.log('request.body2 : %j', request.body);
  console.log(`requestHandler: request.method=${request.method}`);
  console.log(`requestHandler: request.headers=${JSON.stringify(request.headers)}`);
  // for( let i=0; i < request.headers.keys.length; i++) {
  //   console.log(`key=${re}`);
  // }
  // for (let keys)
  Object.keys(request.headers).forEach((k) => {
    console.log(`k=${k}, v=${request.headers[k]}`)
  })
  //  console.log(`requestHandler: body=${body}`);
  // console.log(`stringify Request=${JSON.stringify(request, null, 4)}`);
  // console.log(`request=${request}`);
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
  response.setHeader('Access-Control-Allow-Headers', '*');
  // if ( request.method === 'OPTIONS' ) {
  //   response.writeHead(200);
  //   response.end();
  //   return;
  // }


  if(request.method === "PUT") {
    // response.end('put: Hello from Node.js Server!')
    let body = '';
    request.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
      request.connection.destroy();
    });

    request.on('end', function () {
      var post = qs.parse(body);
      console.log(`put.end: post=${JSON.stringify(post)}`);
      console.log(`put.end: post.keys[0]=${Object.keys(post)[0]}`);
      let obj = JSON.parse(Object.keys(post)[0]);
      console.log(`post body=${obj}`);
      console.log(`typeof obj=${typeof obj}`);
      // let fn2= "my/file";
      let fn = Object.keys(obj)[0];
      console.log(`fn=${fn}`);
      let newContents = obj[fn];
      fnScrubbed = fn.replace(/\"/g, '');
      console.log(`fnScrubbed=${fnScrubbed}`);
      var oldContents = fs.readFileSync(fnScrubbed, 'utf8');
      console.log(`oldContents=${oldContents}`);
      console.log(`newContents=${newContents}`);
      // use post['blah'], etc.
      fs.writeFile(fnScrubbed, newContents, function(err) {
        if(err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });
    });
  }
  else if (request.method === 'GET') {
    // response.end('hi from get')
    var contents = fs.readFileSync('src/assets/threejs-env/examples/webgl_geometry_cube.html', 'utf8');
    console.log(contents);
    // response.end(JSON.stringify(contents);
    response.end(contents);
  }
  else {
    response.end('no matches');
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

// Get dependencies
console.log('hi')
// const express = require('express');
// const path = require('path');
// const http = require('http');
// const bodyParser = require('body-parser');

// // Get our API routes
// const api = require('./server/routes/api');

// const app = express();

// // Parsers for POST data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Point static path to dist
// app.use(express.static(path.join(__dirname, 'dist')));

// // Set our api routes
// app.use('/api', api);

// // Catch all other routes and return the index file
// app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, 'dist/index.html'));
// });
// /**
 // * Get port from environment and store in Express.
 // */
// const port = process.env.PORT || '3000';
// app.set('port', port);

// /**
 // * Create HTTP server.
 // */
// const server = http.createServer(app);

// /**
 // * Listen on provided port, on all network interfaces.
 // */
// server.listen(port, () => console.log(`API running on localhost:${port}`));

// The above code sets up a simple express app, with an /api route and all other routes are directed towards the dist/index.html page. This catch all route, denoted with *, MUST come last after all other API routes have been defined.

// The /api route points to a file ./server/routes/api.js. Let's create this file.

// server/routes/api.js

// const express = require('express');
// const router = express.Router();

// /* GET api listing. */
// router.get('/', (req, res) => {
  // res.send('api works');
// });

// module.exports = router;
