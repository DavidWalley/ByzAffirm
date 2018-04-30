// ByzNode.js - Network Node in ByzAffirm Async BFTolerant communications scheme simulation.
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
  this._biztest;
  this._iNodeNext;
  this._byzcrypto;
  this._a2sMemos;
}

// Factory constructor of instance of this class.
ByzNode.byznodeNEW = function(a_sName, a_iWhichMe, a_nNodes, a_biztest) {
  var ob = new ByzNode;
  if (!ob._bRenew(a_sName, a_iWhichMe, a_nNodes, a_biztest)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzNode.prototype._bRenew = function(a_sName, a_iWhichMe, a_nNodes, a_biztest) {
  var me = this;
  me._sName = a_sName;
  me._iWhich = a_iWhichMe;
  me._nNodes = a_nNodes;
  me._biztest = a_biztest;
  me._iNodeNext = a_iWhichMe;
  me._byzcrypto = ByzCrypto.byzcryptoNEW(me._iWhich, me._nNodes);
  // For each node, initialize lists of copies of encoded and signed memo.
  me._a2sMemos = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sMemos[i] = [];
  }
  return true;
};

// Create and encrypt (sign) memo with data-payload in own log.
ByzNode.prototype.MakeMemo = function(a_when_ms, a_sData_base64) {
  var me = this;
  // In production, the data payload should probably be a hash relating back to an original record that is delivered outside of this consensus system.
  var as = a_sData_base64.split("^");
  if (1 < as.length) {
    if (!(as.length === 3)) {
      throw new Error("ASSERTION: Should be exactly 2 carets.");
    }
    var iMemosNode = +as[1];
    var iMemo = +as[2];
    if (iMemosNode < 0 || me._a2sMemos.length <= iMemosNode || iMemo < 0 || me._a2sMemos[iMemosNode].length <= iMemo) {
      me._Tell("Error: This should not happen.");
      return;
    }
    if (0 <= me._a2sMemos[iMemosNode][iMemo].indexOf("^")) {
      me._Tell("drops '" + a_sData_base64 + "'.");
      return;
    }
  }
  // Create a memo:
  var s = me._iWhich + "," + me._a2sMemos[me._iWhich].length + "," + a_when_ms + "," + a_sData_base64;
  var sEncrypted = me._byzcrypto.sEncryptPrivate_base64(s);
  me._a2sMemos[me._iWhich].push(s + ", " + sEncrypted);
};

// Create a memo to report sizes of all logs kept by this node, for telling another node about extent of what is known.
ByzNode.prototype.sHowMuchIKnow = function() {
  var me = this;
  var r_s = me._sName;
  var n = me._a2sMemos.length;
  for (var i = 0; i < n; i++) {
    r_s += "," + me._a2sMemos[i].length;
  }
  return r_s;
};

// Determing when the given memo was first created.
ByzNode.prototype._whenMade = function(a_iNode, a_iMemo) {
  var me = this;
  var asMemo;
  var asData;
  var nSize;
  for (var i = 0; i < me._nNodes; i++) {
    nSize = me._a2sMemos[i].length;
    for (var j = 0; j < nSize; j++) {
      asMemo = me._a2sMemos[i][j].split(",");
      asData = asMemo[3].split("^");
      if (1 === asData.length && +asMemo[0] === a_iNode && +asMemo[1] === a_iMemo) {
        return +asMemo[2];
      }
    }
  }
  return -1;
};

// Report known data payloads, timestamp, and the certainty of timestamp.
ByzNode.prototype.sWhichIsFirst = function(a_Node0, a_Memo0, a_Node1, a_Memo1) {
  var me = this;
  var r_s = "thinks:";
  
  var whenMake0 = me._whenMade(a_Node0, a_Memo0);
  if (whenMake0 < 0) {
    return r_s + "?";
  }
  var whenMake1 = me._whenMade(a_Node1, a_Memo1);
  if (whenMake1 < 0) {
    return r_s + "?";
  }
  r_s += " can compare...";
  return r_s + "!";
};

// Report what other node does not know, based on what they have said they have now.
ByzNode.prototype.sGetNewsForCaller = function(a_sHowMuchTheyKnow) {
  var me = this;
  var r_s = me._sName + " replies ";
  var as = a_sHowMuchTheyKnow.split(",");
  if (as.length < 2) {
    me._Tell("13 Oops: " + me._sName + " " + JSON.stringify(as));
    return "Error";
  }
  // First number is index of inquiring node.
  var iOther = parseInt(as[0], 10);
  var iOtherNodeAt = 0;
  var iIAmAt = 0;
  for (var i = 1; i < as.length; i++) {
    iOtherNodeAt = parseInt(as[i], 10);
    iIAmAt = me._a2sMemos[i - 1].length;
    for (var j = iOtherNodeAt; j < iIAmAt; j++) {
      r_s += "|" + me._a2sMemos[i - 1][j];
    }
  }
  
  return r_s;
};

// Process all important incoming memos.
ByzNode.prototype.Hark = function(a_sMemos) {
  var me = this;
  var asMemos = a_sMemos.split("|");
  var as = [];
  var anLengthWas = [];
  var i = 0;
  for (; i < me._nNodes; i++) {
    anLengthWas[i] = me._a2sMemos[i].length;
  }
  
  var nMemos = asMemos.length;
  var whenNow_ms = g.whenNow_ms();
  for (i = 1; i < nMemos; i++) {
    me._Hark_Process(asMemos[i].trim());
  }
  me._Cleanup(anLengthWas, whenNow_ms);
  me._biztest.ShowAll();
  return true;
};

// Process one item reported by another node.
ByzNode.prototype._Hark_Process = function(a_sMemo) {
  var me = this;
  if ("" === a_sMemo) {
    me._Tell("???15");
    return;
  }
  me._Tell("processes" + G.sSHRINK(a_sMemo));
  
  var as = a_sMemo.split(",");
  if (as.length < 5) {
    me._Tell("???16");
    return;
  }
  var iMemosNode = +as[0];
  var iMemosMemo = +as[1];
  var whenMemo = +as[2];
  var sMemosData = as[3].trim();
  if (iMemosNode < 0 || me._a2sMemos.length <= iMemosNode) {
    me._Tell("???17");
    return;
  }
  if (iMemosMemo < 0) {
    me._Tell("???18");
    return;
  }
  // Verify authorship. If unable to verify authorship, then move on.
  var sPlain = me._byzcrypto.sDecryptPublic(iMemosNode, as[4].trim());
  as = sPlain.split(",");
  if (+as[0].trim() !== iMemosNode || +as[1].trim() !== iMemosMemo || +as[2].trim() !== whenMemo || as[3].trim() !== sMemosData) {
    me._Tell("???19 Error " + as[3] + " " + sMemosData);
    return;
  }
  
  while (me._a2sMemos[iMemosNode].length <= iMemosMemo) {
    me._a2sMemos[iMemosNode].push("");
  }
  
  if ("" === me._a2sMemos[iMemosNode][iMemosMemo]) {
    me._a2sMemos[iMemosNode][iMemosMemo] = a_sMemo;
    return;
  }
  if (me._a2sMemos[iMemosNode][iMemosMemo] === a_sMemo) {
    me._Tell("???20 Repeat.");
  } else {
    me._Tell("???21 Over-writing.");
  }
};

// Clean up missing spaces and/or bad links in table.
ByzNode.prototype._Cleanup = function(a_anLengthWas, a_whenNow_ms) {
  var me = this;
  for (var i = 0; i < me._nNodes; i++) {
    var n = me._a2sMemos[i].length;
    for (var j = a_anLengthWas[i]; j < n; j++) {
      var s = me._a2sMemos[i][j];
      if ("" === s) {
        me._a2sMemos[i].length = j;
        break;
      }
      var as = s.split(",");
      if (s === me._a2sMemos[+as[0]][+as[1]]) {
        me.MakeMemo(a_whenNow_ms, "^" + +as[0] + "^" + +as[1]);
      } else {
        me._Tell("???" + G.sSHRINK(s) + "?");
      }
    }
  }
  return true;
};

// Display memo in console.
ByzNode.prototype._Tell = function(a_sText) {
  var me = this;
  console.log("." + g.whenNow_ms() + " " + me._sName + " " + a_sText);
  return true;
};

// Report everything this node knows (for debug mostly).
ByzNode.prototype.sShowMyCopies = function() {
  var me = this;
  var r_s = me._sName + " has heard:";
  var n = me._a2sMemos.length;
  var m;
  var j;
  
  for (var i = 0; i < n; i++) {
    r_s += "\n  " + "abcdef"[i] + ":";
    m = me._a2sMemos[i].length;
    if (0 < m) {
      for (j = 0; j < m; j++) {
        r_s += " [" + G.sSHRINK(me._a2sMemos[i][j]) + "]";
      }
    }
  }
  
  r_s += "\n  " + me.sWhichIsFirst(1, 0, 2, 0);
  return r_s;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;
