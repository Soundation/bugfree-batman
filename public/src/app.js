console.log("app");
var ws;

//client events
$('document').ready(function (){

  ws = new WebSocket("ws://localhost:5000");
  initWebsocket();

  $('.post').click(function (){
    sendMessage("userMessage", $('.username').val(), $('.text').val());
  });
});


//client functions
function printMessage (message) {
  var text = message.text;
  var obj = {"foo":"bar"};
  $(".messages").append(message.text);
}
function sendMessage (type, username, text){
  var message = {msgType:type, username:username,text:text};
  ws.send(JSON.stringify(message));
}


//Server communication
function initWebsocket() {
  if ("WebSocket" in window) {

    //open
    ws.onopen = function() {
      sendMessage("start", "jaevel", "Hello Server");
    };

    //message
    ws.onmessage = function (evt)  {
      var message = JSON.parse(evt.data);
      if (message.msgType === 'userMessage') {
        printMessage(message);
      }
    };

    //close
    ws.onclose = function() { 
      // websocket is closed.
      console.log("closing websocket");
    };

  }
  else {
    // The browser doesn't support WebSocket
    console.log("no websocket support");
  }
}