// ByzAgree.js
// ByzAgree Async BFT Network Communications Scheme Test
// Non-patented content (c)2018 David C. Walley, MIT license.

var ByzNode = require("./ByzNode.js");
var G = require("./G.js");
var g = G.g;


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
ByzAgree.prototype._bListAllNodes = function() {
  var me = this;
  console.log("--- All:");
  for (var i = 0; i < me._abyznodeAll.length; i++) {
    console.log(" -" + me._abyznodeAll[i].sListLogs());
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
  me._abyznodeAll[ANN].Create("HEY1");
  console.log('--- Ann creates "HEY1"');
  me._bListAllNodes();
  me._abyznodeAll[ANN].Create("HEY2");
  console.log('--- Ann creates "HEY2"');
  me._bListAllNodes();
  s = me._abyznodeAll[BOB].sLogsSizes();
  console.log("--- Bob tells Ann ~" + s);
  t = me._abyznodeAll[ANN].sNeeds(s);
  console.log("--- Ann sends Bob !" + t);
  me._abyznodeAll[BOB].Hark(t);
  me._bListAllNodes();
  return true;
};

// Create a global object.
var g_byzantine = ByzAgree.byzagreeNEW();
// Run it.
g_byzantine.Go();

