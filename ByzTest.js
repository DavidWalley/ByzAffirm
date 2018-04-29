// ByzTest.js - Setup and run a network simulation test on localhost ByzAffirm server nodes.
// (c)2018 David C. Walley, MIT license.

console.log("ByzTest.js running under NODE");
var NodeServer = require("./NodeServer.js");
if ("undefined" === typeof g) {
  // Global singleton general purpose routines and handy code conveniences.
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
    me._anodeserver[i] = NodeServer.nodeserverNEW(a_asNodeNames[i], i, n);
  }
  // Start clock with recognizable value.
  g.whenNowTo_ms(150000);
  me._Tell("Start all.");
  setTimeout(function() {
    me._Tell("Dan creates 'Dan1'.");
    me._anodeserver[3].CreateLog("Dan1");
    me._ShowAll();
  }, 5000);
  setTimeout(function() {
    me._ShowAll();
  }, 10000);
  setTimeout(function() {
    me._ShowAll();
  }, 15000);
  
  return true;
};

// Log message to console.
ByzTest.prototype._Tell = function(a_sText) {
  var me = this;
  console.log("++++ " + g.whenNow_ms() + " " + a_sText);
  return true;
};

// Display this node's copy of the logs.
ByzTest.prototype._ShowAll = function() {
  var me = this;
  var n = me._anodeserver.length;
  for (var i = 0; i < n; i++) {
    me._Tell(me._anodeserver[i].sListOfMyLogs());
  }
  return true;
};

var g_biztest = ByzTest.byztestNEW(["ann", "bob", "cam", "dan", "eve"]);
