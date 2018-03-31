// ByzAgree - Asynchronous Byzantine Fault Tolerant Network Scheme Test
// (c)2018 David C. Walley

var ByzNode = require("./ByzNode.js");

function Byzantine() {
  this._abyznode;
}

Byzantine.byzantineNEW = function() {
  var ob = new Byzantine;
  if (!ob._bRenew()) {
    return null;
  }
  return ob;
};

Byzantine.prototype._bRenew = function() {
  var me = this;
  me._abyznode = [];
  var asNAMES = ["ann", "bob", "cam", "dan", "eve"];
  var n = asNAMES.length;
  for (var i = 0; i < n; i++) {
    me._abyznode[i] = ByzNode.byznodeNEW(asNAMES[i], i, n);
  }
  console.log("Byzantine.byzantineNEW");
  return true;
};

Byzantine.prototype.Go = function() {
  var me = this;
  me._abyznode[0].Create("Payload 1");
  var n = me._abyznode.length;
  for (var i = 0; i < n; i++) {
    console.log("Hello:" + me._abyznode[i].s());
  }
  return true;
};

var g_byzantine = Byzantine.byzantineNEW();
g_byzantine.Go();

