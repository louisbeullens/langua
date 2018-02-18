'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  var port = process.env.NODE_PORT || app.get('port');
  return app.listen(port, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

function shutdown(server) {
  server.close(function() {
    console.log('gracefully shutting down loopback.');
    process.exit();
  });
  setTimeout(function() {
    console.log('forcing shutdown after 10 seconds.');
    process.exit();
  }, 10000);
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    var server = app.start();
    process.on('SIGTERM', function() {
      shutdown(server);
    });
    process.on('SIGINT', function() {
      shutdown(server);
    });
  }
});
