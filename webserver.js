//-- Routing stuff
var express = require("express");
var app = express();
var path = require('path');


app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.listen(8080);




//-- Websocket stuff

var WebSocketServer = require("ws").Server;
var http = require("http");
var port = process.env.PORT || 5000;

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var users = [];
var messages  = [];


var userId;
var wss = new WebSocketServer({server: server});
wss.on("connection", function (ws) {

  var timestamp = new Date().getTime();
  userId = timestamp;

  ws.send(JSON.stringify({msgType:"onOpenConnection", msg:{connectionId:timestamp}}));

  ws.on("message", function (data, flags) {
    var messageO = JSON.parse(data);
    var message = {msgType: messageO.msgType, username: messageO.username, text:messageO.text};
    messages.push(message);
    
    broadcast(message);
  });

  ws.on("close", function () {
    console.log("websocket connection close");
  });
  
  
  //functions 

  function broadcast (message){
    ws.send(JSON.stringify(message));
  }
});
console.log("websocket server created");