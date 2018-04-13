// ByzCrypto.js
// Node wrapper for RSA public/private encryption/decryption.
// Non-patented content (c)2018 David C. Walley, MIT license.

console.log("Running under NODE.");
var fs = require("fs");
var NodeRSA = require("node-rsa");

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
  var s = "";
  var sROOTpATH = "C:/$/Code/Byzantine/Crypto/";
  s = fs.readFileSync(sROOTpATH + "privatekey-" + a_iWhichAmI + ".pem").toString();
  me._nodersaPrivate = new NodeRSA(s);
  for (var i = 0; i < a_nNodes; i++) {
    s = fs.readFileSync(sROOTpATH + "publickey-" + i + ".pem").toString();
    me._anodersaPublic[i] = new NodeRSA(s, "public");
  }
  return true;
};

// Encrypt a message (using a private key).
ByzCrypto.prototype.sEncrypt = function(a_sMessage) {
  var me = this;
  return me._nodersaPrivate.encryptPrivate(a_sMessage, "base64");
};

// Decrypt a message (using a public key).
ByzCrypto.prototype.sDecrypt = function(a_iFrom, a_sEncrypted_b64) {
  var me = this;
  var r_s = "";
  try {
    r_s = me._anodersaPublic[a_iFrom].decryptPublic(a_sEncrypted_b64, "utf8");
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
  var sEncrypted_b64 = byzcrypto0.sEncrypt(sText);
  var sDecrypted = byzcrypto0.sDecrypt(0, sEncrypted_b64);
  if (sDecrypted === sText) {
    console.log("ok:" + sDecrypted);
  } else {
    console.log("BAD:" + sDecrypted);
  }
}

;
