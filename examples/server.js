/*
 * server.js: Simple socket.io `socketful` server
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */
 
var http        = require('http'),
    fs          = require('fs'),
    fixtures    = require('../test/fixtures'),
    socketful   = require('../lib/socketful'),
    resourceful = require('resourceful');

//
// Create a new socket server based on defined resources
//
var server = http.createServer(function(req, res){
  fs.readFile(__dirname + '/public/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

var Book = resourceful.define('book', function () {
  this.string('title');
  this.number('year');
  this.bool('fiction');
});
var Author = resourceful.define('author', function () {
  this.number('age');
  this.string('hair').sanitize('lower');
});
var Creature = resourceful.define('creature', function () {
  this.string('name');
});
socketful.createServer([fixtures.Creature, fixtures.Album, fixtures.Song], { server: server });
server.listen(8000);

console.log(' > socket server started on port 8000');
