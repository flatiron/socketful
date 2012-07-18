/*
 * sockful.js: creates socket.io event maps to resourceful
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var sockful = exports,
    resourceful = require('resourceful'),
    util     = require('util'),
    utile    = require('utile'),
    http     = require('http');

exports.engines = {
  "socket.io": require('../lib/engines/socketio')
};

//
// ### function createServer (resources)
// #### @resources {resourceful.Resource} Resource(s) to use for the server.
//
// Responds with an `http.Server` instance with a `sockfulRouter` for the
// specified `resources`.
//
exports.createServer = function (resources, options, callback) {
  options = options || {};
  options.engine = options.engine || 'socket.io';
  if (!Array.isArray(resources)){
    resources = [resources];
  }
  return sockful.engines[options.engine].createServer(resources, options, callback);
};

//
// Name this `broadway` plugin.
//
exports.name = 'sockful';

//
// ### function init ()
// Initializes the `sockful` plugin with the App.
//
exports.init = function (done) {
  var app = this;

  if (app.resources) {
    //sockful.createServer(app.resources);
  }

  done();
};