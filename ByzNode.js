// ByzNode.js - Network Node in ByzAffirm Async BFTolerant communications scheme test.
// Non-patented content (c)2018 David C. Walley, MIT license.

var G = require("./G.js");
var g = G.g;
var ByzCrypto = require("./ByzCrypto.js");
var byzcrypto;

// ByzAffirm network node class constructor.
function ByzNode() {
  // Private variables:
  this._sName;
  this._iWhich;
  this._nNodes;
  this._iNodeNext;
  this._byzcrypto;
  this._a2sLogs;
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
  me._iNodeNext = a_iWhich;
  me._byzcrypto = ByzCrypto.byzcryptoNEW(me._iWhich, me._nNodes);
  // Create empty table of copies of all nodes' logs.
  me._a2sLogs = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sLogs[i] = [];
  }
  return true;
};

// Create item with data-payload in own log.
ByzNode.prototype.Create = function(a_sData) {
  var me = this;
  var when = g.whenNow_ms();
  var i = me._a2sLogs[me._iWhich].length;
  me._a2sLogs[me._iWhich].push(me._sSealAndSign(i, a_sData, when));
  return true;
};

// Encrypt and sign a message (or at least fake it for display and testing).
ByzNode.prototype._sSealAndSign = function(a_i, a_sData, a_when) {
  var me = this;
  var s = me._iWhich + "," + a_i + "," + a_when + ', "' + a_sData + '"';
  var sEncrypted = me._byzcrypto.sEncrypt_base64(s);
  return "{" + s + ", " + sEncrypted + "}";
};

// Create a message to report sizes of all logs kept by this node, for telling another node about extent of what is known.
ByzNode.prototype.sIKnowAbout = function() {
  var me = this;
  var r_s = "" + me._iWhich;
  var n = me._a2sLogs.length;
  for (var i = 0; i < n; i++) {
    r_s += (0 === i ? "[" : ",") + me._a2sLogs[i].length;
  }
  r_s += "]";
  return r_s;
};

// Report everything this node knows (for debug mostly).
ByzNode.prototype.sShowMyLogs = function() {
  var me = this;
  var r_s = "**" + me._sName;
  var n = me._a2sLogs.length;
  var m;
  var j;
  
  for (var i = 0; i < n; i++) {
    r_s += "\n   " + "abcdef"[i] + ":";
    m = me._a2sLogs[i].length;
    if (0 < m) {
      for (j = 0; j < m; j++) {
        r_s += " " + j + "{" + G.sSHRINK(me._a2sLogs[i][j]) + "}";
      }
    }
  }
  
  return r_s;
};

// Report what other node does not know, based on what they have said they have now.
ByzNode.prototype.sGetNewsForThem = function(a_sLogSizesOfOtherNode) {
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
    iIAmAt = me._a2sLogs[i].length;
    for (var j = iOtherNodeAt; j < iIAmAt; j++) {
      r_s += " | " + me._a2sLogs[i][j];
    }
  }
  
  return r_s;
};

// Process all important incoming messages.
ByzNode.prototype.Hark = function(a_sSackOfLetters) {
  var me = this;
  console.log("6--- " + me._sName + ".Hark(" + G.sSHRINK(a_sSackOfLetters) + ").");
  var s = "";
  var asLetter = a_sSackOfLetters.split("|");
  
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
  console.log("20-- " + G.sSHRINK(a_sLetter));
  var as = a_sLetter.split("{");
  var sLetterContents = as[1].trim();
  as = sLetterContents.split(",");
  var iLetterCreator = +as[0];
  var iLetterLogAt = +as[1];
  var whenLetter = +as[2];
  var sLetterData = as[3].trim();
  var sLetterEncrypted = as[4].trim();
  console.log("21--" + " iLetterCreator:" + iLetterCreator + " iLetterLogAt:" + iLetterLogAt + " whenLetter:" + whenLetter + " sLetterData:" + sLetterData);
  var sDecrypted = me._byzcrypto.sDecrypt(iLetterCreator, sLetterEncrypted);
  as = sDecrypted.split(",");
  if (+as[0] !== iLetterCreator) {
    return "???0";
  }
  if (+as[1] !== iLetterLogAt) {
    return "???1";
  }
  if (+as[2] !== whenLetter) {
    return "???2";
  }
  if (as[3] !== sLetterData) {
    return "???3";
  }
  
  me._a2sLogs[iLetterCreator][iLetterLogAt] = a_sLetter;
  
  if ("^" === sLetterData[0]) {
    console.log("7 " + me._sName + " _sHark_Open(" + a_sLetter + ")" + sLetterData + ".");
    return "";
  }
  
  console.log("8 " + me._sName + " _sHark_Open(" + a_sLetter + ")" + sLetterData + ".");
  return "^" + "abcde"[iLetterCreator] + iLetterLogAt;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;

