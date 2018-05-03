// G.js - General Purpose JavaScript routines. Global, polluting, but handy code conveniences.
// (c)2018 David C. Walley, MIT license.

// Class of super global, super naughty, but super handy code conveniences.
function G() {
  // Private variables:
  this._whenFakeOffset;
  this._nTestRandomSeed;
}

// Factory constructor of instance of this class.
G.gNEW = function() {
  var ob = new G;
  if (!ob._bRenew()) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
G.prototype._bRenew = function() {
  var me = this;
  me._whenFakeOffset = 0;
  me._nTestRandomSeed = 10;
  return true;
};

G.sVERSION = "DEV";

// Set start-up procedure to run when document object model (DOM) is ready (for running in a browser).
G.ONrEADY = function(a_f) {
  return true;
};

// Hash given text (simple demo hash).
G.sHASH = function(a_s) {
  var r_bits32 = 0;
  if ("" !== a_s) {
    for (var i = 0; i < a_s.length; i++) {
      r_bits32 = (r_bits32 << 5) - r_bits32 + a_s.charCodeAt(i);
      r_bits32 |= 0;
    }
  }
  return (r_bits32 & 65535).toString(16);
};

// Report if a variable is defined (or not).
G.bIS = function(a_v) {
  return "undefined" !== typeof a_v;
};

// Report if a variable is undefined (or defined).
G.bNO = function(a_v) {
  return "undefined" === typeof a_v;
};

// Improved type checker (better than built-in methods).
G.sTYPE = function(a_v) {
  var s = Function.prototype.toString.call(a_v.constructor);
  return s.match(/function (.*)\(/)[1];
};

// Get current time in seconds, possibly offset (for debugging mostly).
G.prototype.whenNow_s = function() {
  var me = this;
  return Math.floor(me.whenNow_ms() * 0.001);
};

// Set a time offset by giving what should be the current time (for debugging mostly).
G.prototype.whenNowTo_ms = function(a_whenNow_ms) {
  var me = this;
  me._whenFakeOffset = a_whenNow_ms - Date.now();
  return 0;
};

// Get current time in milliseconds, possibly offset (for debugging mostly).
G.prototype.whenNow_ms = function() {
  var me = this;
  return Date.now() + me._whenFakeOffset;
};

// Generate a random number within a given range.
G.prototype.dRandom = function(a_nMin, a_nMax) {
  var me = this;
  me._nTestRandomSeed++;
  var x = Math.sin(me._nTestRandomSeed) * 10000;
  return a_nMin + (a_nMax - a_nMin) * (x - Math.floor(x));
};

// Modulus, fixes JavaScript's non-mathematical definition of modulus operation in negative numbers
// (which it confuses with a 'remainder').
G.dMOD = function(a_n, a_m) {
  return (a_n % a_m + a_m) % a_m;
};

// Format a number for display.
G.sFORM = function(a_d, a_nLength, a_nDecimals) {
  if (null == a_d) {
    return "null";
  }
  var s = "                " + a_d;
  var iDot = s.indexOf(".");
  if (iDot < 0) {
    s += ".";
    iDot = s.indexOf(".");
  }
  s += "0000000000000000";
  s = s.slice(iDot - (a_nLength - a_nDecimals) + 1, s.length);
  s = s.slice(0, a_nLength);
  return s;
};

// Convert text or a number to a numerical value, or use a default.
G.dFIX = function(a_v, a_dDefault) {
  if ("number" === typeof a_v) {
    return a_v;
  }
  if ("string" === typeof a_v) {
    return +a_v;
  }
  return +a_dDefault;
};

// Set a variable to a text string, to a default if given a non-text value.
G.sFIX = function(a_v, a_sDefault) {
  if ("string" === typeof a_v) {
    return a_v;
  }
  return a_sDefault;
};

// Collapse long text strings.
G.sSHRINK = function(a_s) {
  if (a_s.length < 96) {
    return a_s;
  }
  var r_s = "";
  var as = a_s.split(" ");
  var n = as.length;
  
  for (var i = 0; i < n; i++) {
    if (as[i].length < 40) {
      r_s += " " + as[i];
    } else {
      r_s += " " + as[i].slice(0, 4) + ".." + as[i].slice(-3);
    }
  }
  
  return r_s;
};

exports.g = G.gNEW();
exports.gNEW = G.gNEW;
exports.sHASH = G.sHASH;
exports.bIS = G.bIS;
exports.bNO = G.bNO;
exports.sTYPE = G.sTYPE;
exports.whenNow_s = G.prototype.whenNow_s;
exports.whenNowTo_ms = G.prototype.whenNowTo_ms;
exports.whenNow_ms = G.prototype.whenNow_ms;
exports.dRandom = G.prototype.dRandom;
exports.dMOD = G.dMOD;
exports.sFORM = G.sFORM;
exports.dFIX = G.dFIX;
exports.sFIX = G.sFIX;
exports.sSHRINK = G.sSHRINK;
