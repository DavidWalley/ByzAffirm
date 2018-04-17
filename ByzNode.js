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
  // For each node, initialize list of copies of encoded and signed message.
  me._a2sLogs = [];
  for (var i = 0; i < a_nNodes; i++) {
    me._a2sLogs[i] = [];
  }
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
      console.log("**09 " + me._sName + " This should not happen.");
      return false;
    }
    if (0 <= me._a2sLogs[iNode][iAt].indexOf("^")) {
      console.log("**10 " + me._sName + ' Drop link to link "' + a_sData_SafeCharacters + '".');
      return true;
    }
  }
  // Create a log item:
  var s = me._iWhich + "," + me._a2sLogs[me._iWhich].length + "," + g.whenNow_ms() + ', "' + a_sData_SafeCharacters + '"';
  var sEncrypted = me._byzcrypto.sEncryptPrivate_base64(s);
  me._a2sLogs[me._iWhich].push(s + ", " + sEncrypted);
  console.log("**11 " + me._sName + ' Created "' + sReason + ",>" + s + " " + G.sSHRINK(sEncrypted) + "<" + me.sListOfMyLogs());
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
    console.log("Oops: " + me._sName + " " + JSON.stringify(as));
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
ByzNode.prototype.Hark = function(a_sSackOfLetters) {
  var me = this;
  var is = 0;
  var asLetter = a_sSackOfLetters.split("|");
  
  var n = asLetter.length;
  var bMoreToDo = true;
  var nDebugLimit = 1;
  do {
    nDebugLimit--;
    if (nDebugLimit < 0) {
      console.log("Ooooooops");
      if (!false) {
        throw new Error("ASSERTION: Oooooops");
      }
    }
    bMoreToDo = false;
    for (var i = 1; i < n; i++) {
      is = me._isHark_Open(asLetter[i].trim());
      if (0 < is) {
        bMoreToDo = true;
      }
    }
  } while (bMoreToDo);
  
  return true;
};

// Process one important incoming message - put it in log.
ByzNode.prototype._isHark_Open = function(a_sLetter) {
  var me = this;
  if ("" === a_sLetter) {
    return -1;
  }
  var as = a_sLetter.split(",");
  var iCreator = +as[0];
  var iLogAt = +as[1];
  var when = +as[2];
  var sData = as[3].trim();
  var sAllEncrypted = as[4].trim();
  var sDecrypted = me._byzcrypto.sDecryptPublic(iCreator, sAllEncrypted);
  var isResult = me._isHark_Open_Verify(a_sLetter, sDecrypted, iCreator, iLogAt, when, sData);
  if (0 !== isResult) {
    return isResult;
  }
  console.log("**37 " + me._sName + " OK {" + G.sSHRINK(a_sLetter) + '} = "^' + iCreator + "^" + iLogAt + '".');
  as = a_sLetter.split("^");
  var sReason = "???";
  if (as.length <= 1) {
    sReason = "No caret, links to data, so go ahead.";
  } else {
    if (+as[1] !== me._iWhich) {
      sReason = "Different " + as[1] + " != " + me._iWhich + ", so go ahead.";
    } else {
      console.log("**38 " + me._sName + " NOT logging this, links back to self.");
      return -9;
    }
  }
  me.CreateLog("^" + iCreator + "^" + iLogAt + " ");
  return 0;
};

// Verify plaintext and encrypted messages match.
ByzNode.prototype._isHark_Open_Verify = function(a_sLetter, sDecrypted, iCreator, iLogAt, when, sData) {
  var me = this;
  var as = sDecrypted.split(",");
  if (+as[0].trim() !== iCreator) {
    console.log("##30 " + me._sName + " Error >" + as[0] + "<>" + iCreator + "<");
    return -2;
  }
  if (+as[1].trim() !== iLogAt) {
    console.log("##31 " + me._sName + " Error >" + as[1] + "<>" + iLogAt + "<");
    return -3;
  }
  if (+as[2].trim() !== when) {
    console.log("##32 " + me._sName + " Error >" + as[2] + "<>" + when + "<");
    return -4;
  }
  if (as[3].trim() !== sData) {
    console.log("##33 " + me._sName + " Error >" + as[3] + "<>" + sData + "<");
    return -5;
  }
  
  me._a2sLogs[iCreator][iLogAt] = a_sLetter;
  console.log("**35 " + me._sName + " --- logging " + iCreator + "," + iLogAt + "=" + G.sSHRINK(a_sLetter) + "<" + me.sListOfMyLogs());
  // Check for link to make sure it is pointing to a valid, existing entry:
  if (iCreator < 0) {
    return -6;
  }
  if (me._a2sLogs.length <= iCreator) {
    return -7;
  }
  if (iLogAt < 0) {
    return -8;
  }
  if (me._a2sLogs[iCreator].length <= iLogAt) {
    // Report that we will have to try this again later.
    return 1;
  }
  return 0;
};

exports.byznodeNEW = ByzNode.byznodeNEW;
exports.g = g;

