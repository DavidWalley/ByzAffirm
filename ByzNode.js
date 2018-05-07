// ByzNode.js - Network Node in ByzAffirm Async BFTolerant communications scheme simulation.
// Non-patented content (c)2018 David C. Walley, MIT license.

// .           cam2                        dan3
// .            |                           |
// .        MakeMemo()                      |                                                A message might originate on node 'cam'. Sign it (encrypt) with timestamp of originating nodes' clock.
// .   Send sHowMuchIKnow() --------------->|              e.g. '2,15000012,0,0,1,1,0'       Report self, system clock, and sizes of all copies of logs kept by this node, for telling another node about extent of what is known here.
// .            |                 Check clock difference                                     Reject messages with system clock that is far off from our own.
// .            |                   sGetNewsForCaller()    e.g. '3 | 15000342 | ... | ....'  Dan gets what he knows cam doesn't know.
// .            |<--------------------------|
// .  Check clock difference                |
// .          Hark()                        |
// .  Check clock difference                |
// .    _Hark_Process()                     |
// .            |                           |

var G = require("./G.js");
var g = G.g;
var ByzCrypto = require("./ByzCrypto.js");
var byzcrypto;
var ByzTest = require("./ByzTest.js");

// ByzAffirm network node class constructor.
function ByzNode() {
  // Private variables:
  this._byztestMom;
  this._iWhich;
  this._nNodes;
  this._takeErr_ms;
  this._sName;
  this._byzcrypto;
  this._a2sMemos;
  this._awhenFinalizedAt;
}

// Factory constructor of instance of this class.
ByzNode.byznodeNEW = function(a_byztestMom, a_iWhichMe, a_nNodes, a_takeErr_ms) {
  var ob = new ByzNode;
  if (!ob._bRenew(a_byztestMom, a_iWhichMe, a_nNodes, a_takeErr_ms)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzNode.prototype._bRenew = function(a_byztestMom, a_iWhichMe, a_nNodes, a_takeErr_ms) {
  var me = this;
  me._byztestMom = a_byztestMom;
  me._iWhich = a_iWhichMe;
  me._nNodes = a_nNodes;
  me._takeErr_ms = a_takeErr_ms;
  me._sName = G.sNAME(me._iWhich) + me._iWhich;
  me._byzcrypto = ByzCrypto.byzcryptoNEW(me._iWhich, me._nNodes);
  // For each node, initialize lists of copies of encoded and signed memo.
  me._a2sMemos = [];
  me._awhenFinalizedAt = [];
  for (var i = 0; i < me._nNodes; i++) {
    me._a2sMemos[i] = [];
    me._awhenFinalizedAt[i] = -1;
  }
  return true;
};

ByzNode.takeOKsHORT_ms = 600;
ByzNode.takeOKgOSSIP_ms = 5000;
ByzNode.sMEMOtIE = "|";
ByzNode.sFIELDtIE = ",";
ByzNode.sLINK = "^";

// System clock time for node (is off by a preset amount).
ByzNode.prototype._whenNowMe_ms = function() {
  var me = this;
  return g.whenNow_ms() + me._takeErr_ms;
};

// Create and encrypt (sign) a brand new memo with data-payload in own log.
ByzNode.prototype.MakeMemo = function(a_sData_base64) {
  var me = this;
  // In production, the data payload should probably be a hash relating back to
  // an original record that is delivered separately from this consensus system.
  var as = a_sData_base64.split(ByzNode.sLINK);
  davidwalley_caZQHGF = 'Check to see if it is a link (reference), e.g. "^0^2" meaning "link to ann\'s log, memo 2".davidwalley_caZQHGF';
  if (1 < as.length) {
    if (!(as.length === 3)) {
      throw new Error("ASSERTION: Should be exactly 2 carets.");
    }
    var iNode = +as[1];
    var iMemo = +as[2];
    if (iNode < 0 || me._a2sMemos.length <= iNode) {
      me._Tell("*Error10");
      return;
    }
    if (iMemo < 0 || me._a2sMemos[iNode].length <= iMemo) {
      me._Tell("*Error11");
      return;
    }
    if (0 <= me._a2sMemos[iNode][iMemo].indexOf(ByzNode.sLINK)) {
      me._Tell("drop '" + a_sData_base64 + "'.");
      return;
    }
  }
  // Create a memo:
  var s = me._iWhich + "," + me._a2sMemos[me._iWhich].length + "," + me._whenNowMe_ms() + "," + a_sData_base64;
  var sEncrypted = me._byzcrypto.sEncryptPrivate_base64(s);
  me._a2sMemos[me._iWhich].push(s + ", " + sEncrypted);
};

// Report sizes of all copies of logs kept by this node, for telling another node about extent of what is known.
ByzNode.prototype.sHowMuchIKnow = function() {
  var me = this;
  var r_s = me._iWhich + ByzNode.sFIELDtIE + me._whenNowMe_ms();
  for (var i = 0; i < me._nNodes; i++) {
    r_s += ByzNode.sFIELDtIE + me._a2sMemos[i].length;
  }
  return r_s;
};

// Report what other node does not know, based on what they have said they have now.
ByzNode.prototype.sGetNewsForCaller = function(a_sHowMuchCallerKnows) {
  var me = this;
  var whenNowMe_ms = me._whenNowMe_ms();
  var r_s = me._iWhich + " " + ByzNode.sMEMOtIE + " " + whenNowMe_ms;
  var asFields = a_sHowMuchCallerKnows.split(ByzNode.sFIELDtIE);
  if (asFields.length < 3) {
    me._Tell("Error1: " + JSON.stringify(asFields));
    return "Error1";
  }
  var iCaller = +asFields[0];
  var whenCaller_ms = +asFields[1];
  var tookDelta_ms = whenNowMe_ms - whenCaller_ms;
  // Check synchronicity of clocks.
  if (tookDelta_ms < -ByzNode.takeOKsHORT_ms) {
    me._Tell("Error2 TOO SOON '" + a_sHowMuchCallerKnows + "' " + whenCaller_ms + " (" + tookDelta_ms + ").");
    return "Error2";
  }
  if (ByzNode.takeOKsHORT_ms < tookDelta_ms) {
    me._Tell("Error3 TOO LONG '" + a_sHowMuchCallerKnows + "' " + whenCaller_ms + " (" + tookDelta_ms + ").");
    return "Error3";
  }
  
  var iIAmAt = 0;
  var iNode = 0;
  for (var i = 2; i < asFields.length; i++, iNode++) {
    iIAmAt = me._a2sMemos[iNode].length;
    for (var j = +asFields[i]; j < iIAmAt; j++) {
      r_s += " " + ByzNode.sMEMOtIE + " " + me._a2sMemos[iNode][j];
    }
  }
  
  return r_s;
};

// Process all important incoming memos.
ByzNode.prototype.Hark = function(a_sDebugNotes, a_sAllMemosIn) {
  var me = this;
  var whenNowMe_ms = me._whenNowMe_ms();
  var asIn = a_sAllMemosIn.split(ByzNode.sMEMOtIE);
  var iOther = +asIn[0];
  var whenOther_ms = +asIn[1];
  var tookDelta_ms = whenNowMe_ms - whenOther_ms;
  // Check synchronicity of clocks.
  if (tookDelta_ms < -ByzNode.takeOKsHORT_ms) {
    me._Tell("*Error4 TOO SOON '" + a_sAllMemosIn.slice(0, 50) + "' " + whenOther_ms + " (" + tookDelta_ms + ").");
    return;
  }
  if (ByzNode.takeOKsHORT_ms < tookDelta_ms) {
    me._Tell("*Error5 TOO LONG '" + a_sAllMemosIn.slice(0, 50) + "' " + whenOther_ms + " (" + tookDelta_ms + ").");
    return;
  }
  
  var nIns = asIn.length;
  if (2 < nIns) {
    me._Tell("Hark: " + a_sDebugNotes + ". " + G.sSHRINK(a_sAllMemosIn));
    var anLengthWas = [];
    for (var i = 0; i < me._nNodes; i++) {
      anLengthWas[i] = me._a2sMemos[i].length;
    }
    
    for (var iIn = 2; iIn < nIns; iIn++) {
      me._Hark_Process(asIn[iIn].trim());
    }
    me._Cleanup(anLengthWas);
  }
  if (me._awhenFinalizedAt[iOther] <= whenOther_ms) {
    me._awhenFinalizedAt[iOther] = whenOther_ms;
  } else {
    me._Tell("*Error6 '" + a_sAllMemosIn + "'.");
  }
  if (2 < nIns) {
    me._byztestMom.ShowAll();
  }
  return;
};

// Process one item reported by another node.
ByzNode.prototype._Hark_Process = function(a_sMemo) {
  var me = this;
  if ("" === a_sMemo) {
    me._Tell("???15");
    return;
  }
  me._Tell("processes" + G.sSHRINK(a_sMemo));
  
  var as = a_sMemo.split(ByzNode.sFIELDtIE);
  if (as.length < 5) {
    me._Tell("???16");
    return;
  }
  var iMemosNode = +as[0];
  var iMemosMemo = +as[1];
  var whenMemo = +as[2];
  var sMemosData = as[3].trim();
  if (me._whenNowMe_ms() + ByzNode.takeOKsHORT_ms < whenMemo) {
    me._Tell("TIME TRAVEL ERROR. '" + a_sMemo + "'");
    return;
  }
  if (whenMemo + ByzNode.takeOKgOSSIP_ms < me._whenNowMe_ms()) {
    me._Tell("DEAD MESSAGE '" + a_sMemo + "'.");
    return;
  }
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
  as = sPlain.split(ByzNode.sFIELDtIE);
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

// Report known data payloads, timestamp, and the certainty of timestamp.
ByzNode.prototype.sWhichIsFirst = function(a_Node0, a_Memo0, a_Node1, a_Memo1) {
  var me = this;
  var r_s = "thinks:";
  
  r_s += " can compare...";
  return r_s + "!";
};

// Clean up missing spaces and/or bad links in table.
ByzNode.prototype._Cleanup = function(a_anLengthWas) {
  var me = this;
  for (var i = 0; i < me._nNodes; i++) {
    var n = me._a2sMemos[i].length;
    for (var j = a_anLengthWas[i]; j < n; j++) {
      var s = me._a2sMemos[i][j];
      if ("" === s) {
        me._a2sMemos[i].length = j;
        break;
      }
      var as = s.split(ByzNode.sFIELDtIE);
      if (s === me._a2sMemos[+as[0]][+as[1]]) {
        me.MakeMemo(ByzNode.sLINK + +as[0] + ByzNode.sLINK + +as[1]);
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
  console.log("." + g.whenNow_ms() + " " + me._sName + " " + me._whenNowMe_ms() + " " + a_sText);
  return true;
};

// Report everything this node knows (for debug mostly).
ByzNode.prototype.sShowMyCopies = function() {
  var me = this;
  var whenNowMe_ms = me._whenNowMe_ms();
  me._awhenFinalizedAt[me._iWhich] = whenNowMe_ms;
  var r_s = me._sName + " (" + whenNowMe_ms + ") has heard:";
  var n = me._a2sMemos.length;
  var m;
  var j;
  
  for (var i = 0; i < n; i++) {
    if (i === me._iWhich) {
      r_s += "\n  " + "ABCDEF"[i] + "  = ";
    } else {
      r_s += "\n  " + "abcdef"[i] + i + " > ";
    }
    r_s += me._awhenFinalizedAt[i] + ":";
    m = me._a2sMemos[i].length;
    for (j = 0; j < m; j++) {
      r_s += " [" + G.sSHRINK(me._a2sMemos[i][j]) + "]";
    }
  }
  
  r_s += "\n  " + me.sWhichIsFirst(1, 0, 2, 0);
  return r_s;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;
