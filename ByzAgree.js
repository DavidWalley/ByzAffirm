// ByzAgree.js
// ByzAgree Async BFT Network Communications Scheme Test
// Non-patented content (c)2018 David C. Walley, MIT license.

var ByzNode = require("./ByzNode.js");
var g = ByzNode.g;

// BFT test/demo class.
function ByzAgree() {
  // Private variables:
  this._abyznodeAll;
}

// Factory constructor of instance of this class.
ByzAgree.byzagreeNEW = function() {
  var ob = new ByzAgree;
  if (!ob._bRenew()) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzAgree.prototype._bRenew = function() {
  var me = this;
  me._abyznodeAll = [];
  var asNAMES = ["ann", "bob", "cam", "dan", "eve"];
  var n = asNAMES.length;
  for (var i = 0; i < n; i++) {
    me._abyznodeAll[i] = ByzNode.byznodeNEW(asNAMES[i], i, n);
  }
  console.log("--- ByzAgree starts.");
  return true;
};

// Display state of all nodes' logs and copies.
ByzAgree.prototype._sListAllNodes = function() {
  var me = this;
  console.log("--- All:");
  for (var i = 0; i < me._abyznodeAll.length; i++) {
    console.log(me._abyznodeAll[i].s());
  }
  return true;
};

// Start a simulated run.
ByzAgree.prototype.Go = function() {
  var me = this;
  g.whenNowTo_ms(1000);
  me._abyznodeAll[0].Create("Payload 1");
  console.log('--- Ann creates "Payload 1"');
  me._sListAllNodes();
  return true;
};

// Create a global object.
var g_byzantine = ByzAgree.byzagreeNEW();
// Run it.
g_byzantine.Go();

