var app       = require('express')(),
    server    = require('http').Server(app),
    io        = require('socket.io')(server),
    irc       = require('../irc-client/main.js'),
    users     = [];

/**
 * Init web-server
 */
exports.init = function () {
  server.listen(81);

  app.get('/', function (req, res) {
    res.send('You should not be doing this.');
  });

  io.on('connection', setupSocketListeners);
};

/**
 * Setup event listeners
 */
function setupSocketListeners(socket) {
  socket.emit('ready', { message: 'Welcome user ' + socket.id });

  var user = getUser(socket.id);

  socket.on('start', function (data) {
    ircClient = irc.create();

    ircClient.connect(data.server, data.nickname, data.channels);

    user.ircClient = ircClient;

    setupServerListeners(socket, ircClient);
  });

  socket.on('sendMessage', function (data) {
    user.ircClient.sendMessage(data);
  });

  socket.on('disconnect', function (data) {
    if (user.ircClient) {
      user.ircClient.disconnect();
    }
  });
}

function setupServerListeners(socket, ircClient) {
  ircClient.on('receiveMessage', function (data) {
    socket.emit('receiveMessage', data);
  });
}

/**
 * Get client
 * User object: { 
 *   id,
 *   ircClient
 * }
 */
function getUser(id) {
  users.forEach(function (user) {
    if (user.id === id) {
      return user;
    }
  });

  var user = { id: id };
  users.push(user);

  return user;
}