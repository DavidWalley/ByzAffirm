// NodeServerByzNode_js.php
// Localhost server node for test of multi-server communications.
// (c)2018 David C. Walley, MIT license.

var g_http = require("http");
var ByzNode = require("./ByzNode.js");
var G = require("./G.js");
var g = G.g;

var PORT = 8080;
// SERVER:
// Handle a request from a client:
function HandleRequest(a_request, a_response) {
  a_response.end("Dave's server says url = '" + a_request.url + "'.");
  if ("/?kill" === a_request.url) {
    a_response.end();
    a_request.connection.end();
    a_request.connection.destroy;
    g_server.close();
  }
  if ("POST" !== a_request.method) {
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
    HandleRequest_Posted(s);
  });
}

// Process POSTed data after it is all re-assembled.
function HandleRequest_Posted(a_sDataPayloadIn) {
  console.log("Posted: >>" + a_sDataPayloadIn + "<<");
}

// Start a server.
var g_server = g_http.createServer(HandleRequest);
g_server.listen(PORT, function() {
  console.log("Latest server code has started on: http://localhost:" + PORT);
});
// CALL ANOTHER SERVER:
// Make a call to a server on localhost.
function MakeRequest(a_sHost, a_sPath, a_sDataPayloadOut) {
  var requestPost = g_http.request({"method":"POST", "hostname":a_sHost, "port":PORT, "path":a_sPath, headers:{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(a_sDataPayloadOut)}}, function(a_response) {
    a_response.on("data", function(a_chunk) {
      console.log("chunk >" + a_chunk.toString() + "<.");
    });
  });
  requestPost.write(a_sDataPayloadOut);
  requestPost.end();
}

// PERIODIC:
function OnTick() {
  console.log("OnTick");
  MakeRequest("localhost", "/?ihave", "01234");
  setTimeout(OnTick, 10000);
}

setTimeout(OnTick, 1000);

