// ByzTest.js
// Setup and run test on local ByzAgree nodes.
// (c)2018 David C. Walley, MIT license.

console.log("ByzTest NODE");
var NodeServer = require("./NodeServer.js");
if ("undefined" === typeof g) {
  var G = require("./G.js");
  var g = G.g;
}

// Define a class to test a number of ByzAgree nodes.
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
  
  console.log("-0-- Start All.");
  me.ConsoleShow();
  me._anodeserverAll[0].Create("Hello1");
  console.log('-1-- Ann created "Hello1".');
  me.ConsoleShow();
  
  return true;
};

// Display this node's copy of the logs.
ByzTest.prototype.ConsoleShow = function() {
  var me = this;
  var n = me._anodeserverAll.length;
  for (var i = 0; i < n; i++) {
    console.log(me._anodeserverAll[i].sIKnowAbout());
  }
  return true;
};

var g_biztest = ByzTest.byztestNEW(["ann", "bob", "cam"]);

