/*
 * server.js: Simple http server with `sockful` server
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */
 
var http        = require('http'),
    fixtures    = require('../test/fixtures'),
    sockful   = require('../lib/sockful'),
    resourceful = require('resourceful');

//
// Create a new socket server based on defined resources
//
var server = sockful.createServer([fixtures.Creature, fixtures.Album]);

console.log(' > socket server started on port 8000');
