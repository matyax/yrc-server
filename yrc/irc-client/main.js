var irc = require('irc'),
    client = null;

exports.connect = function (server, nickname, channels) {
  client = new irc.Client(server, nickname, {
    channels: channels,
  });

  client.addListener('registered', function (message) {
    console.log(message);
  });

  client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
  });

  client.addListener('error', function(message) {
    console.log('error: ', message);
  });
};

exports.sendMessage = function (data) {
  if (data.channel) {
    client.say(data.channel, data.message);
  }
};