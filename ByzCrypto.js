// ByzCrypto.js - Node.js wrapper for public/private encryption/decryption. RSA used as an example, but can be replaced in future.
// Non-patented content (c)2018 David C. Walley, MIT license.

console.log("ByzCrypto.js running under NODE.");
var G = require("./G.js");
var fs = require("fs");
var NodeRSA = require("node-rsa");
var Passwords = require("./TestPasswords.js");

// Wrapper for public/private cryptographic messaging.
function ByzCrypto() {
  // Private variables:
  this._nodersaPrivate;
  this._anodersaPublic;
}

// Factory constructor of instance of this class.
ByzCrypto.byzcryptoNEW = function(a_iWhichAmI, a_nNodes) {
  var ob = new ByzCrypto;
  if (!ob._bRenew(a_iWhichAmI, a_nNodes)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
ByzCrypto.prototype._bRenew = function(a_iWhichAmI, a_nNodes) {
  var me = this;
  me._anodersaPublic = [];
  me._nodersaPrivate = new NodeRSA(Passwords.sKEY(false, a_iWhichAmI));
  me._anodersaPublic[0] = new NodeRSA(Passwords.sKEY(true, 0), "public");
  me._anodersaPublic[1] = new NodeRSA(Passwords.sKEY(true, 1), "public");
  me._anodersaPublic[2] = new NodeRSA(Passwords.sKEY(true, 2), "public");
  me._anodersaPublic[3] = new NodeRSA(Passwords.sKEY(true, 3), "public");
  me._anodersaPublic[4] = new NodeRSA(Passwords.sKEY(true, 4), "public");
  return true;
};

// Encrypt a message (using a private key - i.e., signing a public message), returning a base-64 encoded text string.
ByzCrypto.prototype.sEncryptPrivate_base64 = function(a_sMessage) {
  var me = this;
  return me._nodersaPrivate.encryptPrivate(a_sMessage, "base64");
};

// Decrypt a message (using a public key - i.e., verifying the origin and integrity of a message).
ByzCrypto.prototype.sDecryptPublic = function(a_iFrom, a_sEncrypted_base64) {
  var me = this;
  var r_s = "";
  try {
    r_s = me._anodersaPublic[a_iFrom].decryptPublic(a_sEncrypted_base64, "utf8");
  } catch (e) {
    r_s = "ERROR";
  }
  return r_s;
};

var sTESTING = "";
exports.byzcryptoNEW = ByzCrypto.byzcryptoNEW;
sTESTING = process.argv[3];
var sEncrypted = "";
var s = "";
var t = "It worked if you can read this.";
if ("TEST" === sTESTING) {
  var byzcrypto0 = ByzCrypto.byzcryptoNEW(0, 5);
  var byzcrypto1 = ByzCrypto.byzcryptoNEW(1, 5);
  var byzcrypto2 = ByzCrypto.byzcryptoNEW(2, 5);
  var byzcrypto3 = ByzCrypto.byzcryptoNEW(3, 5);
  var byzcrypto4 = ByzCrypto.byzcryptoNEW(4, 5);
  sEncrypted = byzcrypto0.sEncryptPrivate_base64(t);
  s = byzcrypto0.sDecryptPublic(0, sEncrypted);
  if (s === t) {
    console.log("ok1:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto1.sDecryptPublic(0, sEncrypted);
  if (s === t) {
    console.log("ok2:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto2.sDecryptPublic(0, sEncrypted);
  if (s === t) {
    console.log("ok3:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(0, sEncrypted);
  if (s === t) {
    console.log("ok4:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto4.sDecryptPublic(0, sEncrypted);
  if (s === t) {
    console.log("ok5:" + s);
  } else {
    console.log("BAD:" + s);
  }
  sEncrypted = byzcrypto1.sEncryptPrivate_base64(t);
  s = byzcrypto0.sDecryptPublic(1, sEncrypted);
  if (s === t) {
    console.log("ok6:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto1.sDecryptPublic(1, sEncrypted);
  if (s === t) {
    console.log("ok7:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto2.sDecryptPublic(1, sEncrypted);
  if (s === t) {
    console.log("ok8:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(1, sEncrypted);
  if (s === t) {
    console.log("ok9:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto4.sDecryptPublic(1, sEncrypted);
  if (s === t) {
    console.log("ok10:" + s);
  } else {
    console.log("BAD:" + s);
  }
  sEncrypted = byzcrypto2.sEncryptPrivate_base64(t);
  s = byzcrypto0.sDecryptPublic(2, sEncrypted);
  if (s === t) {
    console.log("ok11:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto1.sDecryptPublic(2, sEncrypted);
  if (s === t) {
    console.log("ok12:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto2.sDecryptPublic(2, sEncrypted);
  if (s === t) {
    console.log("ok13:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(2, sEncrypted);
  if (s === t) {
    console.log("ok14:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto4.sDecryptPublic(2, sEncrypted);
  if (s === t) {
    console.log("ok15:" + s);
  } else {
    console.log("BAD:" + s);
  }
  sEncrypted = byzcrypto3.sEncryptPrivate_base64(t);
  s = byzcrypto0.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("ok16:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto1.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("ok17:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto2.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("ok18:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("ok19:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto4.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("ok20:" + s);
  } else {
    console.log("BAD:" + s);
  }
  sEncrypted = byzcrypto4.sEncryptPrivate_base64(t);
  s = byzcrypto0.sDecryptPublic(4, sEncrypted);
  if (s === t) {
    console.log("ok21:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto1.sDecryptPublic(4, sEncrypted);
  if (s === t) {
    console.log("ok22:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto2.sDecryptPublic(4, sEncrypted);
  if (s === t) {
    console.log("ok23:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(4, sEncrypted);
  if (s === t) {
    console.log("ok24:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto4.sDecryptPublic(4, sEncrypted);
  if (s === t) {
    console.log("ok25:" + s);
  } else {
    console.log("BAD:" + s);
  }
  s = byzcrypto3.sDecryptPublic(3, sEncrypted);
  if (s === t) {
    console.log("OK26:" + s);
  } else {
    console.log("bad:" + s);
  }
}

;
