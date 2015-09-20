var app       = require('http').createServer(handler),
    io        = require('socket.io')(app),
    ircClient = null;

/**
 * Handle undesired HTTP requests.
 */
function handler (req, res) {
  res.writeHead(401);

  return res.end('You should not be doing this.');
}

/**
 * Init web-server
 */
exports.init = function (client) {
  app.listen(81);

  ircClient = client;

  io.on('connection', setupServerListeners);
};

/**
 * Setup event listeners
 */
function setupServerListeners(socket) {
  socket.emit('ready', { hello: 'world' });

  socket.on('start', function (data) {
    ircClient.connect(data.server, data.nickname, data.channels)
  });

  socket.on('sendMessage', function (data) {
    ircClient.sendMessage(data);
  });
}