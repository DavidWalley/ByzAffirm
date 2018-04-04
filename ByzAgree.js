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
  var ANN = 0;
  var BOB = 1;
  var CAM = 2;
  var DAN = 3;
  var EVE = 4;
  g.whenNowTo_ms(1500);
  me._abyznode[ANN].Create("HEY1");
  me._abyznode[ANN].Create("HEY2");
  s = me._abyznode[BOB].sLogsSizes();
  t = me._abyznode[ANN].sNeeds(s);
  me._abyznode[BOB].Hark(t);
  s = me._abyznode[ANN].sLogsSizes();
  console.log("-6- Ann tells Bob ~" + s + ".");
  me._bShowAll();
  t = me._abyznode[BOB].sNeeds(s);
  me._abyznode[ANN].Hark(t);
  console.log("-7- Bob sends Ann !" + t + ".");
  me._bShowAll();
  s = me._abyznode[BOB].sLogsSizes();
  console.log("-8- Bob tells Ann ~" + s + ".");
  me._bShowAll();
  t = me._abyznode[ANN].sNeeds(s);
  me._abyznode[BOB].Hark(t);
  console.log("-9- Ann sends Bob !" + t + ".");
  me._bShowAll();
  s = me._abyznode[ANN].sLogsSizes();
  console.log("-a- Ann tells Bob ~" + s + ".");
  me._bShowAll();
  t = me._abyznode[BOB].sNeeds(s);
  me._abyznode[ANN].Hark(t);
  console.log("-b- Bob sends Ann !" + t + ".");
  me._bShowAll();
  return true;
};

// Create a global object.
var g_byzantine = ByzAgree.byzagreeNEW();
// Run it.
g_byzantine.Go();

