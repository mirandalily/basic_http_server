const http = require('http');
const fs = require('fs');
const readStream = require('stream');
var url = require('url');

exports.server = http.createServer((req, res) => {
  var name = req.url.slice(7);

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index')) {
    console.log('index page');
    res.writeHead(200, {'Content-Type': 'text/html'});
    var index = fs.createReadStream(__dirname + '/../public/index.html');
    return index.pipe(res);
  }

  if (req.method === 'GET' && req.url === '/time') {
    console.log('Requested time: ' + new Date());
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Current date and time: ' + new Date());
    return res.end();
  }

  if (req.method === 'GET' && req.url === ('/greet/' + name) && name.length > 0) {
    console.log(name + ' requested greeting');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hi there, ' + name + '!');
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/greet') {
    console.log('Posted message to server');
    req.on('data', function(data) {
      var jsonFormat = JSON.parse(data.toString());
      console.log(jsonFormat);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Hi there, ' + jsonFormat.name + '!');
      return res.end();
    });
  }

  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({msg: 'Error: Page not found'}));
  return res.end();
});
