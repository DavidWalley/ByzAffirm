// ByzAgree.js
// ByzAgree Async BFT Network Communications Scheme Test
// Non-patented content (c)2018 David C. Walley, MIT license.

var ByzNode = require("./ByzNode.js");
var G = require("./G.js");
var g = G.g;


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
  var asNAMES = ["ann", "bob", "cam"];
  var n = asNAMES.length;
  for (var i = 0; i < n; i++) {
    me._abyznode[i] = ByzNode.byznodeNEW(asNAMES[i], i, n);
  }
  console.log("--- ByzAgree starts.");
  return true;
};

// Display state of all nodes' logs and copies.
ByzAgree.prototype._bShowAll = function() {
  var me = this;
  console.log("--- All:");
  for (var i = 0; i < me._abyznode.length; i++) {
    console.log(" -" + me._abyznode[i].sListLogs());
  }
  return true;
};

// Start a simulated run.
ByzAgree.prototype.Go = function() {
  var me = this;
  var s = "";
  var t = "";
  g.whenNowTo_ms(1500);
  me._abyznode[0].Create("HEY1");
  console.log('-2- Ann creates "HEY1"');
  me._bShowAll();
  s = me._abyznode[1].sLogsSizes();
  console.log("-4- Bob tells Ann ~" + s);
  t = me._abyznode[0].sNeeds(s);
  me._abyznode[1].Hark(t);
  me._bShowAll();
  s = me._abyznode[0].sLogsSizes();
  console.log("-6- A tells B ~" + s + ".");
  t = me._abyznode[1].sNeeds(s);
  me._abyznode[0].Hark(t);
  me._bShowAll();
  s = me._abyznode[1].sLogsSizes();
  console.log("-8- B tells A ~" + s + ".");
  t = me._abyznode[0].sNeeds(s);
  me._abyznode[1].Hark(t);
  me._bShowAll();
  s = me._abyznode[0].sLogsSizes();
  console.log("-a- A tells B ~" + s + ".");
  t = me._abyznode[1].sNeeds(s);
  me._abyznode[0].Hark(t);
  me._bShowAll();
  return true;
};

// Create a global object.
var g_byzantine = ByzAgree.byzagreeNEW();
// Run it.
g_byzantine.Go();

