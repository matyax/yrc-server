var ircClient = require('./yrc/irc-client/main.js'),
    webServer = require('./yrc/web-server/main.js');

webServer.init(ircClient);
