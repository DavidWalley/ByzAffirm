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
ByzNode.byznodeNEW = function(a_sName, a_iNodeMe, a_nNodes) {
  var ob = new ByzNode;
  if (!ob._bRenew(a_sName, a_iNodeMe, a_nNodes)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzNode.prototype._bRenew = function(a_sName, a_iNodeMe, a_nNodes) {
  var me = this;
  me._sName = a_sName;
  me._iWhich = a_iNodeMe;
  me._nNodes = a_nNodes;
  me._iNodeNext = a_iNodeMe;
  me._byzcrypto = ByzCrypto.byzcryptoNEW(me._iWhich, me._nNodes);
  // For each node, initialize list of copies of encoded and signed message.
  me._a2sLogs = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sLogs[i] = [];
  }
  return true;
};

// Log message to console.
ByzNode.prototype._Tell = function(a_sText) {
  var me = this;
  console.log(" >" + me._sName + " " + g.whenNow_ms() + " " + a_sText);
  return true;
};

// Create and encrypt (sign) item with data-payload in own log.
ByzNode.prototype.CreateLog = function(a_sData_SafeCharacters) {
  var me = this;
  // In production, the data payload should probably be a hash relating back to an original record that is delivered outside of this consensus system.
  var as = a_sData_SafeCharacters.split("^");
  var sReason = ' Real data, so log "';
  if (1 < as.length) {
    if (!(as.length === 3)) {
      throw new Error("ASSERTION: Should be exactly 2 carets.");
    }
    var iNode = +as[1];
    var iAt = +as[2];
    if (iNode < 0 || me._a2sLogs.length <= iNode || iAt < 0 || me._a2sLogs[iNode].length <= iAt) {
      me._Tell("09 This should not happen.");
      return false;
    }
    if (0 <= me._a2sLogs[iNode][iAt].indexOf("^")) {
      me._Tell("10 Drop link to link '" + a_sData_SafeCharacters + "'.");
      return true;
    }
  }
  // Create a log item:
  var s = me._iWhich + "," + me._a2sLogs[me._iWhich].length + "," + g.whenNow_ms() + ', "' + a_sData_SafeCharacters + '"';
  var sEncrypted = me._byzcrypto.sEncryptPrivate_base64(s);
  me._a2sLogs[me._iWhich].push(s + ", " + sEncrypted);
  me._Tell('11 Created "' + sReason + ",>" + s + " " + G.sSHRINK(sEncrypted) + "<" + me.sListOfMyLogs());
  return true;
};

// Create a message to report sizes of all logs kept by this node, for telling another node about extent of what is known.
ByzNode.prototype.sHowMuchIKnow = function() {
  var me = this;
  var r_s = me._sName + " ";
  var n = me._a2sLogs.length;
  for (var i = 0; i < n; i++) {
    r_s += "," + me._a2sLogs[i].length;
  }
  return r_s;
};

// Report everything this node knows (for debug mostly).
ByzNode.prototype.sListOfMyLogs = function() {
  var me = this;
  var r_s = "I, " + me._sName + ", know:";
  var n = me._a2sLogs.length;
  var m;
  var j;
  
  for (var i = 0; i < n; i++) {
    r_s += "\n  " + "abcdef"[i] + ":";
    m = me._a2sLogs[i].length;
    if (0 < m) {
      for (j = 0; j < m; j++) {
        r_s += " [" + G.sSHRINK(me._a2sLogs[i][j]) + "]";
      }
    }
  }
  
  return r_s;
};

// Report what other node does not know, based on what they have said they have now.
ByzNode.prototype.sGetNewsForThem = function(a_sHowMuchTheyKnow) {
  var me = this;
  var r_s = "";
  var as = a_sHowMuchTheyKnow.split(",");
  if (as.length < 2) {
    me._Tell("12 Oops: " + me._sName + " " + JSON.stringify(as));
    return "Error";
  }
  var iOther = parseInt(as[0], 10);
  
  var iOtherNodeAt = 0;
  var iIAmAt = 0;
  for (var i = 1; i < as.length; i++) {
    iOtherNodeAt = parseInt(as[i], 10);
    iIAmAt = me._a2sLogs[i - 1].length;
    for (var j = iOtherNodeAt; j < iIAmAt; j++) {
      r_s += " | " + me._a2sLogs[i - 1][j];
    }
  }
  
  return r_s;
};

// Process all important incoming messages.
ByzNode.prototype.Hark = function(a_sItems) {
  var me = this;
  var asItems = a_sItems.split("|");
  var sItem = "";
  
  var as = [];
  me._Tell("13 " + me.sListOfMyLogs());
  var anLengthWas = [];
  var i = 0;
  for (; i < me._nNodes; i++) {
    anLengthWas[i] = me._a2sLogs[i].length;
  }
  var nItems = asItems.length;
  for (i = 1; i < nItems; i++) {
    sItem = asItems[i].trim();
    me._Tell("14 >" + G.sSHRINK(sItem) + "<");
    if ("" === sItem) {
      me._Tell("15");
      continue;
    }
    
    as = sItem.split(",");
    if (as.length < 5) {
      me._Tell("16");
      continue;
    }
    var iNode = +as[0];
    var iLogAt = +as[1];
    var when = +as[2];
    var sData = as[3].trim();
    if (iNode < 0 || me._a2sLogs.length <= iNode) {
      me._Tell("17");
      continue;
    }
    if (iLogAt < 0) {
      me._Tell("18");
      continue;
    }
    // Verify authorship. If unable to verify authorship, then move on.
    var sPlain = me._byzcrypto.sDecryptPublic(iNode, as[4].trim());
    as = sPlain.split(",");
    if (+as[0].trim() !== iNode) {
      me._Tell("19.1 Error >" + as[0] + "<>" + iNode + "<");
      continue;
    }
    if (+as[1].trim() !== iLogAt) {
      me._Tell("19.2 Error >" + as[1] + "<>" + iLogAt + "<");
      continue;
    }
    if (+as[2].trim() !== when) {
      me._Tell("19.3 Error >" + as[2] + "<>" + when + "<");
      continue;
    }
    if (as[3].trim() !== sData) {
      me._Tell("19.4 Error >" + as[3] + "<>" + sData + "<");
      continue;
    }
    // Pad log if needed.
    while (me._a2sLogs[iNode].length <= iLogAt) {
      me._a2sLogs[iNode].push("x");
    }
    
    if ("x" === me._a2sLogs[iNode][iLogAt]) {
      me._a2sLogs[iNode][iLogAt] = sItem;
    } else {
      if (me._a2sLogs[iNode][iLogAt] === sItem) {
        me._Tell("20 ??? Repeat.");
      } else {
        me._Tell("21 ??? Over-writing.");
      }
    }
    me._Tell("22 " + me.sListOfMyLogs());
  }
  for (i = 0; i < me._nNodes; i++) {
    var n = me._a2sLogs[i].length;
    for (var j = anLengthWas[i]; j < n; j++) {
      s = me._a2sLogs[i][j];
      if ("x" === s) {
        me._a2sLogs[i].length = j;
        break;
      }
      as = s.split(",");
      if (me._a2sLogs[+as[0]][+as[1]] === s) {
        me.CreateLog("^" + +as[0] + "^" + +as[1]);
      } else {
        me._Tell("23 ???" + G.sSHRINK(s) + "?");
      }
    }
  }
  
  return true;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;
