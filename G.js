// G - General Purpose JavaScript routines.
// Super global, super dangerous, but super handy code conveniences.
// (c)2018 David C. Walley

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
  me._whenFakeOffset = 0;
  return true;
};

G.sVERSION = "DEV";
G.ONrEADY = function(a_f) {
  return true;
};

G.bIS = function(a_v) {
  return "undefined" !== typeof a_v;
};

G.bNO = function(a_v) {
  return "undefined" === typeof a_v;
};

G.sTYPE = function(a_v) {
  var s = Function.prototype.toString.call(a_v.constructor);
  return s.match(/function (.*)\(/)[1];
};

G.prototype.whenNow_s = function() {
  var me = this;
  return Math.floor(me.whenNow_ms() * 0.001);
};

G.prototype.whenNowTo_ms = function(a_whenNow_ms) {
  var me = this;
  me._whenFakeOffset = a_whenNow_ms - Date.now();
  return 0;
};

G.prototype.whenNow_ms = function() {
  var me = this;
  return Date.now() + me._whenFakeOffset;
};

G.dMOD = function(a_n, a_m) {
  return (a_n % a_m + a_m) % a_m;
};

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

G.dFIX = function(a_v, a_dDefault) {
  if ("number" === typeof a_v) {
    return a_v;
  }
  if ("string" === typeof a_v) {
    return +a_v;
  }
  return +a_dDefault;
};

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
var g = G.gNEW();

