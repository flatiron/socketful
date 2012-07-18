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

vows.describe('socketful/socketful-api-test').addBatch({
 'When using `socketful`': {
   'creating a new server with one resource': {
     topic: function () {
       server = socketful.createServer(fixtures.Creature, {}, this.callback);
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
  "creating a creature" : {
    topic: function() {
      client.emit('creatures', 'create', { id: "bob" }, this.callback);
    },
    'should create a new creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right id' : function (err, result) {
      console.log(result)
      assert.equal(result.id, "bob");
    }
  }
}).addBatch({
  "show created creature" : {
    topic: function() {
      client.emit('creatures', 'get', { id: "bob" }, this.callback);
    },
    'should create a new creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right id' : function (err, result) {
      assert.equal(result.id, "bob")
    }
  }
}).addBatch({
  "all creatures" : {
    topic: function() {
      client.emit('creatures', 'all', {}, this.callback);
    },
    'should list all creatures' : function (err, result) {
      assert.isNull(err)
      assert.isArray(result)
    },
    'should return the right amount of creatures' : function (err, result) {
      assert.equal(result.length, 1)
    }
  }
}).addBatch({
  "add another creature" : {
    topic: function() {
      client.emit('creatures', 'create', { id: "larry", life: 10 }, this.callback);
    },
    'should create a new creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right id' : function (err, result) {
      assert.equal(result.id, "larry")
    }
  }
}).addBatch({
  "all creatures" : {
    topic: function() {
      client.emit('creatures', 'all', {}, this.callback);
    },
    'should list all creatures' : function (err, result) {
      assert.isNull(err)
      assert.isArray(result)
    },
    'should return the right amount of creatures' : function (err, result) {
      assert.equal(result.length, 2)
    }
  }
}).addBatch({
  "update a creature" : {
    topic: function() {
      client.emit('creatures', 'update', { id: "larry", "type": "godzilla" }, this.callback);
    },
    'should return updated creature' : function (err, result) {
      assert.isNull(err)
      assert.isObject(result)
    },
    'should return the right type' : function (err, result) {
      assert.equal(result.type, "godzilla")
    }
  }
}).addBatch({
  "destroy a creature" : {
    topic: function() {
      client.emit('creatures', 'destroy', { id: "bob" }, this.callback);
    },
    'should not error' : function (err, result) {
      assert.isNull(err)
    }
  }
}).addBatch({
  "getting destroyed creature" : {
    topic: function() {
      client.emit('creatures', 'get', { id: "bob" }, this.callback);
    },
    'should error' : function (err, result) {
      assert.isNotNull(err)
    }
  }
}).addBatch({
  "all creatures" : {
    topic: function() {
      client.emit('creatures', 'all', {}, this.callback);
    },
    'should list all creatures' : function (err, result) {
      assert.isNull(err)
      assert.isArray(result)
    },
    'should return the right amount of creatures' : function (err, result) {
      assert.equal(result.length, 1)
    }
  }
}).addBatch({
  "feed the creature" : {
    topic: function() {
      client.emit('creatures', 'feed', { id: 'larry' }, this.callback);
    },
    'should not error' : function (err, result) {
      assert.isNull(err)
    },
    'should return creature with correct life' : function (err, result) {
      assert.equal(result, 'I have been fed my life is: 11');
    }
  }
}).addBatch({
  "get the creature" : {
    topic: function() {
      client.emit('creatures', 'get', { id: 'larry' }, this.callback);
    },
    'should not error' : function (err, result) {
      assert.isNull(err)
    },
    'should return correct life' : function (err, result) {
      assert.isNull(err)
      assert.equal(result.life, 11);
    }
  }
}).export(module);