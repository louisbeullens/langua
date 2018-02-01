'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var Raven = require('raven');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    Raven.config('https://66bff354602649099aacf516e03836b4:b43e1dc613544009a1c1b6ebff4254cb@sentry.io/281436').install();
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
