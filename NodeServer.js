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
  this._sName;
  this._isPort;
  this._nNodes;
  this._httpserver;
  this._byznode;
  this._ticks;
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
  me._sName = a_sName;
  me._isPort = a_iWhich + NodeServer.nROOTpORT;
  me._nNodes = a_nNodes;
  me._byznode = ByzNode.byznodeNEW(a_sName, a_iWhich, a_nNodes);
  me._ticks = 0;
  
  me._httpserver = g_http.createServer(function(a, b) {
    me.HandleRequest(a, b);
  });
  me._httpserver.listen(me._isPort, function() {
    console.log("**50 " + a_sName + " started: http://localhost:" + me._isPort);
  });
  
  setTimeout(function() {
    me.ONtICK();
  }, 100 + 1000 * a_iWhich);
  
  return true;
};

NodeServer.nROOTpORT = 8080;

// Report the sizes of the message logs of this server.
NodeServer.prototype.sHowMuchIKnow = function() {
  var me = this;
  return me._byznode.sHowMuchIKnow();
};

// Report text of message logs of this server.
NodeServer.prototype.sListOfMyLogs = function() {
  var me = this;
  return me._byznode.sListOfMyLogs();
};

// Wrapper for creating a new log item.
NodeServer.prototype.CreateLog = function(a_s) {
  var me = this;
  return me._byznode.CreateLog(a_s);
};

// Process POSTed data after it is all re-assembled.
NodeServer.prototype._sHandleRequest_ReplyToPost = function(a_sHowMuchTheyKnow) {
  var me = this;
  return me._byznode.sGetNewsForThem(a_sHowMuchTheyKnow);
};

// PERIODIC:
NodeServer.prototype.ONtICK = function() {
  var me = this;
  me._ticks++;
  var iOther = 0;
  do {
    iOther = Math.floor(G.dRANDOM(0, me._nNodes)) + NodeServer.nROOTpORT;
  } while (iOther === me._isPort);
  var s = me._byznode.sHowMuchIKnow();
  me._OnTick_MakeRequest("localhost", "/?igot", iOther, s);
  if (me._ticks < 15) {
    setTimeout(function() {
      me.ONtICK();
    }, 2000);
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
  if (!("/?igot" === a_httprequest.url)) {
    throw new Error("ASSERTION: ErrorMessage");
  }
  
  if ("POST" !== a_httprequest.method) {
    a_httpresponse.end("");
    return false;
  }
  
  var sBuffer = "";
  a_httprequest.on("data", function(a_sChunk) {
    sBuffer += a_sChunk;
    if (1000000 < sBuffer.length) {
      a_httprequest.connection.destroy();
    }
  });
  
  a_httprequest.on("end", function() {
    a_httpresponse.end(me._sHandleRequest_ReplyToPost(sBuffer));
  });
  
  return true;
};

// CALL ANOTHER SERVER:
// Make a call to another server on localhost.
NodeServer.prototype._OnTick_MakeRequest = function(a_sHost, a_sPath, a_isPort, a_sDataPayloadOut) {
  var me = this;
  var sRequestNotes = me._sName + "(" + me._isPort + ") " + me._ticks + "t --\x3e to:" + a_isPort + "/?igot " + a_sDataPayloadOut;
  var sBuffer = "";
  var requestPost = g_http.request({"method":"POST", "hostname":a_sHost, "path":a_sPath, "port":a_isPort, "headers":{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(a_sDataPayloadOut)}}, function(a_httpresponse) {
    a_httpresponse.on("data", function(a_chunk) {
      sBuffer += a_chunk.toString();
    });
    a_httpresponse.on("end", function() {
      if ("" !== sBuffer) {
        console.log("**52 " + sRequestNotes + " <-- " + G.sSHRINK(sBuffer));
        me._byznode.Hark(sBuffer);
      }
    });
  });
  requestPost.write(a_sDataPayloadOut);
  requestPost.end();
  return true;
};

exports.nodeserverNEW = NodeServer.nodeserverNEW;

