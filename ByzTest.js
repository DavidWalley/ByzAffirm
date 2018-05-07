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
ByzTest.byztestNEW = function(a_nNodes) {
  var ob = new ByzTest;
  if (!ob._bRenew(a_nNodes)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzTest.prototype._bRenew = function(a_nNodes) {
  var me = this;
  me._anodeserver = [];
  // Set up some simulated server nodes.
  me._anodeserver[0] = NodeServer.nodeserverNEW(me, 0, a_nNodes, 100);
  me._anodeserver[1] = NodeServer.nodeserverNEW(me, 1, a_nNodes, 200);
  me._anodeserver[2] = NodeServer.nodeserverNEW(me, 2, a_nNodes, 0);
  me._anodeserver[3] = NodeServer.nodeserverNEW(me, 3, a_nNodes, -200);
  me._anodeserver[4] = NodeServer.nodeserverNEW(me, 4, a_nNodes, 500);
  // Start clock with recognizable value.
  g.whenNowTo_ms(1500000);
  me._Tell("Start all.");
  me._Tell("Ann off-line.");
  me._anodeserver[0].TurnOff();
  // Create a brand new memo.
  setTimeout(function() {
    me._Tell("Bob makes 'Hey1'.");
    me._anodeserver[1].MakeMemo("Hey1");
    me.ShowAll();
  }, 5000);
  // Create a brand new memo.
  setTimeout(function() {
    me._Tell("Cam makes 'Hey2'.");
    me._anodeserver[2].MakeMemo("Hey2");
    me.ShowAll();
  }, 5000);
  // Output everything for every node, after 10 seconds.
  setTimeout(function() {
    me.ShowAll();
  }, 10000);
  // Output everything for every node, after 15 seconds.
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

var g_biztest = ByzTest.byztestNEW(5);
