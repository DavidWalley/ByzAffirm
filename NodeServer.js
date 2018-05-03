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
  this._byznode;
  this._ticks;
  this._bOnNotOff;
  this._httpserver;
}

// Factory constructor of instance of this class.
NodeServer.nodeserverNEW = function(a_sName, a_iWhich, a_nNodes, a_biztest) {
  var ob = new NodeServer;
  if (!ob._bRenew(a_sName, a_iWhich, a_nNodes, a_biztest)) {
    return null;
  }
  return ob;
};

// Initialize or reset object.
NodeServer.prototype._bRenew = function(a_sName, a_iWhich, a_nNodes, a_biztest) {
  var me = this;
  me._sName = a_sName;
  me._isPort = a_iWhich + NodeServer.nROOTpORT;
  me._nNodes = a_nNodes;
  me._byznode = ByzNode.byznodeNEW(a_sName, a_iWhich, a_nNodes, a_biztest);
  me._ticks = 0;
  me._bOnNotOff = true;
  
  me._httpserver = g_http.createServer(function(a, b) {
    me.HandleRequest(a, b);
  });
  me._httpserver.listen(me._isPort, function() {
    me._Tell("Started: http://localhost:" + me._isPort);
  });
  
  setTimeout(function() {
    me.ONtICK();
  }, 100 + 500 * a_iWhich);
  
  return true;
};

NodeServer.nROOTpORT = 8080;

// Cause server to stop responding.
NodeServer.prototype.TurnOff = function() {
  var me = this;
  me._bOnNotOff = false;
};

// Report the sizes of the logs of this server.
NodeServer.prototype.sHowMuchIKnow = function() {
  var me = this;
  return me._byznode.sHowMuchIKnow();
};

// Report text of memo logs of this server.
NodeServer.prototype.sShowMyCopies = function() {
  var me = this;
  return me._byznode.sShowMyCopies();
};

// Wrapper for creating a brand new memo.
NodeServer.prototype.MakeMemo = function(a_s) {
  var me = this;
  me._byznode.MakeMemo(g.whenNow_ms(), a_s);
};

// Periodic routine:
NodeServer.prototype.ONtICK = function() {
  var me = this;
  if (!me._bOnNotOff) {
    return false;
  }
  me._ticks++;
  var iOther = 0;
  do {
    iOther = Math.floor(g.dRandom(0, me._nNodes)) + NodeServer.nROOTpORT;
  } while (iOther === me._isPort);
  var s = me._byznode.sHowMuchIKnow();
  
  me._OnTick_MakeRequest("localhost", "/?igot", iOther, s);
  if (me._ticks < 1000) {
    setTimeout(function() {
      me.ONtICK();
    }, 500);
  } else {
    me._Tell("51 Shutting down periodic routine on " + me._isPort + ".");
  }
  return true;
};

// SERVER:
// Server's request handler - decode request and send response.
NodeServer.prototype.HandleRequest = function(a_httprequest, a_httpresponse) {
  var me = this;
  if (!me._bOnNotOff) {
    return false;
  }
  
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
  // Process POSTed data after it is all re-assembled.
  a_httprequest.on("end", function() {
    a_httpresponse.end(me._byznode.sGetNewsForCaller(sBuffer));
  });
  
  return true;
};

// Make a call to another server on localhost.
NodeServer.prototype._OnTick_MakeRequest = function(a_sHost, a_sPath, a_isPort, a_sDataPayloadOut) {
  var me = this;
  var sRequestNotes = a_sDataPayloadOut + " ==> " + a_isPort;
  var sBuffer = "";
  var requestPost = g_http.request({"method":"POST", "hostname":a_sHost, "path":a_sPath, "port":a_isPort, "headers":{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(a_sDataPayloadOut)}}, function(a_httpresponse) {
    a_httpresponse.on("data", function(a_chunk) {
      sBuffer += a_chunk.toString();
    });
    
    a_httpresponse.on("end", function() {
      if (0 <= sBuffer.indexOf("|")) {
        me._Tell(sRequestNotes + "." + G.sSHRINK(sBuffer));
        me._byznode.Hark(sBuffer);
      }
    });
  });
  requestPost.write(a_sDataPayloadOut);
  requestPost.end();
  return true;
};

// Log message to console.
NodeServer.prototype._Tell = function(a_sText) {
  var me = this;
  console.log("^" + g.whenNow_ms() + " " + me._sName.toUpperCase() + " " + a_sText);
  return true;
};

exports.nodeserverNEW = NodeServer.nodeserverNEW;
