// ByzNode - ByzAgree Node
// (c)2018 David C. Walley

var g = require("./G.js");

function ByzNode() {
  this._sName;
  this._iWhich;
  this._nNodes;
  this._a2sData;
  this._a2when;
  this._a2sLetter;
}

ByzNode.byznodeNEW = function(a_sName, a_iWhich, a_nNodes) {
  var ob = new ByzNode;
  if (!ob._bRenew(a_sName, a_iWhich, a_nNodes)) {
    return null;
  }
  return ob;
};

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

ByzNode.prototype.Create = function(a_sData) {
  var me = this;
  var i = me._a2sData.length;
  var when = g.whenNow_ms();
  me._a2sData[me._iWhich].push(a_sData);
  me._a2when[me._iWhich].push(when);
  me._a2sLetter[me._iWhich].push(me._sSeal(i, a_sData, when));
  return true;
};

ByzNode.prototype._sSeal = function(a_i, a_sData, a_when) {
  var me = this;
  return "(" + me._iWhich + ":" + a_i + ',"' + a_sData + '",' + a_when + ")" + me._sName;
};

ByzNode.prototype.s = function() {
  var me = this;
  return me._sName + " " + "TODO";
};

module.exports.byznodeNEW = ByzNode.byznodeNEW;

