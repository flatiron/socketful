/*
 * app.js Example `socketful` socket.io app
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */
 
var flatiron    = require('flatiron'),
    fixtures    = require('../test/fixtures'),
    ecstatic    = require('ecstatic'),
    socketful   = require('../lib/socketful'),
    resourceful = require('resourceful');

var app = module.exports = flatiron.app;
app.use(flatiron.plugins.http, {
  headers: {
    'x-powered-by': 'flatiron ' + flatiron.version
  },
  before: [
    ecstatic(__dirname + '/public')
  ]
});

//
// TODO: Better support for socketful to be use by:
//
//  app.use(socketful);
//
//
app.start(8000, function(){
  // Socket.io
  // -------------------------------------------------- //
  socketful.createServer([fixtures.Creature, fixtures.Album, fixtures.Song], { server: app.server });
  console.log(' > http server started on port 8000');
  console.log(' > visit: http://localhost:8000/ ');
});
