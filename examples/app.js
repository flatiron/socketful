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
app.resources = {};
app.resources.Creature = fixtures.Creature;
app.resources.Album = fixtures.Album;

app.use(flatiron.plugins.http, {
  headers: {
    'x-powered-by': 'flatiron ' + flatiron.version
  },
  before: [
    ecstatic(__dirname + '/public')
  ]
});
app.start(8000);

socketful.createServer([app.resources.Creature], { server: app.server });

console.log(' > http server started on port 8000');
console.log(' > visit: http://localhost:8000/ ');