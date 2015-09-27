var irc       = require('irc');

exports.create = function () {
  return new IrcClient();
};

function IrcClient() {
  var client,
      listeners = {};

  /**
   * Connect to IRC server
   * @param string server Server to connect to
   * @param string nickname Nickname
   * @param array channels Channels
   */
  this.connect = function (server, nickname, channels) {
    client = new irc.Client(server, nickname, {
      channels: channels,
    });

    addServerListeners(client);
  };

  /**
   * Discconnect from IRC server
   */
  this.disconnect = function () {
    client.disconnect('YRC power for IRC');
  };

  /**
   * Send message to user or channel
   */
  this.sendMessage = function (data) {
    if (data.channel) {
      client.say(data.channel, data.message);
    }
  };

  /**
   * Join channel
   * @param string channel #channel
   */
  this.join = function (channel) {
      client.join(channel);
  };

  /**
   * Leave channel
   * @param string channel #channel
   */
  this.leave = function (channel) {
      client.part(channel);
  };

  /**
   * Add event listener
   * @param string event Event identifier (receiveMessage)
   * @param function callback Function to call (function (data) {})
   */
  this.on = function (event, callback) {
    listeners[event] = listeners[event] || [];

    listeners[event].push(callback);
  }

  /**
   * Trigger event
   * @param string event Event identifier (receiveMessage)
   * @param object data Data to send to the callback
   */
  function trigger(event, data) {
    if (! listeners.event) {
      return false;
    }

    listeners.event.forEach(function (listener) {
      listener(data);
    });

    return true;
  }

  /**
   * Trigger event
   * @param function client IRC Client instance
   */
  function addServerListeners(client) {
    /**
     * Connection stablished
     */
    client.addListener('registered', function (message) {
      trigger('connected', {});
    });

    /**
     * Message received
     */
    client.addListener('message', function (from, to, message) {
      var data = {
        from: from,
        to: to,
        message: message
      };

      trigger('receiveMessage', data);
    });

    /**
     * Connection stablished
     */
    client.addListener('names', function (channel, nicknames) {
      trigger('users', { channel: channel, users: nicknames });
    });

    /**
     * Connection stablished
     */
    client.addListener('join', function (channel, nickname) {
      trigger('join', { channel: channel, nickname: nickname });
    });

    /**
     * Connection stablished
     */
    client.addListener('part', function (channel, nickname) {
      trigger('leave', { channel: channel, nickname: nickname });
    });

    /**
     * Connection stablished
     */
    client.addListener('quit', function (nickname, reason, channels, message) {
      trigger('disconnect', {
        nickname: nickname,
        reason: reason,
        channels: channels,
        message: message
      });
    });

    /**
     * Connection stablished
     */
    client.addListener('nick', function (channel, nickname) {
      trigger('newNickname', {
        oldNickname: oldnick,
        newNickname: newnick,
        channels: channels
      });
    });

    /**
     * Error handler
     */
    client.addListener('error', function(message) {
      console.log('error: ', message);

      trigger('error', { message: message });
    });
  }
}

