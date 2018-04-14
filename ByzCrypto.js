// ByzCrypto.js - Node.js wrapper for public/private encryption/decryption. RSA used as an example, but can be replaced in future.
// Non-patented content (c)2018 David C. Walley, MIT license.

console.log("ByzCrypto.js running under NODE.");
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
  return true;
};

// Encrypt a message (using a private key - i.e., signing a public message), returning a base-64 encoded text string.
ByzCrypto.prototype.sEncrypt_base64 = function(a_sMessage) {
  var me = this;
  return me._nodersaPrivate.encryptPrivate(a_sMessage, "base64");
};

// Decrypt a message (using a public key - i.e., verifying the origin and integrity of a message).
ByzCrypto.prototype.sDecrypt = function(a_iFrom, a_sEncrypted_base64) {
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
if ("TEST" === sTESTING) {
  var byzcrypto0 = ByzCrypto.byzcryptoNEW(0, 3);
  var sText = "It worked if you can read this.";
  var sEncrypted_base64 = byzcrypto0.sEncrypt_base64(sText);
  var sDecrypted = byzcrypto0.sDecrypt(0, sEncrypted_base64);
  if (sDecrypted === sText) {
    console.log("ok:" + sDecrypted);
  } else {
    console.log("BAD:" + sDecrypted);
  }
}

;
