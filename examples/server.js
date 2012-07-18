/*
 * server.js: Simple http server with `socketful` server
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */
 
var http        = require('http'),
    fixtures    = require('../test/fixtures'),
    socketful   = require('../lib/socketful'),
    resourceful = require('resourceful');

//
// Create a new socket server based on defined resources
//
var server = socketful.createServer([fixtures.Creature, fixtures.Album]);

console.log(' > socket server started on port 8000');
