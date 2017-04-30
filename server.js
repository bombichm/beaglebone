var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var port = 4040;
app.listen(port);
console.log('listening on port', port)

var interval = 3000;
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
};
var counter = 0;
io.on('connection', function (socket) {
  setInterval(function () {
  counter++;
  console.log(counter);
  socket.emit('counter', counter);
  // socket.on('counter rx', function (data) {
  //   console.log('counter returned ', data);
  // });
},interval);
});