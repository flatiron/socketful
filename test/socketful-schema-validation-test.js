/*
 * socketful-api-test.js: Tests for `socketful` events
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var assert = require('assert'),
   vows = require('vows'),
   socketful = require('../lib/socketful'),
   io = require('socket.io-client'),
   fixtures = require('./fixtures');

var server, client;

vows.describe('socketful/socketful-schema-validation').addBatch({
 'When using `socketful`': {
   'creating a new server with one resource': {
     topic: function () {
       server = socketful.createServer(fixtures.User, {}, this.callback);
     },
     'should return a server': function (err, server) {
       assert.isObject(server);
     },
     'should contain the correct events': function (err, server) {
       assert.isObject(server);
     }
   }
 }
}).addBatch({
  'When using `socketful`': {
    'running resource tests against the server': {
      topic: function () {
        var self = this;
        client = io.connect('http://localhost:8000');
        self.callback(null, client);
        
      },
      'should return a client': function (err, client) {
        assert.isNull(err);
        assert.isObject(client);
      },
      'should contain the correct events': function (err, client) {
        assert.isObject(client);
      }
    }
  }
 }).addBatch({
  "creating a user without email" : {
    topic: function() {
      client.emit('user', 'create', { id: "bob" }, this.callback);
    },
    'should error' : function (err, result) {
      assert.isNotNull(err)
    },
    'should error correct message' : function (err, result) {
      assert.equal(err.validate.valid, false);
    }
  },
  "creating a user with invalid email" : {
    topic: function() {
      client.emit('user', 'create', { id: "bob", email: "foo@foo" }, this.callback);
    },
    'should error' : function (err, result) {
      assert.isNotNull(err)
    },
    'should error correct message' : function (err, result) {
      assert.equal(err.validate.valid, false);
    }
  },
  "creating a user with email" : {
    topic: function() {
      client.emit('user', 'create', { id: "bob", email: 'bob@marak.com' }, this.callback);
    },
    'should not error' : function (err, result) {
      assert.isNull(err)
    },
    'should error correct user' : function (err, result) {
      assert.isObject(result);
      assert.equal(result.email, 'bob@marak.com');
    }
  }
}).export(module);