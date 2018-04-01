// ByzNode.js
// Network Node in ByzAgree Async BFTolerant communications scheme test.
// Non-patented content (c)2018 David C. Walley, MIT license.

var G = require("./G.js");
var g = G.g;

// ByzAgree network node class.
function ByzNode() {
  // Private variables:
  this._sName;
  this._iWhich;
  this._nNodes;
  this._a2sData;
  this._a2when;
  this._a2sLetter;
}

// Factory constructor of instance of this class.
ByzNode.byznodeNEW = function(a_sName, a_iWhich, a_nNodes) {
  var ob = new ByzNode;
  if (!ob._bRenew(a_sName, a_iWhich, a_nNodes)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzNode.prototype._bRenew = function(a_sName, a_iWhich, a_nNodes) {
  var me = this;
  me._sName = a_sName;
  me._iWhich = a_iWhich;
  me._nNodes = a_nNodes;
  me._a2sData = [];
  me._a2when = [];
  me._a2sLetter = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sData[i] = [];
    me._a2when[i] = [];
    me._a2sLetter[i] = [];
  }
  return true;
};

// Create log item.
ByzNode.prototype.Create = function(a_sData) {
  var me = this;
  var i = me._a2sData.length;
  var when = g.whenNow_ms();
  me._a2sData[me._iWhich].push(a_sData);
  me._a2when[me._iWhich].push(when);
  me._a2sLetter[me._iWhich].push(me._sSeal(i, a_sData, when));
  return true;
};

// Encrypt and sign a message (or at least fake it for display and testing).
ByzNode.prototype._sSeal = function(a_i, a_sData, a_when) {
  var me = this;
  var s = a_when + "," + a_sData;
  return "(" + G.sHASH(s) + "/" + s + ")" + me._sName;
};

// Report current state (for debug mostly).
ByzNode.prototype.s = function() {
  var me = this;
  var r_s = me._sName;
  var n = me._a2sData.length;
  var m;
  var j;
  for (var i = 0; i < n; i++) {
    r_s += "\n" + "    " + i + "=" + ["a", "b", "c", "d", "e", "f"][i] + "/";
    m = me._a2sData[i].length;
    if (0 < m) {
      for (j = 0; j < m; j++) {
        r_s += "\n      " + me._a2when[i][j];
        r_s += "," + me._a2sData[i][j];
        r_s += "," + me._a2sLetter[i][j];
      }
    }
  }
  return r_s;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;

