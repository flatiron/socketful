/*
 * one-many-test.js: Tests for `socketful` events
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var assert = require('assert'),
   vows = require('vows'),
   socketful = require('../../lib/socketful'),
   io = require('socket.io-client'),
   fixtures = require('../fixtures');

var server, client;
vows.describe('socketful/relational/one-many-test').addBatch({
 'When using `socketful`': {
   'creating a new server with a resource that has children': {
     topic: function () {
       server = socketful.createServer([fixtures.Album], {}, this.callback);
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
  "creating an album" : {
    topic: function() {
      client.emit('album', 'create', { id: "Ill-Communication" }, this.callback);
    },
    'should create a new creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right id' : function (err, result) {
      console.log(result)
      assert.equal(result.id, "Ill-Communication");
    }
  }
}).addBatch({
  "creating a song on that album" : {
    topic: function() {
      client.emit('album', 'createSong', { id: "Root-Down", album_id: "Ill-Communication" }, this.callback);
    },
    'should create a new creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right id' : function (err, result) {
      console.log(result)
      assert.equal(result.id, "album/Ill-Communication/Root-Down");
      assert.equal(result.resource, "Song");
    }
  }
}).addBatch({
  "getting the same album" : {
    topic: function() {
      client.emit('album', 'get', { id: "Ill-Communication" }, this.callback);
    },
    'should not error' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the new song' : function (err, result) {
      assert.equal(result.id, "Ill-Communication");
      assert.equal(result.song_ids.length, 1);
      assert.equal(result.song_ids[0], "Root-Down");
    }
  }
}).export(module);