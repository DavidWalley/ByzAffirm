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
  me._a2sLetter = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sLetter[i] = [];
  }
  return true;
};

// Create item with data-payload in own log.
ByzNode.prototype.Create = function(a_sData) {
  var me = this;
  var when = g.whenNow_ms();
  var i = me._a2sLetter[me._iWhich].length;
  me._a2sLetter[me._iWhich].push(me._sSealAndSign(i, a_sData, when));
  return true;
};

// Encrypt and sign a message (or at least fake it for display and testing).
ByzNode.prototype._sSealAndSign = function(a_i, a_sData, a_when) {
  var me = this;
  var s = me._iWhich + "," + a_i + "," + a_when + ',"' + a_sData + '"';
  return me._sName + "{#" + G.sHASH(s) + "," + s + "}";
};

// Create a message to report sizes of all logs kept by this node, for telling another node about extent of what is known.
ByzNode.prototype.sLogsSizes = function() {
  var me = this;
  var r_s = "" + me._iWhich;
  var n = me._a2sLetter.length;
  for (var i = 0; i < n; i++) {
    r_s += (0 === i ? "[" : ",") + me._a2sLetter[i].length;
  }
  r_s += "]";
  return r_s;
};

// Report what other node does not know.
ByzNode.prototype.sNeeds = function(a_sLogSizesOfOtherNode) {
  var me = this;
  var r_s = "";
  var iOther = parseInt(a_sLogSizesOfOtherNode, 10);
  var as = a_sLogSizesOfOtherNode.split("[");
  if (as.length < 2) {
    console.log("Oops:" + JSON.stringify(as));
    return "Error";
  }
  as = as[1].split(",");
  var iOtherNodeAt = 0;
  var iIAmAt = 0;
  for (var i = 0; i < as.length; i++) {
    iOtherNodeAt = parseInt(as[i], 10);
    iIAmAt = me._a2sLetter[i].length;
    for (var j = iOtherNodeAt; j < iIAmAt; j++) {
      r_s += " + " + me._a2sLetter[i][j];
    }
  }
  return r_s;
};

// Process all important incoming message.
ByzNode.prototype.Hark = function(a_sSackOfLetters) {
  var me = this;
  console.log("--- " + me._sName + ".Hark(" + a_sSackOfLetters + ").");
  var s = "";
  var asLetter = a_sSackOfLetters.split("+");
  var n = asLetter.length;
  for (var i = 1; i < n; i++) {
    s += me._sHark_Open(asLetter[i].trim());
  }
  if ("" !== s) {
    me.Create(s);
  }
  return true;
};

// Process one important incoming message - put it in log.
ByzNode.prototype._sHark_Open = function(a_sLetter) {
  var me = this;
  var as = a_sLetter.split("{");
  var sLetterName = as[0];
  var sLetterContents = as[1];
  as = sLetterContents.split(",");
  var sLetterHash = as[0];
  var iLetterCreator = +as[1];
  var iLetterLogAt = +as[2];
  var whenLetter = +as[3];
  var sLetterData = as[4];
  sLetterData = sLetterData.trim().slice(1, -1);
  var s = iLetterCreator + "," + iLetterLogAt + "," + whenLetter + ',"' + sLetterData;
  if (sLetterHash !== "#" + G.sHASH(s)) {
    console.log("Bad message!!!");
    return "";
  }
  me._a2sLetter[iLetterCreator][iLetterLogAt] = a_sLetter;
  if ("^" === sLetterData[0]) {
    console.log(me._sName + "3 _sHark_Open(" + a_sLetter + ")" + sLetterData + ".");
    return "";
  }
  console.log(me._sName + "4 _sHark_Open(" + a_sLetter + ")" + sLetterData + ".");
  return "^" + "abcde"[iLetterCreator] + iLetterLogAt;
};

// Report everything this node knows (for debug mostly).
ByzNode.prototype.sListLogs = function() {
  var me = this;
  var r_s = me._sName;
  var n = me._a2sLetter.length;
  var m;
  var j;
  for (var i = 0; i < n; i++) {
    r_s += "\n   " + "abcdef"[i] + ":";
    m = me._a2sLetter[i].length;
    if (0 < m) {
      for (j = 0; j < m; j++) {
        r_s += " " + j + "<" + me._a2sLetter[i][j] + ">";
      }
    }
  }
  return r_s;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;

