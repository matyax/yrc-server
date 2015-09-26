var irc       = require('irc');

exports.create = function () {
  return new IrcClient();
};

function IrcClient() {
  var client,
      listeners = {};

  this.connect = function (server, nickname, channels) {
    client = new irc.Client(server, nickname, {
      channels: channels,
    });

    client.addListener('registered', function (message) {
      console.log(message);
    });

    client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);

      if (listeners.receiveMessage) {
        var data = {
          from: from,
          to: to,
          message: message
        };

        listeners.receiveMessage.forEach(function (listener) {
          listener(data);
        });
      }
    });

    client.addListener('error', function(message) {
      console.log('error: ', message);
    });
  };

  this.disconnect = function () {
    client.disconnect('YRC power for IRC');
  };

  this.sendMessage = function (data) {
    if (data.channel) {
      client.say(data.channel, data.message);
    }
  };

  this.on = function (event, callback) {
    listeners[event] = listeners[event] || [];

    listeners[event].push(callback);
  }
}

