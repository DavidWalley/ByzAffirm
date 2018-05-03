// ByzTest.js - Setup and run a network simulation test on localhost ByzAffirm server nodes.
// (c)2018 David C. Walley, MIT license.

console.log("ByzTest.js running under NODE");
var NodeServer = require("./NodeServer.js");
if ("undefined" === typeof g) {
  // Global singleton general purpose routines and handy code conveniences:
  var G = require("./G.js");
  var g = G.g;
}

// Define a class to test a simulated network of ByzAffirm nodes.
function ByzTest() {
  // Private variables:
  this._anodeserver;
}

// Factory constructor of instance of this class.
ByzTest.byztestNEW = function(a_asNodeNames) {
  var ob = new ByzTest;
  if (!ob._bRenew(a_asNodeNames)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzTest.prototype._bRenew = function(a_asNodeNames) {
  var me = this;
  me._anodeserver = [];
  // Set up some simulated server nodes.
  var n = a_asNodeNames.length;
  for (var i = 0; i < n; i++) {
    me._anodeserver[i] = NodeServer.nodeserverNEW(a_asNodeNames[i], i, n, me);
  }
  // Start clock with recognizable value.
  g.whenNowTo_ms(150000);
  me._Tell("Start all.");
  me._Tell("Ann goes off-line.");
  me._anodeserver[0].TurnOff();
  setTimeout(function() {
    me._Tell("Bob creates 'Hey1'.");
    me._anodeserver[1].MakeMemo("Hey1");
    me.ShowAll();
  }, 5000);
  setTimeout(function() {
    me._Tell("Cam creates 'Hey2'.");
    me._anodeserver[2].MakeMemo("Hey2");
    me.ShowAll();
  }, 5000);
  setTimeout(function() {
    me.ShowAll();
  }, 10000);
  setTimeout(function() {
    me.ShowAll();
  }, 15000);
  
  return true;
};

// Log message to console.
ByzTest.prototype._Tell = function(a_sText) {
  var me = this;
  console.log("+++" + g.whenNow_ms() + " " + a_sText);
  return true;
};

// Display this node's copy of the logs.
ByzTest.prototype.ShowAll = function() {
  var me = this;
  var n = me._anodeserver.length;
  console.log("");
  for (var i = 0; i < n; i++) {
    me._Tell(me._anodeserver[i].sShowMyCopies());
  }
  console.log("");
  return true;
};

var g_biztest = ByzTest.byztestNEW(["ann", "bob", "cam", "dan", "eve"]);
