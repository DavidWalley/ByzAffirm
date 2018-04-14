// NodeServer_js.php - Node.js localhost server, for testing one node of ByzAffirm multi-node communications.
// (c)2018 David C. Walley, MIT license.

var g_http = require("http");
var ByzNode = require("./ByzNode.js");
if ("undefined" === typeof g) {
  var G = require("./G.js");
  var g = G.g;
}


// Constructor to run a node.js server.
function NodeServer() {
  // Private variables:
  this._isPort;
  this._nNodes;
  this._httpserver;
  this._byznode;
  this._when_ticks;
}

// Factory constructor of instance of this class.
NodeServer.nodeserverNEW = function(a_sName, a_iWhich, a_nNodes) {
  var ob = new NodeServer;
  if (!ob._bRenew(a_sName, a_iWhich, a_nNodes)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
NodeServer.prototype._bRenew = function(a_sName, a_iWhich, a_nNodes) {
  var me = this;
  me._isPort = NodeServer.nROOTpORT + a_iWhich;
  me._nNodes = a_nNodes;
  me._byznode = ByzNode.byznodeNEW(a_sName, a_iWhich, a_nNodes);
  me._when_ticks = 0;
  
  me._httpserver = g_http.createServer(function(a, b) {
    me.HandleRequest(a, b);
  });
  me._httpserver.listen(me._isPort, function() {
    console.log("Server started on: http://localhost:" + me._isPort);
  });
  
  setTimeout(function() {
    me.ONtICK();
  }, 1000 * (a_iWhich + 1));
  
  return true;
};

NodeServer.nROOTpORT = 8080;
// Wrapper for creating a new log item.
NodeServer.prototype.Create = function(a_sData) {
  var me = this;
  return me._byznode.Create(a_sData);
};

// Wrapper for reporting the sizes of the message logs of this server.
NodeServer.prototype.sIKnowAbout = function() {
  var me = this;
  return me._byznode.sIKnowAbout();
};

// Wrapper for reporting a text representation of the message logs of this server.
NodeServer.prototype.sShowMyLogs = function() {
  var me = this;
  return me._byznode.sShowMyLogs();
};

// PERIODIC:
NodeServer.prototype.ONtICK = function() {
  var me = this;
  me._when_ticks++;
  console.log("ONtICK " + me._isPort + " " + me._when_ticks);
  var n = 0;
  do {
    n = Math.floor(G.dRANDOM(0, me._nNodes)) + NodeServer.nROOTpORT;
  } while (n === me._isPort);
  me.MakeRequest("localhost", "/?iknow", n, me._byznode.sIKnowAbout());
  if (me._when_ticks < 5) {
    setTimeout(me.ONtICK, 10000);
  }
  return true;
};

// SERVER:
// Server's request handler - decode request and send response.
NodeServer.prototype.HandleRequest = function(a_httprequest, a_httpresponse) {
  var me = this;
  if ("/?kill" === a_httprequest.url) {
    a_httpresponse.end("Server " + me._isPort + " die.");
    a_httpresponse.end();
    a_httprequest.connection.end();
    a_httprequest.connection.destroy;
    me._httpserver.close();
  }
  
  if ("POST" !== a_httprequest.method) {
    a_httpresponse.end("");
    return false;
  }
  
  var s = "";
  a_httprequest.on("data", function(a_s) {
    s += a_s;
    if (1000000 < s.length) {
      a_httprequest.connection.destroy();
    }
  });
  
  a_httprequest.on("end", function() {
    var s0 = me.sHandleRequest_Posted(s);
    a_httpresponse.end("hey:" + s0 + ".");
  });
  
  return true;
};

// Process POSTed data after it is all re-assembled.
NodeServer.prototype.sHandleRequest_Posted = function(a_s) {
  var me = this;
  var r_s = me._byznode.sWhatIKnowTheyDoNot(a_s);
  console.log(" " + me._isPort + " Hark:" + G.sSHRINK(a_s) + " Reply:" + G.sSHRINK(r_s) + ".");
  return r_s;
};

// CALL ANOTHER SERVER:
// Make a call to a server on localhost.
NodeServer.prototype.MakeRequest = function(a_sHost, a_sPath, a_isPort, a_sDataPayloadOut) {
  var me = this;
  var requestPost = g_http.request({"method":"POST", "hostname":a_sHost, "path":a_sPath, "port":a_isPort, "headers":{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(a_sDataPayloadOut)}}, function(a_httpresponse) {
    a_httpresponse.on("data", function(a_chunk) {
      var s = a_chunk.toString();
      console.log(" " + me._isPort + " Reply:" + G.sSHRINK(s) + ".");
      me._byznode.Hark(s);
    });
  });
  requestPost.write(a_sDataPayloadOut);
  requestPost.end();
  return true;
};

exports.nodeserverNEW = NodeServer.nodeserverNEW;

