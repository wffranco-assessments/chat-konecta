const port = 3000;

var proxy = require('express-http-proxy');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// servir archivo desde node_modules
var node_modules = __dirname.replace(/[^\/\\]+$/, 'node_modules');
function module_file(public, private) {
  app.get(public, (req, res) => {
    res.sendFile(node_modules + private);
  });
}

module_file('/bootstrap.css', '/bootstrap/dist/css/bootstrap.min.css');
module_file('/jquery.js', '/jquery/dist/jquery.min.js');

app.use('/', proxy('localhost:4200'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat-msg', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat-msg', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

/*
const io = require('socket.io')(80);
const cfg = require('./config.json');
const tw = require('node-tweet-stream')(cfg);

tw.track('socket.io');
tw.track('javascript');
tw.on('tweet', function(tweet){
  io.emit('tweet', tweet);
});
/**/
