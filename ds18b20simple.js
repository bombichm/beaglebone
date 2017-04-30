var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require ('fs');
var port = 4040;
app.listen(port);
console.log('listening on port', port)

var ds18b20 = require('ds18b20');

var interval = 3000;
function handler (req, res) {
  fs.readFile(__dirname + '/2index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
};

io.on('connection', function (socket) {
  console.log('hello ')
  setInterval(function() {
//fetch array containing each ds18b20 sensor's ID
    var sensorId = [];
    // //fetch array containing each ds18b20 sensor's ID
    ds18b20.sensors(function (err, id) {
        sensorId = id;
        console.log('sensor', id); 
    //     //send sensor ID's to clients
        socket.emit('sensors', id);
    
    ds18b20.temperature(id, function (err, value) {
        //send temperature reading out to connected clients
        var tempF = value * 1.8 + 32.0;
        console.log('temp', tempF);
        socket.emit('temps', {'id': id, 'value': tempF});
    }); 
    });
  },interval);
});