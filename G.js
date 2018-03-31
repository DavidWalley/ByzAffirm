var gFs3EsRwGHwq;
// G - General Purpose JavaScript routines.
// Super global, super dangerous, but super handy code conveniences.
// (c)2018 David C. Walley

// Class of super global, super dangerous, but super handy code conveniences.
function G() {
  this._whenFakeOffset;
}

G.gNEW = function() {
  var ob = new G;
  if (!ob._bRenew()) {
    return null;
  }
  return ob;
};

G.prototype._bRenew = function() {
  var me = this;
  // Initialize or reset the object.
  me._whenFakeOffset = 0;
  return true;
};

G.sVERSION = "DEV";

// Set start-up procedure to run when document is ready.
G.ONrEADY = function(a_f) {
  return true;
};

// Report if a variable is defined (or not).
G.bIS = function(a_v) {
  return "undefined" !== typeof a_v;
};

// Report if a variable is undefined (or defined).
G.bNO = function(a_v) {
  return "undefined" === typeof a_v;
};

// Better type checker.
G.sTYPE = function(a_v) {
  var s = Function.prototype.toString.call(a_v.constructor);
  return s.match(/function (.*)\(/)[1];
};

// Get current time in seconds, possibly offset (for debugging mostly).
G.prototype.whenNow_s = function() {
  var me = this;
  return Math.floor(me.whenNow_ms() * 0.001);
};

// Set a time offset (for debugging mostly).
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

// Modulus, fixes JavaScript's non-mathematical definition of modulus operation in negative numbers (which it confuses with a 'remainder').
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
  var n = s.length;
  s = s.slice(iDot - (a_nLength - a_nDecimals) + 1, n);
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

exports.bIS = G.bIS;
exports.bNO = G.bNO;
exports.whenNow_s = G.prototype.whenNow_s;
exports.whenNow_ms = G.prototype.whenNow_ms;
exports.dMOD = G.dMOD;
exports.sFORM = G.sFORM;
exports.dFIX = G.dFIX;
exports.sFIX = G.sFIX;

// Create a global instance of the above class.
var g = G.gNEW();

