// ByzAgree.js
// ByzAgree Async BFT Network Communications Scheme Test
// Non-patented content (c)2018 David C. Walley, MIT license.

var ByzNode = require("./ByzNode.js");
var g = ByzNode.g;

// BFT test/demo class.
function ByzAgree() {
  // Private variables:
  this._abyznode;
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
  me._abyznode = [];
  var asNAMES = ["ann", "bob", "cam", "dan", "eve"];
  var n = asNAMES.length;
  for (var i = 0; i < n; i++) {
    me._abyznode[i] = ByzNode.byznodeNEW(asNAMES[i], i, n);
  }
  console.log("--- ByzAgree.byzagreeNEW");
  return true;
};

// Start a simulated run.
ByzAgree.prototype.Go = function() {
  var me = this;
  g.whenNowTo_ms(1000);
  me._abyznode[0].Create("Payload 1");
  console.log("--- 0 Create Payload 1");
  console.log("---");
  var n = me._abyznode.length;
  for (var i = 0; i < n; i++) {
    console.log(me._abyznode[i].s());
  }
  return true;
};

// Create a global object.
var g_byzantine = ByzAgree.byzagreeNEW();
// Run it.
g_byzantine.Go();

