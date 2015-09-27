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
     * Error handler
     */
    client.addListener('error', function(message) {
      console.log('error: ', message);

      trigger('error', { message: message });
    });
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
}

