// ByzTest.js - Setup and run a network simulation test on localhost ByzAffirm server nodes.
// (c)2018 David C. Walley, MIT license.

console.log("##13 ByzTest.js running under NODE");
var NodeServer = require("./NodeServer.js");
if ("undefined" === typeof g) {
  var G = require("./G.js");
  var g = G.g;
}

// Define a class to test a number of ByzAffirm nodes.
function ByzTest() {
  // Private variables:
  this._anodeserverAll;
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
  me._anodeserverAll = [];
  var n = a_asNodeNames.length;
  for (var i = 0; i < n; i++) {
    me._anodeserverAll[i] = NodeServer.nodeserverNEW(a_asNodeNames[i], i, n);
  }
  
  console.log("##14 Start All.");
  me._ConsoleShowAll();
  setTimeout(function() {
    console.log('##15 Ann creates "Data1".');
    me._anodeserverAll[0].CreateLog("Data1");
    me._ConsoleShowAll();
  }, 5000);
  setTimeout(function() {
    me._ConsoleShowAll();
  }, 10000);
  setTimeout(function() {
    me._ConsoleShowAll();
  }, 15000);
  
  return true;
};

// Display this node's copy of the logs.
ByzTest.prototype._ConsoleShowAll = function() {
  var me = this;
  var n = me._anodeserverAll.length;
  for (var i = 0; i < n; i++) {
    console.log("##16 Logs at node " + i + ": " + me._anodeserverAll[i].sListOfMyLogs());
  }
  return true;
};

var g_biztest = ByzTest.byztestNEW(["ann", "bob", "cam"]);

