var http, director, cool, bot, router, server, port;

http        = require('http');
director    = require('director');
bot         = require('./bot.js');


function checkBotReady() {
    if (bot) {
      router = new director.http.Router({
        '/' : {
          post: bot.forwardMessage,
          get: ping
        }
      });
      console.log('index.js: bot ready');
    } else {
      setTimeout(checkBotReady, 3000);
      console.log('index.js: bot not ready, checking again in 3000ms');
    }
}

checkBotReady();

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
}
