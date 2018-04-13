// NodeServer_js.php
// Localhost server node for test of multi-server communications.
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
  this._server;
  this._byznode;
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
  me._isPort = 8080 + a_iWhich;
  me._nNodes = a_nNodes;
  me._byznode = ByzNode.byznodeNEW(a_sName, a_iWhich, a_nNodes);
  
  me._server = g_http.createServer(function(a, b) {
    me.HandleRequest(a, b);
  });
  me._server.listen(me._isPort, function() {
    console.log("Server started on: http://localhost:" + me._isPort);
  });
  
  setTimeout(function() {
    me.ONtICK();
  }, 1000 * (a_iWhich + 1));
  
  return true;
};

// Wrapper for creating a new log item.
NodeServer.prototype.Create = function(a_sData) {
  var me = this;
  return me._byznode.Create(a_sData);
};

// Wrapper for reporting a text representation of the message logs of this server.
NodeServer.prototype.sListMyLogs = function() {
  var me = this;
  return me._byznode.sListMyLogs();
};

// PERIODIC:
NodeServer.prototype.ONtICK = function() {
  var me = this;
  console.log("ONtICK " + me._isPort);
  var n = G.dRANDOM(0, me._nNodes);
  me.MakeRequest("localhost", "/?ihave", 8080, me._byznode.sLogsSizes());
  return true;
};

// SERVER:
// Server's request handler - decode request and send response.
NodeServer.prototype.HandleRequest = function(a_request, a_response) {
  var me = this;
  if ("/?kill" === a_request.url) {
    a_response.end("Server " + me._isPort + " die.");
    a_response.end();
    a_request.connection.end();
    a_request.connection.destroy;
    me._server.close();
  }
  
  if ("POST" !== a_request.method) {
    a_response.end("");
    return;
  }
  
  var s = "";
  a_request.on("data", function(a_s) {
    s += a_s;
    if (1000000 < s.length) {
      a_request.connection.destroy();
    }
  });
  
  a_request.on("end", function() {
    var s0 = me.sHandleRequest_Posted(s);
    a_response.end("hey:" + s0 + ".");
  });
  
  return true;
};

// Process POSTed data after it is all re-assembled.
NodeServer.prototype.sHandleRequest_Posted = function(a_s) {
  var me = this;
  var r_s = "yahoo>" + a_s + "<";
  console.log(" " + me._isPort + "-sHandleRequest_Posted--Hark:" + G.sSHRINK(a_s) + ".");
  r_s = me._byznode.sNeeds(a_s);
  console.log(" " + me._isPort + "-sHandleRequest_Posted--Tell:" + G.sSHRINK(r_s) + ".");
  return r_s;
};

// CALL ANOTHER SERVER:
// Make a call to a server on localhost.
NodeServer.prototype.MakeRequest = function(a_sHost, a_sPath, a_isPort, a_sDataPayloadOut) {
  var me = this;
  var requestPost = g_http.request({"method":"POST", "hostname":a_sHost, "path":a_sPath, "port":a_isPort, "headers":{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(a_sDataPayloadOut)}}, function(a_response) {
    a_response.on("data", function(a_chunk) {
      var s = a_chunk.toString();
      console.log(" " + me._isPort + "-MakeRequest--Hark:" + G.sSHRINK(s) + ".");
    });
  });
  requestPost.write(a_sDataPayloadOut);
  requestPost.end();
  return true;
};

exports.nodeserverNEW = NodeServer.nodeserverNEW;

